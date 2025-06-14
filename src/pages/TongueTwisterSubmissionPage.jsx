import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc } from '@firebase/firestore';
import SubmissionDropdown from '../components/SubmissionDropdown.jsx';
import Alert from '../components/Alert.js';
import gofileService from '../services/gofileService.js';
import { SchoolService } from '../services/schoolService.js';

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

export default function TongueTwisterSubmissionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    title: '',
    description: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState('');

  // Initialize Alert instance
  const alert = new Alert();

  // Debounce the school value for validation
  const debouncedSchool = useDebounce(formData.school, 300);

  // Initialize component
  useEffect(() => {
    // No initialization needed for GoFile service
  }, []);

  // Auto-detect category based on school selection
  useEffect(() => {
    if (debouncedSchool) {
      const category = SchoolService.getCategoryForSchool(debouncedSchool);
      setDetectedCategory(category);
    } else {
      setDetectedCategory('');
    }
  }, [debouncedSchool]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
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

    if (!formData.school) {
      alert.error('Please select your school.');
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
        category: detectedCategory,
        title: formData.title,
        description: formData.description,
        fileName: formData.file.name,
        fileSize: formData.file.size,
        gofileFileId: uploadResult.fileId,
        fileUrl: uploadResult.directUrl,
        viewUrl: uploadResult.viewUrl,
        submittedAt: new Date(),
        competition: 'tongue-twister',
        uploadStatus: 'completed',
        uploadedAt: uploadResult.uploadedAt
      };
      
      await addDoc(collection(db, 'submissions'), submissionData);
      
      setSubmitStatus('success');
      alert.success('Tongue twister performance submitted successfully! Your video has been uploaded to the server and is now accessible by the judging panel.');
      
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

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="/" className="text-xl font-bold flex items-center">
            <span className="mr-2 flex">
              <span className="h-5 w-2 bg-black rounded-l"></span>
              <span className="h-5 w-2 bg-red-700"></span>
              <span className="h-5 w-2 bg-yellow-400 rounded-r"></span>
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200">Zeit für Deutsch '25</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Tongue Twister Challenge Submission
          </h1>
          <p className="text-xl text-slate-300">Submit your tongue twister performance for German Day 2025</p>
        </div>

        <div className="backdrop-blur-md bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {/* School Dropdown */}
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-slate-300 mb-2">
                School/Institution *
              </label>
              <SubmissionDropdown
                options={SchoolService.getSchoolOptions().filter(school => 
                  !school.label.toLowerCase().includes('royal college')
                )}
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                placeholder="Select your school"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              {detectedCategory && (
                <div className="mt-2 text-sm text-slate-400">
                  Category: <span className="text-blue-400 font-medium">{detectedCategory}</span>
                </div>
              )}
            </div>

            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
                Tongue Twister Title/Topic *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., German Pronunciation Challenge, Fischers Fritz fischt..."
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Performance Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your tongue twister performance, any special techniques used, or the German phrases you'll be demonstrating..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-slate-300 mb-2">
                Video Upload *
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="video/*"
                  required
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                    <span className="material-icons text-6xl text-slate-400 mb-4">videocam</span>
                  {/* <div className="text-4xl mb-4"></div> */}
                  <div className="text-lg font-medium mb-2">Click to upload your tongue twister video</div>
                  <div className="text-slate-400 text-sm">MP4, AVI, MOV, WMV, MKV • Max 100MB</div>
                </label>
                
                {formData.file && (
                  <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                    <div className="font-medium">{formData.file.name}</div>
                    <div className="text-sm text-slate-400">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-sm text-slate-300 mb-2">
                    Upload Progress: {uploadProgress}%
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                <div className="flex items-center">
                  <div className="text-green-400 text-xl mr-3">✅</div>
                  <div>
                    <div className="font-medium text-green-300">Submission Successful!</div>
                    <div className="text-sm text-green-400 mt-1">
                      Your tongue twister performance has been uploaded and submitted successfully.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-300">
                <div className="flex items-center">
                  <div className="text-red-400 text-xl mr-3">❌</div>
                  <div>There was an error submitting your entry. Please try again.</div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isSubmitting || isUploading
                  ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
              }`}
            >
              {isSubmitting || isUploading ? 'Processing...' : 'Submit Tongue Twister Performance'}
            </button>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-12 backdrop-blur-md bg-slate-800/30 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-blue-400">Submission Guidelines</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>Video should clearly demonstrate German tongue twister pronunciation</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>Performance should be between 30 seconds and 1 minute long</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>Ensure good audio quality so pronunciation can be clearly heard</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>Include both speed and accuracy in your demonstration</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>File size should not exceed 100MB</span>
            </div>
          </div>
        </div>
      </main>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
      `}</style>
    </div>
  );
}
