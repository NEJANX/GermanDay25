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

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
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
          const competitionId = doc.ref.path.split('/')[1];
          
          return {
            id: doc.id,
            competitionId,
            competitionName: competitionsData.find(c => c.id === competitionId)?.title || 'Unknown',
            ...data,
            timestamp: data.timestamp?.toDate() || new Date(),
          };
        });
        
        setRegistrations(registrationsData);
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
        // Filter by search term (fullName, email, phone)
        const searchMatch = searchTerm === '' || 
          reg.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
  
  return (
    <div className="min-h-screen text-white">
      {/* Header with glass effect */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 py-4 px-6 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mr-3 shadow-lg">
              <span className="text-black font-bold text-sm">GD</span>
            </div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <span className="text-white/70 text-sm hidden md:flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {currentUser.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="admin-btn admin-btn-secondary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="admin-card backdrop-blur-lg bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Registration Management
          </h2>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stats-card backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border-white/20">
              <h3 className="text-lg font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Total Registrations
              </h3>
              <p className="text-3xl font-bold text-yellow-400">{registrations.length}</p>
            </div>
            
            <div className="stats-card backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border-white/20">
              <h3 className="text-lg font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Competitions
              </h3>
              <p className="text-3xl font-bold text-yellow-400">{competitions.length}</p>
            </div>
            
            <div className="stats-card backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border-white/20">
              <h3 className="text-lg font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtered Results
              </h3>
              <p className="text-3xl font-bold text-yellow-400">{filteredRegistrations.length}</p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block text-sm text-white/70 mb-1">Search</label>
              <div className="search-input-container">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone..."
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
              <label className="block text-sm text-white/70 mb-1">Sort By</label>
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
                    className="rounded-r-none"
                  />
                </div>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-3 bg-white/10 border border-white/10 rounded-r-lg text-white focus:outline-none hover:bg-white/20"
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}
          
          {/* Registrations Table */}
          <div className="overflow-auto rounded-lg border border-white/10 backdrop-blur-md bg-black/20">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Competition</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-white/70">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <tr 
                      key={registration.id}
                    >
                      <td>
                        <div className="font-medium">{registration.fullName || 'N/A'}</div>
                        <div className="text-sm text-white/70">{registration.phone || 'No phone'}</div>
                      </td>
                      <td>
                        {registration.email || 'N/A'}
                      </td>
                      <td>
                        {registration.competitionName || 'Unknown'}
                      </td>
                      <td>
                        {registration.category ? (
                          <span className="category-pill">
                            {registration.category}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td>
                        {registration.timestamp ? new Date(registration.timestamp).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="text-right text-sm">
                        <button
                          onClick={() => handleViewDetails(registration.competitionId, registration.id)}
                          className="text-yellow-400 hover:text-yellow-300 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => confirmDelete(registration.competitionId, registration.id)}
                          disabled={deletingId === registration.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
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
          
          {/* Results count */}
          <div className="mt-4 text-sm text-white/70">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </div>
        </div>
      </main>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6 shadow-2xl transform transition-all duration-300 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Confirm Deletion
            </h3>
            <p className="mb-6">Are you sure you want to delete this registration? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="admin-btn admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="admin-btn admin-btn-danger flex items-center"
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
    </div>
  );
}