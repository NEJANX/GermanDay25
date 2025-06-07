import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import multer from 'multer';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Google Drive API setup
// You'll need to create a service account and download the JSON key file
// Place it in your project root as 'google-service-account.json'
const KEYFILEPATH = './google-service-account.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

// Upload endpoint
app.post('/api/upload-to-drive', async (req, res) => {
  try {
    const { fileName, fileData, mimeType, folderId } = req.body;
    
    if (!fileName || !fileData || !mimeType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(fileData, 'base64');
    
    // Create a readable stream from buffer
    const { Readable } = await import('stream');
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    // Upload file to Google Drive
    const fileMetadata = {
      name: fileName,
      parents: [folderId], // Your Google Drive folder ID
    };

    const media = {
      mimeType: mimeType,
      body: bufferStream,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    // Make the file accessible (optional - for public viewing)
    await drive.permissions.create({
      fileId: response.data.id,
      resource: {
        role: 'reader',
        type: 'anyone',
      },
    });

    res.json({ 
      fileId: response.data.id,
      message: 'File uploaded successfully to Google Drive'
    });
    
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    res.status(500).json({ error: 'Failed to upload file to Google Drive' });
  }
});

app.listen(port, () => {
  console.log(`Google Drive upload server running on port ${port}`);
});
