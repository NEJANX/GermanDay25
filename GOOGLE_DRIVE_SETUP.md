# Google Drive Integration Setup Guide

## Overview
This setup allows users to authenticate with their Google account and upload art submissions directly to their own Google Drive, which are then made publicly accessible for judging.

## Google Cloud Console Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

### 2. Enable Google Drive API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" for user type
   - Fill in app name: "Zeit für Deutschland Art Competition"
   - Add your email as a developer contact
   - Add scopes: `../auth/drive.file`
4. Choose "Web application" as application type
5. Add your website URLs to "Authorized JavaScript origins":
   - `http://localhost:5173` (for development)
   - Your production domain (e.g., `https://your-domain.com`)
6. Copy the Client ID

### 4. Update Environment Variables
1. Open the `.env` file in your project root
2. Replace `your_google_client_id_here` with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   ```

## How It Works

1. **User Authentication**: Users sign in with their Google account
2. **File Upload**: Selected artwork files are uploaded directly to the user's Google Drive
3. **Public Access**: Files are automatically made publicly viewable (anyone with the link can view)
4. **Database Storage**: File URLs and metadata are stored in Firebase Firestore
5. **Admin Access**: Admins can access all submitted artworks through the stored public URLs

## Benefits

- ✅ No storage costs for you
- ✅ Users maintain ownership of their files
- ✅ Automatic public sharing for judging
- ✅ No file size limits (within Google Drive limits)
- ✅ Works entirely in the frontend
- ✅ Users can organize their submissions in their own Drive

## Testing

1. Start your development server: `npm run dev`
2. Navigate to the art submission page
3. Try the Google sign-in flow
4. Upload a test file
5. Verify the file appears in the user's Google Drive
6. Check that the file is publicly accessible
7. Verify submission data is saved to Firestore

## Production Deployment

1. Add your production domain to the OAuth 2.0 client authorized origins
2. Update the `.env` file with production values
3. Deploy as usual with Firebase Hosting

## Security Notes

- Files are uploaded to users' personal Google Drive accounts
- Files are made publicly viewable but not editable
- Users can revoke access at any time through their Google account settings
- No sensitive data is stored in your application beyond the public file URLs
