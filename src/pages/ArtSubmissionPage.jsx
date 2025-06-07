import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc } from '@firebase/firestore';
import SubmissionDropdown from '../components/SubmissionDropdown.jsx';
import Alert from '../components/Alert.js';
import googleDriveService from '../services/googleDriveService.js';

export default function ArtSubmissionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    category: '',
    title: '',
    description: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isRoyalCollegeBlocked, setIsRoyalCollegeBlocked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Initialize Alert instance
  const alert = new Alert();

  // Initialize Google Drive service on component mount
  useEffect(() => {
    const initializeGoogleDrive = async () => {
      try {
        await googleDriveService.initialize();
        setIsAuthenticated(googleDriveService.isAuthenticated());
        if (googleDriveService.isAuthenticated()) {
          const user = await googleDriveService.getUserInfo();
          setUserInfo(user);
        }
      } catch (error) {
        console.error('Failed to initialize Google Drive:', error);
        setAuthError('Failed to initialize Google Drive API');
      }
    };
    
    initializeGoogleDrive();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check for Royal College validation
    if (name === 'school') {
      const isRoyal = value.toLowerCase().includes('royal');
      setIsRoyalCollegeBlocked(isRoyal && formData.category === 'Inter School');
      
      if (isRoyal && formData.category === 'Inter School') {
        // alert.warning('Students from Royal College cannot participate in the Inter School category. Please select Intra School category.', 8000);
      }
    }
    
    if (name === 'category') {
      const isRoyal = formData.school.toLowerCase().includes('royal');
      setIsRoyalCollegeBlocked(isRoyal && value === 'Inter School');
      
      if (isRoyal && value === 'Inter School') {
        // alert.warning('Students from Royal College cannot participate in the Inter School category. Please select Intra School category.', 8000);
        return; // Don't update the category if it's blocked
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only JPG, PNG, or PDF files.');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const [showUploadInstructions, setShowUploadInstructions] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await googleDriveService.authenticate();
      setIsAuthenticated(true);
      const user = await googleDriveService.getUserInfo();
      setUserInfo(user);
      alert.success('Successfully signed in to Google Drive!');
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthError('Failed to sign in to Google Drive');
      alert.error('Failed to sign in to Google Drive. Please try again.');
    }
  };

  const handleGoogleSignOut = () => {
    googleDriveService.signOut();
    setIsAuthenticated(false);
    setUserInfo(null);
    alert.info('Signed out of Google Drive');
  };

  const uploadToGoogleDrive = async (file, fileName) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Not authenticated with Google Drive');
      }

      const result = await googleDriveService.uploadFile(file, fileName, {
        description: `Art submission for Zeit für Deutschland '25 - ${formData.title}`
      });

      return result;
    } catch (error) {
      console.error('Upload to Google Drive failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      alert.error('Please select a file to upload.');
      return;
    }

    if (!isAuthenticated) {
      alert.warning('Please sign in to Google Drive first to upload your artwork.');
      return;
    }

    // Check for Royal College + Inter School combination
    const isRoyal = formData.school.toLowerCase().includes('royal');
    if (isRoyal && formData.category === 'Inter School') {
      alert.warning('Students from Royal College cannot participate in the Inter School category. Please change to Intra School category.', 8000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Generate unique file name
      const timestamp = Date.now();
      const fileName = `ArtSubmission_${formData.name}_${timestamp}_${formData.file.name}`;
      
      // Upload file to user's Google Drive
      const uploadResult = await uploadToGoogleDrive(formData.file, fileName);
      
      // Save submission data to Firestore
      const submissionData = {
        name: formData.name,
        email: formData.email,
        school: formData.school,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        fileName: fileName,
        driveFileId: uploadResult.fileId,
        driveFileUrl: uploadResult.publicUrl,
        directUrl: uploadResult.directUrl,
        webViewLink: uploadResult.webViewLink,
        submittedAt: new Date(),
        competition: 'art',
        uploadStatus: 'completed',
        uploaderInfo: {
          googleEmail: userInfo?.email,
          googleName: userInfo?.name
        }
      };
      
      await addDoc(collection(db, 'submissions'), submissionData);
      
      setSubmitStatus('success');
      alert.success('Artwork submitted successfully! Your file has been uploaded to your Google Drive and made publicly accessible.');
      
      setFormData({
        name: '',
        email: '',
        school: '',
        category: '',
        title: '',
        description: '',
        file: null
      });
      
      // Reset file input
      document.getElementById('file-input').value = '';
      
    } catch (error) {
      console.error('Error submitting:', error);
      setSubmitStatus('error');
      alert.error('There was an error uploading your artwork. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 opacity-5" style={{background: "url('https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&q=80') center/cover no-repeat fixed"}}></div>
      </div>

      {/* Glass elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full backdrop-blur-md bg-white/[0.02]"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float 30s ease-in-out ${Math.random() * 10}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl font-bold flex items-center">
            <span className="mr-2 flex">
              <span className="h-5 w-2 bg-black rounded-l"></span>
              <span className="h-5 w-2 bg-red-700"></span>
              <span className="h-5 w-2 bg-yellow-400 rounded-r"></span>
            </span>
            Zeit für Deutschland '25
          </div>
          <a href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            <span className='mr-2 material-icons'>arrow_back</span> Back to Home
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Art Competition Submission
          </h1>
          <p className="text-xl text-slate-300">
            Submit your original artwork inspired by German culture
          </p>
        </div>

        {/* Submission Form */}
        <div className="backdrop-blur-md bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          {/* Google Drive Authentication */}
          <div className="mb-8 p-6 bg-slate-700/30 rounded-xl border border-slate-600">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-400">cloud</span>
              Google Drive Integration
            </h3>
            
            {!isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-slate-300">
                  Sign in with your Google account to upload your artwork directly to your Google Drive.
                  Your file will be made publicly accessible for judging.
                </p>
                {authError && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-red-300 text-sm">
                    {authError}
                  </div>
                )}
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="material-icons text-white text-sm">check</span>
                    </div>
                    <div>
                      <p className="text-green-400 font-medium">Signed in as {userInfo?.name}</p>
                      <p className="text-slate-400 text-sm">{userInfo?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleSignOut}
                    className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
                <p className="text-slate-300 text-sm">
                  ✓ Ready to upload! Your artwork will be saved to your Google Drive and made publicly accessible.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">School/Institution *</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Enter your school name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <SubmissionDropdown
                  options={[
                    { value: "", label: "Select a category" },
                    { value: "Inter School", label: "Inter School" },
                    { value: "Intra School", label: "Intra School" }
                  ]}
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Select a category"
                  required
                />
              </div>
            </div>

            {/* Royal College Warning */}
            {isRoyalCollegeBlocked && (
              <div className="bg-orange-900/30 border border-orange-700/50 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="material-icons text-orange-400 mr-2">warning</span>
                  <span className="text-orange-300 font-medium">
                    Students from Royal College cannot participate in the Inter School category. Please select Intra School category.
                  </span>
                </div>
              </div>
            )}

            {/* Artwork Information */}
            <div>
              <label className="block text-sm font-medium mb-2">Artwork Title (in German) *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Enter your artwork title in German"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description/Caption (in German) *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Explain your artwork in German..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload Artwork *</label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  className="hidden"
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <span className="material-icons text-4xl text-slate-400">cloud_upload</span>
                  <span className="text-lg">Click to upload your artwork</span>
                  <span className="text-sm text-slate-400">
                    Accepted formats: JPG, PNG, PDF (Max 10MB)
                  </span>
                </label>
                {formData.file && (
                  <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-green-400">✓ Selected: {formData.file.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-300 mb-2"><span className='mb-1 mr-1 material-icons'>info</span> Guidelines:</h3>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Art must be original and created by you</li>
                <li>• Include a German title and description</li>
                <li>• Accepted formats: A4 or A3 size drawings/paintings</li>
                <li>• Scan or photograph clearly before uploading</li>
              </ul>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-green-300">
                <span className="material-icons mr-2">check_circle</span>
                Artwork submitted successfully! Your file has been uploaded to your Google Drive and is now publicly accessible.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-300">
                <span className="material-icons mr-2">error</span>
                There was an error uploading your artwork. Please try again.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isRoyalCollegeBlocked}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                isSubmitting || isRoyalCollegeBlocked
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                  Processing Submission...
                </span>
              ) : (
                'Submit Artwork'
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
