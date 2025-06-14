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

export default function ArtSubmissionPage() {
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
      // Validate file using GoFile service
      const validation = gofileService.validateFile(file);
      
      if (!validation.valid) {
        alert.error(validation.error);
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
      alert.error('Please select a file to upload.');
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
        competition: 'art',
        uploadStatus: 'completed',
        uploadedAt: uploadResult.uploadedAt
      };
      
      await addDoc(collection(db, 'submissions'), submissionData);
      
      setSubmitStatus('success');
      alert.success('Artwork submitted successfully! Your file has been uploaded to the server and is now accessible by the judging panel.');
      
      // Keep all form data intact for user reference
      // Only reset the progress
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Error submitting:', error);
      console.error('Error details:', error.message);
      setSubmitStatus('error');
      
      // Provide more specific error messages
      let errorMessage = 'There was an error uploading your artwork. Please try again.';
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
            Zeit für Deutsch '25
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
                <SubmissionDropdown
                  options={SchoolService.getSchoolOptions()}
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="Select your school"
                  required
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
            </div>            {/* File Upload - Hide during upload and success */}
            {!isUploading && !isSubmitting && submitStatus !== 'success' && (
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
                      Please wait while your file is being uploaded. Do not close this page.
                    </p>
                  </div>
                )}

                {/* Success Status */}
                {submitStatus === 'success' && formData.file && (
                  <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-300 font-medium">✓ File uploaded successfully!</span>
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
                Artwork submitted successfully! Your file has been uploaded to the server and is now accessible by the judging panel.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-300">
                <span className="material-icons mr-2">error</span>
                There was an error uploading your artwork. Please try again.
              </div>
            )}

            {/* Submit Button */}
            {submitStatus !== 'success' && (
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                  isSubmitting || isUploading
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900'
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
                  'Submit Artwork'
                )}
              </button>
            )}

            {/* Submit Another Button */}
            {submitStatus === 'success' && (
              <button
                type="button"
                onClick={() => {
                  setSubmitStatus(null);
                  setFormData({
                    name: '',
                    email: '',
                    school: '',
                    title: '',
                    description: '',
                    file: null
                  });
                  setDetectedCategory('');
                  setUploadProgress(0);
                  // Reset file input
                  const fileInput = document.getElementById('file-input');
                  if (fileInput) {
                    fileInput.value = '';
                  }
                }}
                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-slate-900"
              >
                Submit Another Artwork
              </button>
            )}
          </form>

          {/* Guidelines Section */}
          <div className="mt-12 pt-8 border-t border-slate-600">
            <h3 className="text-xl font-bold mb-4 text-yellow-300">Submission Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-orange-300">Artwork Requirements:</h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Art must be original and created by you</li>
                  <li>• Include a German title and description</li>
                  <li>• Accepted formats: JPG, PNG, PDF</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Recommended: A4 or A3 size works</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-300">Submission Tips:</h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Scan or photograph artwork clearly</li>
                  <li>• Ensure good lighting and focus</li>
                  <li>• Use German themes or cultural elements</li>
                  <li>• Write titles and descriptions in German</li>
                  <li>• Show creativity and personal expression</li>
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
