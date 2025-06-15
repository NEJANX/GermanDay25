// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { App } from './App.jsx';
// import './style.css';

// document.addEventListener('DOMContentLoaded', () => {
//   const rootElement = document.getElementById('root');
//   if (rootElement) {
//     const root = createRoot(rootElement);
//     root.render(<App />);
//   }

//   // Smooth scroll for anchor links
//   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//       const href = this.getAttribute('href');
//       if (href.length > 1) {
//         e.preventDefault();
//         const targetId = href.substring(1);
//         const targetElement = document.getElementById(targetId);
//         if (targetElement) {
//           targetElement.scrollIntoView({ behavior: 'smooth' });
//           history.pushState(null, null, `#${targetId}`);
//         }
//       }
//     });
//   });

//   // Section observer for entry animation
//   const sectionObserver = new IntersectionObserver(entries => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('in-view');
//       }
//     });
//   }, {
//     threshold: 0.1,
//     rootMargin: '0px 0px -100px 0px'
//   });

//   document.querySelectorAll('section').forEach(section => {
//     sectionObserver.observe(section);
//   });

//   // Fade-in observer
//   const fadeObserver = new IntersectionObserver(entries => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('visible');
//       }
//     });
//   }, {
//     threshold: 0.1
//   });

//   document.querySelectorAll('.fade-in-element').forEach(el => {
//     fadeObserver.observe(el);
//   });
// });
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
