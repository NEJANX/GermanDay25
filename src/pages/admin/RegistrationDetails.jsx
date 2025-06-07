import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { useAuth } from '../../components/admin/AuthContext.jsx';
import CustomDropdown from '../../components/admin/ui/CustomDropdown.jsx';

export default function RegistrationDetails() {
  const { competitionId, registrationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [registration, setRegistration] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Fetch registration data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get competition data
        const competitionRef = doc(db, 'competitions', competitionId);
        const competitionSnap = await getDoc(competitionRef);
        
        if (competitionSnap.exists()) {
          setCompetition({ id: competitionSnap.id, ...competitionSnap.data() });
        }
        
        // Get registration data
        const registrationRef = doc(db, 'competitions', competitionId, 'registrations', registrationId);
        const registrationSnap = await getDoc(registrationRef);
        
        if (registrationSnap.exists()) {
          const data = registrationSnap.data();
          setRegistration({
            id: registrationSnap.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          });
          
          // Initialize form data
          setFormData({
            fullName: data.fullName || '',
            schoolName: data.schoolName || '',
            email: data.email || '',
            phone: data.phone || '',
            category: data.category || '',
            experience: data.experience || '',
            // Add any other fields that might be in the registration
          });
        } else {
          setError('Registration not found');
        }
      } catch (err) {
        console.error("Error fetching registration:", err);
        setError('Failed to load registration data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [competitionId, registrationId]);
  
  // Fetch all categories for dropdown
  const [availableCategories, setAvailableCategories] = useState([]);
  
  useEffect(() => {
    // Get unique categories from the competition if available
    if (competition && competition.categories) {
      setAvailableCategories(competition.categories);
    } else {
      // Default categories if not specified in the competition
      setAvailableCategories(['Beginner', 'Intermediate', 'Advanced']);
    }
  }, [competition]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Update registration in Firestore
      const registrationRef = doc(db, 'competitions', competitionId, 'registrations', registrationId);
      await updateDoc(registrationRef, formData);
      
      // Update local state
      setRegistration(prev => ({
        ...prev,
        ...formData
      }));
      
      // Show success message
      setSuccess('Registration updated successfully');
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating registration:", err);
      setError('Failed to update registration');
    } finally {
      setSaving(false);
    }
  };
  
  // Go back to dashboard
  const handleBack = () => {
    navigate('/admin/dashboard');
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset form data to current registration data
    if (registration) {
      setFormData({
        fullName: registration.fullName || '',
        email: registration.email || '',
        phone: registration.phone || '',
        category: registration.category || '',
        experience: registration.experience || '',
        // Add any other fields
      });
    }
    
    setIsEditing(false);
  };
  
  if (loading) {
    return (
      // Updated loading state background and spinner
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );
  }
  
  if (!registration) {
    return (
      // Updated not found state background and button
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-200">Registration Not Found</h2>
        <p className="mb-6 text-gray-400">The registration you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={handleBack}
          className="admin-btn admin-btn-primary" // Use admin button style
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    // Updated main page container background
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Header - Updated styles */}
      <header className="bg-black/70 backdrop-blur-md border-b border-gray-700/50 py-4 px-6 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-200">Registration Details</h1>
          
          <div>
            <button
              onClick={handleBack}
              className="admin-btn admin-btn-secondary" // Already using admin style, should be fine
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div className="admin-card"> {/* This class should provide the black glass effect from admin-style.css */}
          {/* Competition Info - Updated text colors */}
          {competition && (
            <div className="mb-6 pb-6 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-3xl">{competition.icon || '🏆'}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">{competition.title || 'Unknown Competition'}</h3>
                  <p className="text-gray-400 text-sm">{competition.description || ''}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message - Updated styles */}
          {error && (
            <div className="bg-red-900/40 border border-red-700/60 rounded-lg p-4 mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {/* Success Message - Updated styles */}
          {success && (
            <div className="bg-green-900/40 border border-green-700/60 rounded-lg p-4 mb-4 animate-pulse">
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}
          
          {/* Registration Details - Updated container and header styles */}
          <div className="bg-black/30 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
            <div className="p-4 bg-black/40 border-b border-gray-700/50 flex justify-between items-center">
              <h3 className="font-medium text-gray-200">Registration Information</h3>
              
              <div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="admin-btn admin-btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      form="registration-form"
                      type="submit"
                      disabled={saving}
                      className="admin-btn admin-btn-primary text-sm flex items-center" // Ensure spinner inside matches dark theme
                    >
                      {saving ? (
                        <>
                          {/* Spinner color updated */}
                          <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                          Saving
                        </>
                      ) : 'Save'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="admin-btn admin-btn-secondary text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <form id="registration-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="admin-input"
                      required
                    />
                  </div>

                  {/* School Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      School Name
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  {/* Category - replaced with custom dropdown */}
                  <div>
                    <CustomDropdown
                      label="Category"
                      value={formData.category}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          category: e.target.value
                        }));
                      }}
                      options={[
                        ...availableCategories.map(cat => ({
                          value: cat,
                          label: cat
                        })),
                        // Add "Custom" option if current category is not in available categories
                        ...(formData.category && !availableCategories.includes(formData.category) 
                          ? [{ value: formData.category, label: `${formData.category} (Custom)` }] 
                          : [])
                      ]}
                      placeholder="Select a category"
                    />
                  </div>
                </div>
                
                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows="4"
                    className="admin-input"
                  ></textarea>
                </div>
                
                {/* Add additional fields as needed */}
              </form>
            ) : (
              <div className="divide-y divide-gray-700/50"> {/* Updated divider color */}
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 p-4">
                  <div className="text-gray-400 mb-2 md:mb-0">Full Name</div>
                  <div className="md:col-span-2 font-medium text-gray-200">{registration.fullName || 'N/A'}</div>
                </div>

                {/* School Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 p-4">
                  <div className="text-gray-400 mb-2 md:mb-0">School Name</div>
                  <div className="md:col-span-2 font-medium text-gray-200">{registration.schoolName || 'N/A'}</div>
                </div>
                
                {/* Email */}
                <div className="grid grid-cols-1 md:grid-cols-3 p-4">
                  <div className="text-gray-400 mb-2 md:mb-0">Email</div>
                  <div className="md:col-span-2 font-medium text-gray-200">{registration.email || 'N/A'}</div>
                </div>
                
                {/* Phone */}
                <div className="grid grid-cols-1 md:grid-cols-3 p-4">
                  <div className="text-gray-400 mb-2 md:mb-0">Phone</div>
                  <div className="md:col-span-2 font-medium text-gray-200">{registration.phone || 'N/A'}</div>
                </div>
                
                {/* Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 p-4">
                  <div className="text-gray-400 mb-2 md:mb-0">Category</div>
                  <div className="md:col-span-2">
                    {registration.category ? (
                      <span className="category-pill"> {/* category-pill style from admin-style.css should be dark */}
                        {registration.category}
                      </span>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
                
                {/* Registration Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 p-4">
                  <div className="text-gray-400 mb-2 md:mb-0">Registration Date</div>
                  <div className="md:col-span-2 font-medium text-gray-200">
                    {registration.timestamp ? registration.timestamp.toLocaleString() : <span className="text-gray-500">N/A</span>}
                  </div>
                </div>
                
                {/* Experience */}
                {registration.experience && (
                  <div className="p-4">
                    <div className="text-gray-400 mb-2">Experience</div>
                    {/* Updated background and border for experience display */}
                    <div className="bg-black/20 p-4 rounded-lg whitespace-pre-wrap border border-gray-700/50 text-gray-300">
                      {registration.experience}
                    </div>
                  </div>
                )}
                
                {/* Add additional fields as needed */}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}