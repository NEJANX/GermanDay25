import './style.css';
import { App } from './App.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the main app
  const root = document.getElementById('root');
  if (root) {
    root.appendChild(App());
  }
  
  // Add smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        
        // Update URL without triggering page reload
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
  
  // Add Intersection Observer to animate sections when they come into view
  const sections = document.querySelectorAll('section');
  
  // Create observer for sections
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe each section
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Create observer for fade-in elements
  const fadeElements = document.querySelectorAll('.fade-in-element');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observe each fade-in element
  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });
  
  // Handle mobile menu if it exists
  const mobileMenuBtn = document.querySelector('nav button');
  if (mobileMenuBtn) {
    const mobileNav = document.querySelector('.mobile-nav');
    if (!mobileNav) {
      // Create mobile nav if it doesn't exist
      const navLinks = document.createElement('div');
      navLinks.className = 'mobile-nav hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-xl';
      
      // Copy desktop nav links to mobile
      const desktopLinks = document.querySelectorAll('nav .hidden.md\\:flex a');
      desktopLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.className = "text-white hover:text-yellow-300 transition-all duration-300";
        a.textContent = link.textContent;
        navLinks.appendChild(a);
      });
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'absolute top-6 right-6 text-white';
      closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>`;
      
      navLinks.appendChild(closeBtn);
      document.body.appendChild(navLinks);
      
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.remove('hidden');
      });
      
      closeBtn.addEventListener('click', () => {
        navLinks.classList.add('hidden');
      });
      
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.add('hidden');
        });
      });
    }
  }
});
