import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/admin/AuthContext.jsx';
import { db } from '../../firebase-config';
import { 
  collection, 
  getDocs, 
  query, 
  doc, 
  deleteDoc, 
  collectionGroup,
  where, 
  orderBy 
} from '@firebase/firestore';
import CustomDropdown from '../../components/admin/ui/CustomDropdown.jsx';
import competitionMapping from '../../data/competition-mapping.json';

export default function AdminDashboard() {
  const { currentUser, adminData, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for registrations and loading
  const [registrations, setRegistrations] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // State for deletion
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCompetitionId, setDeleteCompetitionId] = useState(null);
  const [deleteRegistrationId, setDeleteRegistrationId] = useState(null);
  
  // Fetch registrations and competitions
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get all competitions
        const competitionsSnapshot = await getDocs(collection(db, 'competitions'));
        const competitionsData = competitionsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setCompetitions(competitionsData);
        
        // Get all registrations using collectionGroup query
        const registrationsQuery = query(
          collectionGroup(db, 'registrations'),
          orderBy('timestamp', 'desc')
        );
        
        const registrationsSnapshot = await getDocs(registrationsQuery);
        
        // Process registrations with competition info
        const registrationsData = registrationsSnapshot.docs.map(doc => {
          const data = doc.data();
          const competitionId = doc.ref.path.split('/')[1]; // ID of the competition, e.g., "comp-abc"
          
          const matchedCompetition = competitionsData.find(c => c.id === competitionId);
          let competitionDisplayName;

          if (matchedCompetition) {
            // Competition document was found in the fetched competitions list
            competitionDisplayName = matchedCompetition.title || competitionId;
          } else {
            // Use predefined mapping as fallback
            competitionDisplayName = competitionMapping.competitions[competitionId] || `${competitionId} (Details Missing)`;
          }
          
          return {
            id: doc.id,
            competitionId, // Store the actual competition ID
            competitionName: competitionDisplayName, // Store the name to be displayed
            ...data,
            timestamp: data.timestamp?.toDate() || new Date(),
          };
        });
        
        setRegistrations(registrationsData);
        
        // Use competitions from Firestore if available, otherwise use predefined mapping
        if (competitionsData.length === 0) {
          const predefinedCompetitions = Object.entries(competitionMapping.competitions).map(([id, title]) => ({
            id,
            title
          }));
          setCompetitions(predefinedCompetitions);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load registrations. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin.html');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  
  // Handle registration deletion
  const confirmDelete = (competitionId, registrationId) => {
    setDeleteCompetitionId(competitionId);
    setDeleteRegistrationId(registrationId);
    setShowDeleteModal(true);
  };
  
  const handleDelete = async () => {
    if (!deleteCompetitionId || !deleteRegistrationId) return;
    
    setDeletingId(deleteRegistrationId);
    
    try {
      // Delete the registration from Firestore
      const registrationRef = doc(db, 'competitions', deleteCompetitionId, 'registrations', deleteRegistrationId);
      await deleteDoc(registrationRef);
      
      // Update local state
      setRegistrations(registrations.filter(reg => reg.id !== deleteRegistrationId));
      
      // Close the modal
      setShowDeleteModal(false);
      setDeleteCompetitionId(null);
      setDeleteRegistrationId(null);
    } catch (err) {
      console.error("Error deleting registration:", err);
      setError("Failed to delete registration. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };
  
  // Handle view details
  const handleViewDetails = (competitionId, registrationId) => {
    navigate(`/admin/registration/${competitionId}/${registrationId}`);
  };
  
  // Filtered and sorted registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter(reg => {
        // Filter by search term (fullName, school, email, phone)
        const searchMatch = searchTerm === '' || 
          reg.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          reg.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.phone?.includes(searchTerm);
        
        // Filter by competition
        const competitionMatch = selectedCompetition === 'all' || reg.competitionId === selectedCompetition;
        
        // Filter by category
        const categoryMatch = selectedCategory === 'all' || reg.category === selectedCategory;
        
        return searchMatch && competitionMatch && categoryMatch;
      })
      .sort((a, b) => {
        // Sort by selected field
        if (sortBy === 'fullName') {
          return sortDirection === 'asc' 
            ? (a.fullName || '').localeCompare(b.fullName || '') 
            : (b.fullName || '').localeCompare(a.fullName || '');
        }
        
        if (sortBy === 'email') {
          return sortDirection === 'asc' 
            ? (a.email || '').localeCompare(b.email || '') 
            : (b.email || '').localeCompare(a.email || '');
        }
        
        if (sortBy === 'competition') {
          return sortDirection === 'asc' 
            ? (a.competitionName || '').localeCompare(b.competitionName || '') 
            : (b.competitionName || '').localeCompare(a.competitionName || '');
        }
        
        if (sortBy === 'category') {
          return sortDirection === 'asc' 
            ? (a.category || '').localeCompare(b.category || '') 
            : (b.category || '').localeCompare(a.category || '');
        }
        
        // Default: sort by timestamp
        return sortDirection === 'asc' 
          ? a.timestamp - b.timestamp 
          : b.timestamp - a.timestamp;
      });
  }, [registrations, searchTerm, selectedCompetition, selectedCategory, sortBy, sortDirection]);
  
  // Get unique categories for dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    registrations.forEach(reg => {
      if (reg.category) uniqueCategories.add(reg.category);
    });
    return Array.from(uniqueCategories);
  }, [registrations]);
  
  // Get unique competitions from registrations (for accurate counter)
  const uniqueCompetitions = useMemo(() => {
    const uniqueComps = new Set();
    registrations.forEach(reg => {
      if (reg.competitionId) uniqueComps.add(reg.competitionId);
    });
    return Array.from(uniqueComps);
  }, [registrations]);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background elements - REMOVED German flag theme */}
      <div className="fixed inset-0 z-0">
        {/* Changed to a darker, black-based gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
        {/* Optional: subtle pattern or texture instead of flag image */}
        {/* <div className="absolute inset-0 opacity-5" style={{background: "url('path/to/subtle-dark-pattern.png') center/cover no-repeat fixed"}}></div> */}
        {/* REMOVED German flag top border */}
      </div>
      
      {/* Subtle glass elements - these can be enhanced by admin-style.css */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(3)].map((_, i) => {
          const size = Math.random() * 400 + 200;
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          
          return (
            <div 
              key={i}
              // Adjusted for darker theme - more subtle white/grey with low opacity
              className="absolute rounded-full backdrop-blur-lg bg-white/[0.01]" 
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
              }}
            />
          );
        })}
      </div>
      
      {/* Header with glass effect - adjusted for black theme */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-gray-700/50 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* REMOVED German flag themed logo - replaced with simple text or a new SVG icon */}
            {/* <div className="flex mr-3">
              <div className="h-6 w-2.5 bg-black rounded-l"></div>
              <div className="h-6 w-2.5 bg-red-700"></div>
              <div className="h-6 w-2.5 bg-yellow-500 rounded-r"></div>
            </div> */}
            {/* Consider a monochrome or simple icon here */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <span className="text-gray-400 text-sm hidden md:flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {adminData?.name || currentUser.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-gray-800/50 hover:bg-gray-700/60 text-white text-sm border border-gray-700/50 rounded-lg backdrop-blur-sm shadow-lg transition-all duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 relative z-10">
        {/* Main content card - adjusted for black glass theme */}
        <div className="backdrop-blur-lg bg-black/50 border border-gray-700/50 rounded-xl p-6 shadow-2xl">
          {/* Section header - REMOVED German flag accent */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              {/* Optional: a subtle dark-themed accent line */}
              {/* <div className="h-1 w-16 mb-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full"></div> */}
              <h2 className="text-xl font-bold mb-2 flex items-center text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Registration Management
              </h2>
              <p className="text-gray-400 text-sm">Manage all competition registrations for German Day 2025</p>
            </div>
            
            <button
              onClick={() => navigate('/admin/submissions')}
              className="group flex items-center px-4 py-2 backdrop-blur-md bg-gray-800/30 hover:bg-gray-700/40 border border-gray-600/50 hover:border-gray-500/70 rounded-lg text-gray-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-sm font-medium">Submissions</span>
            </button>
          </div>
          
          {/* Stats - adjusted for black glass theme */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="backdrop-blur-md bg-gray-900/40 border border-gray-700/50 rounded-lg p-4 transition-transform hover:transform hover:translate-y-[-5px]">
              <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                TOTAL REGISTRATIONS
              </h3>
              <p className="text-3xl font-bold text-gray-200">{registrations.length}</p>
            </div>
            
            <div className="backdrop-blur-md bg-gray-900/40 border border-gray-700/50 rounded-lg p-4 transition-transform hover:transform hover:translate-y-[-5px]">
              <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                COMPETITIONS
              </h3>
              <p className="text-3xl font-bold text-gray-200">{uniqueCompetitions.length}</p>
            </div>
            
            <div className="backdrop-blur-md bg-gray-900/40 border border-gray-700/50 rounded-lg p-4 transition-transform hover:transform hover:translate-y-[-5px]">
              <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                FILTERED RESULTS
              </h3>
              <p className="text-3xl font-bold text-gray-200">{filteredRegistrations.length}</p>
            </div>
          </div>
          
          {/* Filters - adjusted for black glass theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="w-full px-4 pl-10 py-3 bg-gray-800/60 border border-gray-700/70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500"
                />
              </div>
            </div>
            
            {/* Competition Filter */}
            <div>
              <CustomDropdown
                label="Competition"
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                options={[
                  { value: 'all', label: 'All Competitions' },
                  ...competitions.map(comp => ({
                    value: comp.id,
                    label: comp.title || comp.id
                  }))
                ]}
                placeholder="Select a competition"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <CustomDropdown
                label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...categories.map(category => ({
                    value: category,
                    label: category
                  }))
                ]}
                placeholder="Select a category"
              />
            </div>
            
            {/* Sort Options */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sort By</label>
              <div className="flex">
                <div className="flex-grow">
                  <CustomDropdown
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    options={[
                      { value: 'timestamp', label: 'Date' },
                      { value: 'fullName', label: 'Name' },
                      { value: 'email', label: 'Email' },
                      { value: 'competition', label: 'Competition' },
                      { value: 'category', label: 'Category' }
                    ]}
                    className="rounded-r-none" // This will be handled by CustomDropdown styles or overridden
                    // Ensure CustomDropdown itself uses black/glass theme via its own classes or props
                  />
                </div>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-3 bg-gray-800/60 border border-gray-700/70 rounded-r-lg text-white focus:outline-none hover:bg-gray-700/70 transition-colors"
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Error Message - adjusted for black glass theme */}
          {error && (
            <div className="bg-red-900/40 border border-red-700/60 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {/* Registrations Table - adjusted for black glass theme */}
          <div className="overflow-auto rounded-lg border border-gray-700/50 backdrop-blur-md bg-black/30">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-black/40">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">School</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Competition</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30 bg-black/20">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {/* Adjusted spinner color for dark theme */}
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <tr 
                      key={registration.id}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-200">{registration.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{registration.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {registration.schoolName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {registration.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {registration.competitionName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.category ? (
                          // Adjusted pill for dark theme
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                            {registration.category}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {registration.timestamp ? new Date(registration.timestamp).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(registration.competitionId, registration.id)}
                          className="text-blue-400 hover:text-blue-300 mr-3 transition-colors" // Changed to blue for better contrast on dark
                        >
                          View
                        </button>
                        <button
                          onClick={() => confirmDelete(registration.competitionId, registration.id)}
                          disabled={deletingId === registration.id}
                          className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === registration.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Results count - adjusted for dark theme */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </div>
        </div>
      </main>
      
      {/* Delete Confirmation Modal - adjusted for black glass theme */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full backdrop-blur-lg bg-black/60 border border-gray-700/50 rounded-xl p-6 shadow-2xl transform transition-all duration-300 animate-fadeIn">
            <div className="mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-900/40 border border-red-700/60 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-center mb-2 text-gray-200">Confirm Deletion</h3>
              <p className="text-center text-gray-400">Are you sure you want to delete this registration? This action cannot be undone.</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/60 text-white text-sm border border-gray-700/50 rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-700/70 hover:bg-red-600/80 text-white text-sm rounded-lg transition-all duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add style for the animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
