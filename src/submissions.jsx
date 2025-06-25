import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.css';
import SubmissionsPage from'./pages/SubmissionsPage.jsx';
import ArtSubmissionPage from './pages/ArtSubmissionPage.jsx';
import SingingSubmissionPage from './pages/SingingSubmissionPage.jsx';
import PoetrySubmissionPage from './pages/PoetrySubmissionPage.jsx';
import SpeechSubmissionPage from './pages/SpeechSubmissionPage.jsx';
import TongueTwisterSubmissionPage from './pages/TongueTwisterSubmissionPage.jsx';

const SubmissionsApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/submissions" element={<SubmissionsPage />} />
        <Route path="/submissions/art" element={<SubmissionsPage />} />
        <Route path="/submissions/singing" element={<SubmissionsPage />} />
        <Route path="/submissions/poetry" element={<SubmissionsPage />} />
        <Route path="/submissions/speech" element={<SubmissionsPage />} />
        <Route path="/submissions/ttc" element={<SubmissionsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('submissions-root')).render(
  <React.StrictMode>
    <SubmissionsApp />
  </React.StrictMode>
);
