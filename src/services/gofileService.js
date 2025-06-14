// GoFile.io file upload service
class GoFileService {
  constructor() {
    this.API_BASE_URL = 'https://store1.gofile.io';
    // No API key needed for uploads, but we'll get a server dynamically
    this.uploadServer = null;
  }

  /**
   * Get the best upload server from GoFile
   * @returns {Promise<string>} Upload server URL
   */
  async getUploadServer() {
    if (this.uploadServer) {
      return this.uploadServer;
    }

    try {
      const response = await fetch('https://api.gofile.io/servers');
      if (!response.ok) {
        throw new Error('Failed to get upload server');
      }
      
      const data = await response.json();
      if (data.status === 'ok' && data.data && data.data.servers && data.data.servers.length > 0) {
        const server = data.data.servers[0].name;
        this.uploadServer = `https://${server}.gofile.io`;
        return this.uploadServer;
      } else {
        // Fallback to default server
        this.uploadServer = 'https://store1.gofile.io';
        return this.uploadServer;
      }
    } catch (error) {
      console.warn('Failed to get optimal server, using default:', error);
      this.uploadServer = 'https://store1.gofile.io';
      return this.uploadServer;
    }
  }

  /**
   * Upload file to GoFile with progress tracking
   * @param {File} file - The file to upload
   * @param {Function} onProgress - Progress callback function (receives percentage)
   * @returns {Promise<Object>} Upload result with file ID and direct URL
   */
  async uploadFile(file, onProgress = null) {
    return new Promise((resolve, reject) => {
      try {
        // Use default server directly to avoid server selection issues
        const serverUrl = 'https://store1.gofile.io';
        
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });

        // Handle successful upload
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log('GoFile response:', response); // Debug log
              
              if (response.status === 'ok' && response.data) {
                const fileData = response.data;
                // GoFile returns the file ID in the 'id' field, not 'code'
                const fileId = fileData.id;
                const downloadPage = fileData.downloadPage;
                
                resolve({
                  fileId: fileId,
                  directUrl: downloadPage,
                  viewUrl: downloadPage,
                  fileName: file.name,
                  fileSize: file.size,
                  uploadedAt: new Date().toISOString(),
                  gofileData: fileData
                });
              } else {
                console.error('GoFile API error:', response);
                reject(new Error(response.message || 'Upload failed - invalid response'));
              }
            } catch (error) {
              console.error('Failed to parse GoFile response:', xhr.responseText);
              reject(new Error('Failed to parse upload response: ' + xhr.responseText));
            }
          } else {
            console.error('GoFile HTTP error:', xhr.status, xhr.responseText);
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.message || `Upload failed with status ${xhr.status}`));
            } catch (error) {
              reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
            }
          }
        });

        // Handle upload errors
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        // Handle upload timeout
        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timeout'));
        });

        // Configure and send request
        xhr.open('POST', `${serverUrl}/uploadFile`, true);
        xhr.timeout = 120000; // 2 minutes timeout for larger files
        xhr.send(formData);
        
      } catch (error) {
        reject(new Error('Failed to initialize upload: ' + error.message));
      }
    });
  }

  /**
   * Get file information from GoFile (requires API token for private files)
   * @param {string} fileId - The GoFile file ID
   * @param {string} token - Optional API token for private files
   * @returns {Promise<Object>} File information
   */
  async getFileInfo(fileId, token = null) {
    try {
      const url = new URL('https://api.gofile.io/getContent');
      url.searchParams.append('contentId', fileId);
      
      if (token) {
        url.searchParams.append('token', token);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'ok') {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get file info');
      }
    } catch (error) {
      console.error('Failed to get file info:', error);
      throw error;
    }
  }

  /**
   * Check if file exists and is accessible
   * @param {string} fileId - The GoFile file ID
   * @param {string} token - Optional API token for private files
   * @returns {Promise<boolean>} Whether file exists
   */
  async checkFileExists(fileId, token = null) {
    try {
      await this.getFileInfo(fileId, token);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate file before upload
   * @param {File} file - The file to validate
   * @returns {Object} Validation result
   */
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB (GoFile free tier supports up to 10MB)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload only JPG, PNG, or PDF files' };
    }

    return { valid: true };
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Delete a file from GoFile (requires API token)
   * @param {string} fileId - The GoFile file ID
   * @param {string} token - API token for file management
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(fileId, token) {
    if (!token) {
      throw new Error('API token required for file deletion');
    }

    try {
      const formData = new FormData();
      formData.append('contentId', fileId);
      formData.append('token', token);

      const response = await fetch('https://api.gofile.io/deleteContent', {
        method: 'DELETE',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'ok') {
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  /**
   * Get detailed error message from GoFile response
   * @param {Response} response - Fetch response object
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage(response) {
    try {
      const errorData = await response.json();
      if (errorData.status === 'error') {
        return errorData.message || `HTTP ${response.status}`;
      }
      return errorData.message || errorData.error || `HTTP ${response.status}`;
    } catch (e) {
      return `HTTP ${response.status}`;
    }
  }
}

export default new GoFileService();
