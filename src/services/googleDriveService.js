// Google Drive API service for uploading files to user's own drive
class GoogleDriveService {
  constructor() {
    this.CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
    this.API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY';
    this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
    
    this.gapi = null;
    this.tokenClient = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google API
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          this.loadGoogleIdentityServices().then(resolve).catch(reject);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        this.loadGoogleIdentityServices().then(resolve).catch(reject);
      }
    });
  }

  async loadGoogleIdentityServices() {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          this.initializeGapi().then(resolve).catch(reject);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        this.initializeGapi().then(resolve).catch(reject);
      }
    });
  }

  async initializeGapi() {
    await new Promise((resolve) => {
      window.gapi.load('client', resolve);
    });

    await window.gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });

    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '', // defined later
    });

    this.isInitialized = true;
  }

  async authenticate() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.tokenClient.callback = async (response) => {
        if (response.error !== undefined) {
          reject(response);
          return;
        }
        resolve(response);
      };

      if (window.gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        this.tokenClient.requestAccessToken({ prompt: '' });
      }
    });
  }

  async uploadFile(file, fileName, metadata = {}) {
    try {
      // First upload the file
      const fileMetadata = {
        name: fileName,
        parents: [], // Upload to root directory
        ...metadata
      };

      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(fileMetadata)], {type: 'application/json'}));
      form.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.gapi.client.getToken().access_token}`,
        },
        body: form
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Upload failed');
      }

      // Make the file publicly accessible
      await this.makeFilePublic(result.id);

      // Get the public URL
      const publicUrl = `https://drive.google.com/file/d/${result.id}/view?usp=sharing`;
      const directUrl = `https://drive.google.com/uc?id=${result.id}`;

      return {
        fileId: result.id,
        fileName: result.name,
        publicUrl: publicUrl,
        directUrl: directUrl,
        webViewLink: result.webViewLink
      };

    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  async makeFilePublic(fileId) {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.gapi.client.getToken().access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to make file public');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to make file public:', error);
      throw error;
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }

  async getUserInfo() {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${window.gapi.client.getToken().access_token}`,
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return window.gapi && window.gapi.client.getToken() !== null;
  }

  signOut() {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
    }
  }
}

export default new GoogleDriveService();
