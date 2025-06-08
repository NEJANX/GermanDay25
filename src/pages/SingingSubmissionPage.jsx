import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc } from '@firebase/firestore';
import SubmissionDropdown from '../components/SubmissionDropdown.jsx';
import Alert from '../components/Alert.js';
import gofileService from '../services/gofileService.js';

// Debounce utility function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function SingingSubmissionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    category: '',
    songTitle: '',
    description: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isRoyalCollegeBlocked, setIsRoyalCollegeBlocked] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize Alert instance
  const alert = new Alert();

  // Debounce the school and category values for validation
  const debouncedSchool = useDebounce(formData.school, 300);
  const debouncedCategory = useDebounce(formData.category, 300);

  // Initialize component
  useEffect(() => {
    // No initialization needed for GoFile service
  }, []);

  // Handle Royal College validation with debounced values
  useEffect(() => {
    const isRoyal = debouncedSchool.toLowerCase().includes('royal');
    const shouldBlock = isRoyal && debouncedCategory === 'Inter School';
    setIsRoyalCollegeBlocked(shouldBlock);
  }, [debouncedSchool, debouncedCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Just update the form data immediately for responsive UI
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Custom validation for video files
      const maxSize = 100 * 1024 * 1024; // 100MB for video files
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv'];
      
      if (file.size > maxSize) {
        alert.error('File size must be less than 100MB');
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert.error('Please upload a valid video file (MP4, AVI, MOV, WMV, MKV)');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const uploadToGoFile = async (file) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await gofileService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      return result;
    } catch (error) {
      console.error('Upload to GoFile failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      alert.error('Please select a video file to upload.');
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
      // Upload file to GoFile with progress tracking
      console.log('Starting GoFile upload for:', formData.file.name);
      const uploadResult = await uploadToGoFile(formData.file);
      console.log('GoFile upload successful:', uploadResult);
      
      // Check if upload result has required fields
      if (!uploadResult || !uploadResult.fileId) {
        throw new Error('Upload result is missing file ID');
      }
      
      // Save submission data to Firestore
      const submissionData = {
        name: formData.name,
        email: formData.email,
        school: formData.school,
        category: formData.category,
        songTitle: formData.songTitle,
        description: formData.description,
        fileName: formData.file.name,
        fileSize: formData.file.size,
        gofileFileId: uploadResult.fileId,
        fileUrl: uploadResult.directUrl,
        viewUrl: uploadResult.viewUrl,
        submittedAt: new Date(),
        competition: 'singing',
        uploadStatus: 'completed',
        uploadedAt: uploadResult.uploadedAt
      };
      
      await addDoc(collection(db, 'submissions'), submissionData);
      
      setSubmitStatus('success');
      alert.success('Singing performance submitted successfully! Your video has been uploaded to the server and is now accessible by the judging panel.');
      
      // Keep all form data intact for user reference
      // Only reset the progress
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Error submitting:', error);
      console.error('Error details:', error.message);
      setSubmitStatus('error');
      
      // Provide more specific error messages
      let errorMessage = 'There was an error uploading your video. Please try again.';
      if (error.message.includes('Network error')) {
        errorMessage = 'Network error during upload. Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Upload timeout. Please try uploading a smaller file or check your internet connection.';
      } else if (error.message.includes('file ID')) {
        errorMessage = 'Upload completed but file information is missing. Please try again.';
      }
      
      alert.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 opacity-5" style={{background: "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80') center/cover no-repeat fixed"}}></div>
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Singing Competition Submission
          </h1>
          <p className="text-xl text-slate-300">
            Submit your German song performance video
          </p>
        </div>

        {/* Submission Form */}
        <div className="backdrop-blur-md bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
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
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
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

            {/* Song Information */}
            <div>
              <label className="block text-sm font-medium mb-2">Song Title (in German) *</label>
              <input
                type="text"
                name="songTitle"
                value={formData.songTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="Enter the German song title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Performance Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="Describe your performance, song choice, or any special notes (optional)..."
              />
            </div>

            {/* File Upload - Hide during upload and success */}
            {!isUploading && !isSubmitting && submitStatus !== 'success' && (
              <div>
                <label className="block text-sm font-medium mb-2">Upload Performance Video *</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    accept="video/mp4,video/avi,video/mov,video/wmv,video/mkv"
                    className="hidden"
                  />
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <span className="material-icons text-4xl text-slate-400">videocam</span>
                    <span className="text-lg">Click to upload your performance video</span>
                    <span className="text-sm text-slate-400">
                      Accepted formats: MP4, AVI, MOV, WMV, MKV (Max 100MB)
                    </span>
                  </label>
                  {formData.file && (
                    <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400">✓ Selected: {formData.file.name}</span>
                        <span className="text-sm text-slate-400">
                          {gofileService.formatFileSize(formData.file.size)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upload Status - Show during upload and success */}
            {(isUploading || submitStatus === 'success') && (
              <div>
                <label className="block text-sm font-medium mb-2">Upload Status</label>
                
                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-300">Uploading to GoFile...</span>
                      <span className="text-sm text-slate-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Please wait while your video is being uploaded. Do not close this page.
                    </p>
                  </div>
                )}

                {/* Success Status */}
                {submitStatus === 'success' && formData.file && (
                  <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-300 font-medium">✓ Video uploaded successfully!</span>
                    </div>
                    <div className="text-sm text-green-200">
                      <div>File: {formData.file.name}</div>
                      <div>Size: {gofileService.formatFileSize(formData.file.size)}</div>
                      <div>Status: Submitted and saved to database</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-green-300">
                <span className="material-icons mr-2">check_circle</span>
                Singing performance submitted successfully! Your video has been uploaded to the server and is now accessible by the judging panel.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-300">
                <span className="material-icons mr-2">error</span>
                There was an error uploading your video. Please try again.
              </div>
            )}

            {/* Submit Button */}
            {submitStatus !== 'success' && (
              <button
                type="submit"
                disabled={isSubmitting || isRoyalCollegeBlocked || isUploading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                  isSubmitting || isRoyalCollegeBlocked || isUploading
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                    Uploading... {uploadProgress}%
                  </span>
                ) : isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                    Saving Submission...
                  </span>
                ) : (
                  'Submit Performance'
                )}
              </button>
            )}

            {/* Submit Another Button */}
            {submitStatus === 'success' && (
              <button
                type="button"
                onClick={() => {
                  setSubmitStatus(null);
                  setFormData(prev => ({
                    ...prev,
                    songTitle: '',
                    description: '',
                    file: null
                  }));
                  setUploadProgress(0);
                  // Reset file input
                  const fileInput = document.getElementById('file-input');
                  if (fileInput) fileInput.value = '';
                }}
                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
              >
                Submit Another Performance
              </button>
            )}
          </form>

          {/* Guidelines Section */}
          <div className="mt-12 pt-8 border-t border-slate-600">
            <h3 className="text-xl font-bold mb-4 text-pink-300">Submission Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-purple-300">Video Requirements:</h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Maximum duration: 4 minutes</li>
                  <li>• Song must be in German language</li>
                  <li>• Clear audio and video quality</li>
                  <li>• File formats: MP4, AVI, MOV, WMV, MKV</li>
                  <li>• Maximum file size: 100MB</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-purple-300">Performance Tips:</h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Focus on clear German pronunciation</li>
                  <li>• Express emotion through voice and gestures</li>
                  <li>• Backing tracks or a cappella allowed</li>
                  <li>• Record in good lighting conditions</li>
                  <li>• Practice vocal quality and delivery</li>
                </ul>
              </div>
            </div>
          </div>
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
