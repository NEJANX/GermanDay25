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

export default function PoetrySubmissionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    poemTitle: '',
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
      // Check file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv'];
      if (!allowedTypes.includes(file.type)) {
        alert.error('Please select a valid video file (MP4, AVI, MOV, WMV, or MKV).');
        return;
      }
      
      // Check file size (100MB limit)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        alert.error('File size must be less than 100MB. Please compress your video or choose a smaller file.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const uploadToGoFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      
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
    if (formData.school === '') {
      alert.error('Please select your school.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Upload file to GoFile with progress tracking
      const uploadResult = await uploadToGoFile(formData.file);
      
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
        poemTitle: formData.poemTitle,
        description: formData.description,
        fileName: formData.file.name,
        fileSize: formData.file.size,
        gofileFileId: uploadResult.fileId,
        gofileDownloadUrl: uploadResult.directUrl,
        competition: 'poetry', // Set competition type
        submittedAt: new Date(),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, 'submissions'), submissionData);

      setSubmitStatus('success');
      alert.success('Your poem recitation has been submitted successfully!');
      
      // Reset form but keep personal info for convenience
      setFormData(prev => ({
        ...prev,
        poemTitle: '',
        description: '',
        file: null
      }));
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      alert.error(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitStatus(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

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
          {window.innerWidth > 639 &&
          <a href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            <span className='mr-2 material-icons'>arrow_back</span>Back to Home
          </a>
          }
          {window.innerWidth <= 639 && (
            <a
              href="/"
              className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center space-x-1"
            >
              <span className="material-icons">arrow_back</span>
              <span>Back to Home</span>
            </a>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Poetry Recitation Submission
          </h1>
          <p className="text-xl text-slate-300">
            Submit your German poetry recitation video
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
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">School/Institution *</label>
                <SubmissionDropdown
                  name='school'
                  options={SchoolService.getSchoolOptions()}
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="Select your school"
                  required
                />
              </div>
            </div>

            {/* Poem Information */}
            <div>
              <label className="block text-sm font-medium mb-2">Poem Title (in German) *</label>
              <input
                type="text"
                name="poemTitle"
                value={formData.poemTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                placeholder="Enter the German poem title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Performance Notes (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                placeholder="Share any notes about your recitation, poem choice, or interpretation (optional)..."
              />
            </div>

            {/* File Upload - Hide during upload and success */}
            {!isUploading && !isSubmitting && submitStatus !== 'success' && (
              <div>
                <label className="block text-sm font-medium mb-2">Upload Recitation Video *</label>
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
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <span className="material-icons text-6xl text-slate-400 mb-4">description</span>
                    <span className="text-lg font-medium mb-2">
                      {formData.file ? formData.file.name : 'Click to upload your recitation video'}
                    </span>
                    <span className="text-sm text-slate-400">
                      MP4, AVI, MOV, WMV, or MKV files up to 100MB
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {(isUploading || isSubmitting) && (
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <span className="material-icons animate-spin text-emerald-400 mr-2">sync</span>
                    <span className="text-lg font-medium">
                      {isUploading ? 'Uploading video...' : 'Submitting your recitation...'}
                    </span>
                  </div>
                  {isUploading && (
                    <div className="w-full bg-slate-600 rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                  <p className="text-sm text-slate-400">
                    {isUploading 
                      ? `Upload Progress: ${uploadProgress}%` 
                      : 'Processing your submission...'}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-6 text-center">
                <span className="material-icons text-green-400 text-5xl mb-4">check_circle</span>
                <h3 className="text-xl font-bold text-green-300 mb-2">Submission Successful!</h3>
                <p className="text-green-200 mb-4">
                  Your poetry recitation has been uploaded successfully. Thank you for participating in Zeit für Deutsch '25!
                </p>
                <button
                  type="button"
                  onClick={handleSubmitAnother}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Submit Another Recitation
                </button>
              </div>
            )}

            {/* Submit Button */}
            {!isUploading && !isSubmitting && submitStatus !== 'success' && (
              <button
                type="submit"
                disabled={false}
                className="w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                Submit Recitation
              </button>
            )}
          </form>

          {/* Guidelines Section */}
          <div className="mt-12 pt-8 border-t border-slate-600">
            <h3 className="text-xl font-bold mb-4 text-emerald-300">Submission Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-teal-300">Video Requirements:</h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Maximum duration: 3 minutes</li>
                  <li>• Must be recited from memory</li>
                  <li>• Clear audio and video quality</li>
                  <li>• File formats: MP4, AVI, MOV, WMV, MKV</li>
                  <li>• Maximum file size: 100MB</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-teal-300">Performance Tips:</h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Focus on clear pronunciation</li>
                  <li>• Express emotion through voice and gestures</li>
                  <li>• Maintain good posture and eye contact</li>
                  <li>• Select a poem from the provided collection</li>
                  <li>• Practice memorization thoroughly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      {/* <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style> */}
    </div>
  );
}
