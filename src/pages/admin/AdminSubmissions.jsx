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
  orderBy
} from '@firebase/firestore';
import CustomDropdown from '../../components/admin/ui/CustomDropdown.jsx';

function AdminSubmissions() {
  const { currentUser, adminData, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for submissions and loading
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // State for deletion
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubmissionId, setDeleteSubmissionId] = useState(null);
  
  // Fetch all submissions
  useEffect(() => {
    async function fetchSubmissions() {
      try {
        setLoading(true);
        
        const submissionsQuery = query(
          collection(db, 'submissions'),
          orderBy('submittedAt', 'desc')
        );
        
        const submissionsSnapshot = await getDocs(submissionsQuery);
        
        const submissionsData = submissionsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            submittedAt: data.submittedAt?.toDate() || new Date(),
          };
        });
        
        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubmissions();
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
  
  // Handle submission deletion
  const confirmDelete = (submissionId) => {
    setDeleteSubmissionId(submissionId);
    setShowDeleteModal(true);
  };
  
  const handleDelete = async () => {
    if (!deleteSubmissionId) return;
    
    setDeletingId(deleteSubmissionId);
    
    try {
      const submissionRef = doc(db, 'submissions', deleteSubmissionId);
      await deleteDoc(submissionRef);
      
      setSubmissions(submissions.filter(sub => sub.id !== deleteSubmissionId));
      
      setShowDeleteModal(false);
      setDeleteSubmissionId(null);
    } catch (err) {
      console.error("Error deleting submission:", err);
      setError("Failed to delete submission. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };
  
  // Handle view file
  const handleViewFile = (submission) => {
    if (submission.fileUrl || submission.viewUrl) {
      window.open(submission.fileUrl || submission.viewUrl, '_blank');
    } else if (submission.gofileFileId) {
      window.open(`https://gofile.io/d/${submission.gofileFileId}`, '_blank');
    } else {
      alert('File URL not available');
    }
  };
  
  // Filtered and sorted submissions
  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter(sub => {
        // Filter by search term (name, email, school)
        const searchMatch = searchTerm === '' || 
          sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.songTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.poemTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.speechTopic?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by competition
        const competitionMatch = selectedCompetition === 'all' || sub.competition === selectedCompetition;
        
        // Filter by category
        const categoryMatch = selectedCategory === 'all' || sub.category === selectedCategory;
        
        // Filter by school
        const schoolMatch = selectedSchool === 'all' || sub.school === selectedSchool;
        
        // Filter by status
        const statusMatch = selectedStatus === 'all' || sub.status === selectedStatus;
        
        return searchMatch && competitionMatch && categoryMatch && schoolMatch && statusMatch;
      })
      .sort((a, b) => {
        // Sort by selected field
        if (sortBy === 'name') {
          return sortDirection === 'asc' 
            ? (a.name || '').localeCompare(b.name || '') 
            : (b.name || '').localeCompare(a.name || '');
        }
        
        if (sortBy === 'email') {
          return sortDirection === 'asc' 
            ? (a.email || '').localeCompare(b.email || '') 
            : (b.email || '').localeCompare(a.email || '');
        }
        
        if (sortBy === 'competition') {
          return sortDirection === 'asc' 
            ? (a.competition || '').localeCompare(b.competition || '') 
            : (b.competition || '').localeCompare(a.competition || '');
        }
        
        if (sortBy === 'school') {
          return sortDirection === 'asc' 
            ? (a.school || '').localeCompare(b.school || '') 
            : (b.school || '').localeCompare(a.school || '');
        }
        
        // Default: sort by submission date
        return sortDirection === 'asc' 
          ? a.submittedAt - b.submittedAt 
          : b.submittedAt - a.submittedAt;
      });
  }, [submissions, searchTerm, selectedCompetition, selectedCategory, selectedSchool, selectedStatus, sortBy, sortDirection]);
  
  // Get unique values for dropdowns
  const competitions = useMemo(() => {
    const uniqueCompetitions = new Set();
    submissions.forEach(sub => {
      if (sub.competition) uniqueCompetitions.add(sub.competition);
    });
    return Array.from(uniqueCompetitions);
  }, [submissions]);
  
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    submissions.forEach(sub => {
      if (sub.category) uniqueCategories.add(sub.category);
    });
    return Array.from(uniqueCategories);
  }, [submissions]);
  
  const schools = useMemo(() => {
    const uniqueSchools = new Set();
    submissions.forEach(sub => {
      if (sub.school) uniqueSchools.add(sub.school);
    });
    return Array.from(uniqueSchools);
  }, [submissions]);
  
  const statuses = useMemo(() => {
    const uniqueStatuses = new Set();
    submissions.forEach(sub => {
      if (sub.status) uniqueStatuses.add(sub.status);
    });
    return Array.from(uniqueStatuses);
  }, [submissions]);
  
  const getCompetitionDisplayName = (competition) => {
    const competitionNames = {
      'art': 'Art Competition',
      'singing': 'Singing Competition',
      'poetry': 'Poetry Recitation',
      'speech': 'Speech Competition',
      'ttc': 'Tongue Twister Challenge'
    };
    return competitionNames[competition] || competition;
  };
  
  const getSubmissionTitle = (submission) => {
    if (submission.title) return submission.title;
    if (submission.songTitle) return submission.songTitle;
    if (submission.poemTitle) return submission.poemTitle;
    if (submission.speechTopic) return submission.speechTopic;
    return 'Untitled';
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
      </div>
      
      {/* Glass elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(3)].map((_, i) => {
          const size = Math.random() * 400 + 200;
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          
          return (
            <div 
              key={i}
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
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-gray-700/50 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="mr-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500">Submissions Management</h1>
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
        <div className="backdrop-blur-lg bg-black/50 border border-gray-700/50 rounded-xl p-6 shadow-2xl">
          {/* Section header */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 flex items-center text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Submissions Overview
            </h2>
            <p className="text-gray-400 text-sm">Manage all competition submissions for German Day 2025</p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="backdrop-blur-md bg-gray-900/40 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                TOTAL SUBMISSIONS
              </h3>
              <p className="text-3xl font-bold text-gray-200">{submissions.length}</p>
            </div>
            
            <div className="backdrop-blur-md bg-gray-900/40 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                COMPETITIONS
              </h3>
              <p className="text-3xl font-bold text-gray-200">{competitions.length}</p>
            </div>
            
            <div className="backdrop-blur-md bg-gray-900/40 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                SCHOOLS
              </h3>
              <p className="text-3xl font-bold text-gray-200">{schools.length}</p>
            </div>
            
            <div className="backdrop-blur-md bg-gray-900/40 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                FILTERED RESULTS
              </h3>
              <p className="text-3xl font-bold text-gray-200">{filteredSubmissions.length}</p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2">
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
                  placeholder="Search by name, email, title..."
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
                    value: comp,
                    label: getCompetitionDisplayName(comp)
                  }))
                ]}
                placeholder="Select competition"
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
                placeholder="Select category"
              />
            </div>
            
            {/* School Filter */}
            <div>
              <CustomDropdown
                label="School"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                options={[
                  { value: 'all', label: 'All Schools' },
                  ...schools.map(school => ({
                    value: school,
                    label: school
                  }))
                ]}
                placeholder="Select school"
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
                      { value: 'submittedAt', label: 'Date' },
                      { value: 'name', label: 'Name' },
                      { value: 'email', label: 'Email' },
                      { value: 'competition', label: 'Competition' },
                      { value: 'school', label: 'School' }
                    ]}
                    className="rounded-r-none"
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
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/40 border border-red-700/60 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {/* Submissions Table */}
          <div className="overflow-auto rounded-lg border border-gray-700/50 backdrop-blur-md bg-black/30">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-black/40">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Participant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">School</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Competition</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title/Topic</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">File Info</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30 bg-black/20">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr 
                      key={submission.id}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-200">{submission.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{submission.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {submission.school || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {getCompetitionDisplayName(submission.competition) || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        <div className="font-medium">{getSubmissionTitle(submission)}</div>
                        {submission.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {submission.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.category ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                            {submission.category}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        <div className="text-sm">{submission.fileName || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(submission.fileSize)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewFile(submission)}
                          className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                          disabled={!submission.fileUrl && !submission.viewUrl && !submission.gofileFileId}
                        >
                          View File
                        </button>
                        <button
                          onClick={() => confirmDelete(submission.id)}
                          disabled={deletingId === submission.id}
                          className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === submission.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredSubmissions.length} of {submissions.length} submissions
          </div>
        </div>
      </main>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full backdrop-blur-lg bg-black/60 border border-gray-700/50 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600/50 hover:bg-gray-500/60 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingId}
                className="flex-1 px-4 py-2 bg-red-600/50 hover:bg-red-500/60 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSubmissions;
