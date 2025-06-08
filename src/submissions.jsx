import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.css';
import ArtSubmissionPage from './pages/ArtSubmissionPage.jsx';
import SingingSubmissionPage from './pages/SingingSubmissionPage.jsx';
import PoetrySubmissionPage from './pages/PoetrySubmissionPage.jsx';
import SpeechSubmissionPage from './pages/SpeechSubmissionPage.jsx';

const SubmissionsApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/submissions/art" element={<ArtSubmissionPage />} />
        <Route path="/submissions/singing" element={<SingingSubmissionPage />} />
        <Route path="/submissions/poetry" element={<PoetrySubmissionPage />} />
        <Route path="/submissions/speech" element={<SpeechSubmissionPage />} />
        <Route path="*" element={<Navigate to="/submissions/art" replace />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('submissions-root')).render(
  <React.StrictMode>
    <SubmissionsApp />
  </React.StrictMode>
);
