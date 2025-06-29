import './style.css';
import { db } from './firebase-config';
import { collection, addDoc, serverTimestamp } from '@firebase/firestore';
import Alert from './components/Alert';

import competitions from './data/competitions.json';
import schools from './data/schools.json';

// Create a single alert instance for the entire app
const alertManager = new Alert();

document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.getElementById('competition-details');
  detailsContainer.appendChild(CompetitionDetails());
  
  // Add animation for elements
  const fadeElements = document.querySelectorAll('.fade-in-element');
  fadeElements.forEach(element => {
    element.classList.add('visible');
  });
});

function CompetitionDetails() {
  // Get competition ID from URL path
  const path = window.location.pathname;
  const pathParts = path.split('/');
  const competitionId = pathParts[pathParts.length - 1] || 'singing'; // Default to first competition if no ID

  // Container for the entire page
  const container = document.createElement("div");
  container.className = "min-h-screen flex flex-col bg-slate-900 text-white overflow-x-hidden";
  
  // Add professional German-themed background
  const backgroundOverlay = document.createElement("div");
  backgroundOverlay.className = "fixed inset-0 z-0";
  backgroundOverlay.innerHTML = `
    <div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
    <div class="absolute inset-0 opacity-5" style="background: url('https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&q=80') center/cover no-repeat fixed"></div>
  `;
  container.appendChild(backgroundOverlay);
  
  // Create navigation
  const { navbar, mobileMenu } = createNavigation();
  container.appendChild(navbar);
  container.appendChild(mobileMenu);
  
  // Main content
  const content = document.createElement("div");
  content.className = "flex-1 z-10 py-10 px-4 md:px-6";
  
  // Inner container
  const innerContent = document.createElement("div");
  innerContent.className = "max-w-7xl mx-auto";
  
  // Find competition details by ID
  const competition = competitions.competitions.find(c => c.id === competitionId) || competitions.competitions[0];
  
  // Back button
  const backLink = document.createElement("a");
  backLink.href = "/";
  backLink.className = "inline-flex items-center text-slate-300 hover:text-yellow-200 mb-6 transition-colors";
  backLink.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back to Competitions
  `;
  innerContent.appendChild(backLink);
  
  // Competition details section
  const detailsSection = document.createElement("div");
  detailsSection.className = "grid grid-cols-1 lg:grid-cols-3 gap-8";
  
  // Left column - Competition info
  const leftColumn = document.createElement("div");
  leftColumn.className = "lg:col-span-3 fade-in-element";
  
  const card = document.createElement("div");
  card.className = "backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-xl p-8 shadow-2xl";
  
  const header = document.createElement("div");
  header.className = "mb-8";
  
  // Add German flag mini-element
  const flagBar = document.createElement("div");
  flagBar.className = "h-1 w-16 mb-6 flex rounded-full overflow-hidden";
  flagBar.innerHTML = `
    <div class="flex-1 bg-black"></div>
    <div class="flex-1 bg-red-700"></div>
    <div class="flex-1 bg-yellow-500"></div>
  `;
  
  const competitionIcon = document.createElement("div");

  competitionIcon.className = "text-5xl mb-4";
  competitionIcon.innerHTML = competition.icon;
  
  const competitionTitle = document.createElement("h1");
  competitionTitle.className = "text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200";
  competitionTitle.textContent = competition.title;
  
  const categories = document.createElement("div");
  categories.className = "inline-block px-3 py-1 rounded-full bg-slate-700/70 text-yellow-300 text-sm font-medium mb-4";
  categories.textContent = competition.categories;
  
  header.append(flagBar, competitionIcon, competitionTitle, categories);
  
  const descriptionSection = document.createElement("div");
  descriptionSection.className = "mb-8";
  
  const descriptionTitle = document.createElement("h2");
  descriptionTitle.className = "text-xl font-bold mb-3";
  descriptionTitle.textContent = "About This Competition";
  
  const description = document.createElement("div");
  description.className = "text-slate-300 space-y-4";
  description.innerHTML = competition.fullDescription;
  
  descriptionSection.append(descriptionTitle, description);
  
  const detailsGrid = document.createElement("div");
  detailsGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8";
  
  // Details items
  const detailItems = [
    {
      title: "Submission Deadline",
      value: competition.datetime,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`
    },
    {
      title: "Eligibility",
      value: competition.eligibility,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>`
    }
    // ,
    // {
    //   title: "Submission Deadline",
    //   value: competition.deadline,
    //   icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    //   </svg>`
    // }
  ];
  
  detailItems.forEach(item => {
    const detailItem = document.createElement("div");
    detailItem.className = "flex items-start space-x-3";
    
    const iconWrapper = document.createElement("div");
    iconWrapper.className = "bg-slate-700/50 rounded-full p-2 flex-shrink-0";
    iconWrapper.innerHTML = item.icon;
    
    const textWrapper = document.createElement("div");
    
    const itemTitle = document.createElement("div");
    itemTitle.className = "text-slate-400 text-sm";
    itemTitle.textContent = item.title;
    
    const itemValue = document.createElement("div");
    itemValue.className = "text-white font-medium";
    itemValue.textContent = item.value;
    
    textWrapper.append(itemTitle, itemValue);
    detailItem.append(iconWrapper, textWrapper);
    detailsGrid.appendChild(detailItem);
  });
   // Rules section
  const rulesSection = document.createElement("div");
  rulesSection.className = "mb-8";
  
  const rulesTitle = document.createElement("h2");
  rulesTitle.className = "text-xl font-bold mb-3";
  rulesTitle.textContent = "Rules & Requirements";
  
  const rulesList = document.createElement("ul");
  rulesList.className = "list-disc pl-5 text-slate-300 space-y-2";
  
  competition.rules.forEach(rule => {
    const ruleItem = document.createElement("li");
    ruleItem.textContent = rule;
    rulesList.appendChild(ruleItem);
  });
  
  rulesSection.append(rulesTitle, rulesList);
   // Assemble left column
  card.append(header, descriptionSection, detailsGrid, rulesSection);
  leftColumn.appendChild(card);

  // Right column - Registration form
  // const rightColumn = document.createElement("div");
  // rightColumn.className = "lg:col-span-1 fade-in-element";
  
  // const formCard = document.createElement("div");
  // formCard.className = "backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-xl p-8 shadow-2xl sticky top-24";
  
  // // Add German flag mini-element
  // const formFlagBar = document.createElement("div");
  // formFlagBar.className = "h-1 w-12 mb-6 flex rounded-full overflow-hidden";
  // formFlagBar.innerHTML = `
  //   <div class="flex-1 bg-black"></div>
  //   <div class="flex-1 bg-red-700"></div>
  //   <div class="flex-1 bg-yellow-500"></div>
  // `;
  
  // const formTitle = document.createElement("h2");
  // formTitle.className = "text-xl font-bold mb-6";
  // formTitle.textContent = "Register for this Competition";
  
  // const registrationForm = document.createElement("form");
  // registrationForm.className = "space-y-4";
  // registrationForm.addEventListener("submit", async (e) => {
  //   e.preventDefault();
    
  //   // Gather form data
  //   const formData = new FormData(registrationForm);
  //   const data = Object.fromEntries(formData.entries());
    
  //   // Auto-detect category based on school selection
  //   const schoolName = data.schoolName || '';
  //   const selectedSchool = schools.schools.find(school => school.name === schoolName);
    
  //   if (selectedSchool) {
  //     data.category = selectedSchool.category;
  //   } else {
  //     data.category = 'Inter School'; // Default for unknown schools
  //   }
    
  //   data.timestamp = serverTimestamp(); // Add timestamp
    
  //   try {
  //     // Save to Firestore in the competition-specific collection
  //     const competitionRef = collection(db, "competitions", competitionId, "registrations");
  //     await addDoc(competitionRef, data);
      
  //     // Show success message and redirect to WhatsApp group
  //     alertManager.show("Registration successful! Redirecting to WhatsApp group...", "success");
  //     registrationForm.reset();
      
  //     // Redirect to WhatsApp group after a short delay
  //     setTimeout(() => {
  //       // Use absolute URL construction for production
  //       const baseUrl = window.location.origin;
  //       const redirectUrl = `${baseUrl}/whatsapp/`;
  //       // const redirectUrl = `${baseUrl}/whatsapp/${competitionId}`;
  //       console.log('Redirecting to:', redirectUrl); // Debug log
  //       window.location.href = redirectUrl;
  //     }, 0);
  //   } catch (error) {
  //     console.error("Error saving registration: ", error);
  //     alertManager.show("Failed to register. Please try again later.", "error");
  //   }
  // });
  
  // // Form fields
  // const formFields = [
  //   { type: "text", name: "fullName", label: "Full Name", required: true },
  //   { 
  //     type: "custom-select", 
  //     name: "schoolName", 
  //     label: "School/Institution", 
  //     required: true,
  //     options: [
  //       { value: "", label: "Select your school" },
  //       ...schools.schools
  //         // .filter(school => {
  //         //   // Exclude Royal College for TTC NOT NEEDED
  //         //   if (competitionId === 'ttc' && school.name.toLowerCase().includes('royal college')) {
  //         //     return false;
  //         //   }
  //         //   return true;
  //         // })
  //         .map(school => ({
  //           value: school.name,
  //           label: school.name
  //         }))
  //     ]
  //   },
  //   { type: "email", name: "email", label: "Email", required: true },
  //   { type: "tel", name: "phone", label: "Phone Number (WhatsApp)", required: true },
  //   // { 
  //   //   type: "textarea", 
  //   //   name: "experience", 
  //   //   label: "Previous Experience", 
  //   //   required: false,
  //   //   placeholder: "Tell us about your background and experience with German language and culture"
  //   // }
  // ];
  
  // formFields.forEach(field => {
  //   const formGroup = document.createElement("div");
    
  //   if (field.type === "checkbox") {
  //     formGroup.className = "flex items-center space-x-3";
      
  //     const input = document.createElement("input");
  //     input.type = field.type;
  //     input.id = field.name;
  //     input.name = field.name;
  //     input.required = field.required;
  //     input.className = "rounded text-yellow-500 focus:ring-2 focus:ring-yellow-400";
      
  //     const label = document.createElement("label");
  //     label.htmlFor = field.name;
  //     label.className = "text-sm text-white";
  //     label.textContent = field.label;
      
  //     formGroup.append(input, label);
  //   } else if (field.type === "custom-select") {
  //     formGroup.className = "space-y-1";
      
  //     const label = document.createElement("label");
  //     label.htmlFor = field.name;
  //     label.className = "block text-sm text-slate-300";
  //     label.textContent = field.label;
      
  //     // Create custom select container
  //     const customSelect = document.createElement("div");
  //     customSelect.className = "relative custom-select-container";
      
  //     // Selected option display
  //     const selectedDisplay = document.createElement("div");
  //     selectedDisplay.className = "flex items-center justify-between w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white cursor-pointer hover:bg-slate-600/50 transition-all custom-select-selected";
  //     selectedDisplay.tabIndex = 0; // Make it focusable
      
  //     // Text display
  //     const selectedText = document.createElement("div");
  //     selectedText.className = "selected-text";
  //     selectedText.textContent = field.options[0].label;
  //     selectedText.dataset.value = field.options[0].value;
      
  //     // Arrow icon
  //     const arrowIcon = document.createElement("div");
  //     arrowIcon.className = "transform transition-transform duration-300";
  //     arrowIcon.innerHTML = `
  //       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  //       </svg>
  //     `;
      
  //     selectedDisplay.appendChild(selectedText);
  //     selectedDisplay.appendChild(arrowIcon);
      
  //     // Options dropdown
  //     const optionsContainer = document.createElement("div");
  //     optionsContainer.className = "custom-select-options absolute top-full left-0 right-0 z-50 max-h-0 overflow-y-auto overflow-x-hidden opacity-0 rounded-lg backdrop-blur-md bg-slate-800/95 border border-slate-600 shadow-xl transition-all duration-300 transform translate-y-[-10px]";
      
  //     // Add options
  //     field.options.forEach((option, index) => {
  //       if (option.value === "") return; // Skip the placeholder option
        
  //       const optionEl = document.createElement("div");
  //       optionEl.className = "px-4 py-3 hover:bg-slate-600/50 cursor-pointer text-white border-b border-slate-700/30 last:border-b-0 transition-colors text-sm";
  //       optionEl.textContent = option.label;
  //       optionEl.dataset.value = option.value;
        
  //       optionEl.addEventListener("click", (e) => {
  //         e.stopPropagation();
  //         selectedText.textContent = option.label;
  //         selectedText.dataset.value = option.value;
          
  //         // Update selected state for all options
  //         optionsContainer.querySelectorAll('div').forEach(opt => {
  //           opt.classList.remove('bg-slate-600/50');
  //         });
  //         optionEl.classList.add('bg-slate-600/50');
          
  //         // Close dropdown
  //         optionsContainer.classList.remove("max-h-60", "opacity-100", "translate-y-0");
  //         optionsContainer.classList.add("max-h-0", "opacity-0", "translate-y-[-10px]");
  //         arrowIcon.classList.remove("rotate-180");
          
  //         // Create/update hidden input for form submission
  //         const hiddenInput = customSelect.querySelector('input[type="hidden"]');
  //         if (hiddenInput) {
  //           hiddenInput.value = option.value;
  //         }
          
  //         // Remove focus from the select
  //         selectedDisplay.blur();
  //       });
        
  //       optionsContainer.appendChild(optionEl);
  //     });
      
  //     // Toggle dropdown on click
  //     selectedDisplay.addEventListener("click", (e) => {
  //       e.stopPropagation();
  //       const isOpen = optionsContainer.classList.contains("opacity-100");
        
  //       if (isOpen) {
  //         // Close dropdown
  //         optionsContainer.classList.remove("max-h-60", "opacity-100", "translate-y-0");
  //         optionsContainer.classList.add("max-h-0", "opacity-0", "translate-y-[-10px]");
  //         arrowIcon.classList.remove("rotate-180");
  //       } else {
  //         // Open dropdown
  //         optionsContainer.classList.remove("max-h-0", "opacity-0", "translate-y-[-10px]");
  //         optionsContainer.classList.add("max-h-60", "opacity-100", "translate-y-0");
  //         arrowIcon.classList.add("rotate-180");
  //       }
  //     });
      
  //     // Close dropdown when clicking outside
  //     document.addEventListener("click", (e) => {
  //       if (!customSelect.contains(e.target)) {
  //         optionsContainer.classList.remove("max-h-60", "opacity-100", "translate-y-0");
  //         optionsContainer.classList.add("max-h-0", "opacity-0", "translate-y-[-10px]");
  //         arrowIcon.classList.remove("rotate-180");
  //       }
  //     });
      
  //     // Also handle keyboard navigation
  //     selectedDisplay.addEventListener("keydown", (e) => {
  //       if (e.code === "Space" || e.code === "Enter") {
  //         e.preventDefault();
  //         selectedDisplay.click();
  //       }
  //     });
      
  //     // Hidden input for form submission
  //     const hiddenInput = document.createElement("input");
  //     hiddenInput.type = "hidden";
  //     hiddenInput.name = field.name;
  //     hiddenInput.id = field.name;
  //     hiddenInput.value = field.options[0].value;
  //     hiddenInput.required = field.required;
      
  //     customSelect.appendChild(selectedDisplay);
  //     customSelect.appendChild(optionsContainer);
  //     customSelect.appendChild(hiddenInput);
      
  //     formGroup.append(label, customSelect);
  //   } else {
  //     formGroup.className = "space-y-1";
      
  //     const label = document.createElement("label");
  //     label.htmlFor = field.name;
  //     label.className = "block text-sm text-slate-300";
  //     label.textContent = field.label;
      
  //     let input;
      
  //     if (field.type === "textarea") {
  //       input = document.createElement("textarea");
  //       input.className = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50";
  //       input.rows = 4;
  //       if (field.placeholder) input.placeholder = field.placeholder;
  //     } else {
  //       input = document.createElement("input");
  //       input.type = field.type;
  //       input.className = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50";
  //       if (field.placeholder) input.placeholder = field.placeholder;
  //     }
      
  //     input.id = field.name;
  //     input.name = field.name;
  //     input.required = field.required;
      
  //     formGroup.append(label, input);
  //   }
    
  //   registrationForm.appendChild(formGroup);
  // });
  
  // // Submit button
  // const submitButton = document.createElement("button");
  // submitButton.type = "submit";
  // submitButton.className = "w-full py-3 px-6 mt-6 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:translate-y-[-2px]";
  // submitButton.textContent = "Submit Application";

  // // Submissions redirect
  // const submissionsbtn = document.createElement("button");
  // submissionsbtn.onclick = () => {
  //   setTimeout(() => {
  //       // Use absolute URL construction for production
  //       const redirectUrl = `/submissions/${competitionId}`;
  //       console.log('Redirecting to:', redirectUrl); // Debug log
  //       window.location.href = redirectUrl;
  //     }, 0);
  // }
  // submissionsbtn.className = "w-full py-3 px-6 mt-6 bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-400/80 hover:to-slate-500/80 text-black font-bold rounded-lg transition-all duration-300 transform hover:translate-y-[-2px]";
  // submissionsbtn.textContent = "Ready to upload your creation?";
  
  // registrationForm.appendChild(submitButton);
  // registrationForm.appendChild(submissionsbtn);
  
  // formCard.append(formFlagBar, formTitle, registrationForm);
  // rightColumn.appendChild(formCard);
  
  // Assemble details section
  detailsSection.append(leftColumn);
  innerContent.appendChild(detailsSection);
  
  // Add content to page
  content.appendChild(innerContent);
  container.appendChild(content);
  
  // Footer
  container.appendChild(createFooter());
  
  return container;
}

// Helper function to clean up existing mobile menus
function cleanupMobileMenu() {
  const existingMobileMenu = document.getElementById('competition-mobile-menu');
  if (existingMobileMenu) {
    existingMobileMenu.remove();
  }
  
  // Also remove mobile menu open class from body if it exists
  document.body.classList.remove('mobile-menu-open');
}

// Helper function to create navigation with German flag elements
function createNavigation() {
  // Clean up any existing mobile menu to prevent duplicates
  cleanupMobileMenu();
  
  const navbar = document.createElement("nav");
  navbar.className = "sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-6 py-4";
  
  const navContent = document.createElement("div");
  navContent.className = "flex justify-between items-center max-w-7xl mx-auto";
  
  const logo = document.createElement("a");
  logo.href = "/";
  logo.className = "text-xl font-bold flex items-center";
  
  // Add German flag colors to the logo
  logo.innerHTML = `
    <span class="mr-2 flex">
      <span class="h-5 w-2 bg-black rounded-l"></span>
      <span class="h-5 w-2 bg-red-700"></span>
      <span class="h-5 w-2 bg-yellow-500 rounded-r"></span>
    </span>
    <span class="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200">Zeit für Deutsch '25</span>
  `;
  
  const navLinks = document.createElement("div");
  navLinks.className = "hidden md:flex space-x-8";
  
  ["Home", "Competitions", "Schedule", "Gallery"].forEach(link => {
    const a = document.createElement("a");
    a.href = link.toLowerCase() === "home" ? "/" : `/#${link.toLowerCase()}`;
    a.className = "font-medium text-slate-300 hover:text-yellow-200 transition-all duration-300";
    a.textContent = link;
    navLinks.appendChild(a);
  });
  
  const mobileMenuBtn = document.createElement("button");
  mobileMenuBtn.className = "md:hidden text-white p-2 relative z-50 transition-all duration-300";
  mobileMenuBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hamburger-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 close-icon hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `;
  
  // Create mobile menu
  const mobileMenu = document.createElement("div");
  mobileMenu.id = "competition-mobile-menu";
  mobileMenu.className = "fixed inset-0 z-40 md:hidden transform translate-x-full transition-transform duration-300 ease-in-out";
  
  const mobileMenuOverlay = document.createElement("div");
  mobileMenuOverlay.className = "absolute inset-0 bg-black/50 backdrop-blur-sm";
  
  const mobileMenuPanel = document.createElement("div");
  mobileMenuPanel.className = "absolute right-0 top-0 h-full w-80 max-w-sm bg-slate-900/95 backdrop-blur-md border-l border-slate-700 shadow-2xl";
  
  const mobileMenuContent = document.createElement("div");
  mobileMenuContent.className = "flex flex-col h-full pt-20 px-6";
  
  // Add mobile menu links
  ["Home", "Competitions", "Schedule", "Gallery"].forEach(link => {
    const a = document.createElement("a");
    a.href = link.toLowerCase() === "home" ? "/" : `/#${link.toLowerCase()}`;
    a.className = "mobile-menu-link block py-4 px-4 text-lg font-medium text-slate-300 hover:text-yellow-200 border-b border-slate-700/50 transition-all duration-300 hover:bg-slate-800/50 rounded-lg";
    a.textContent = link;
    
    // Close menu when link is clicked
    a.addEventListener('click', () => {
      toggleMobileMenu();
    });
    
    mobileMenuContent.appendChild(a);
  });
  
  mobileMenuPanel.appendChild(mobileMenuContent);
  mobileMenu.append(mobileMenuOverlay, mobileMenuPanel);
  
  // Toggle mobile menu function
  function toggleMobileMenu() {
    const hamburgerIcon = mobileMenuBtn.querySelector('.hamburger-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    
    if (mobileMenu.classList.contains('translate-x-full')) {
      // Open menu
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      document.body.classList.add('mobile-menu-open');
    } else {
      // Close menu
      mobileMenu.classList.add('translate-x-full');
      mobileMenu.classList.remove('translate-x-0');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      document.body.classList.remove('mobile-menu-open');
    }
  }
  
  // Add event listeners
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
      toggleMobileMenu();
    }
  });
  
  navContent.append(logo, navLinks, mobileMenuBtn);
  navbar.appendChild(navContent);
  
  // Return both navbar and mobile menu
  return { navbar, mobileMenu };
}

// Helper function to create footer with German theme
function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "backdrop-blur-md bg-slate-900/90 border-t border-slate-800 py-12 mt-20";
  
  const footerContent = document.createElement("div");
  footerContent.className = "max-w-7xl mx-auto px-6";
  
  const footerGrid = document.createElement("div");
  footerGrid.className = "grid grid-cols-1 md:grid-cols-3 gap-8 mb-8";
  
  // About column
  const aboutColumn = document.createElement("div");
  
  const footerLogo = document.createElement("div");
  footerLogo.className = "flex items-center mb-4";
  
  // Logo with German flag elements
  footerLogo.innerHTML = `
    <span class="mr-2 flex">
      <span class="h-4 w-1.5 bg-black rounded-l"></span>
      <span class="h-4 w-1.5 bg-red-700"></span>
      <span class="h-4 w-1.5 bg-yellow-500 rounded-r"></span>
    </span>
    <span class="text-lg font-bold">Zeit für Deutsch '25</span>
  `;
  
  const aboutText = document.createElement("p");
  aboutText.className = "text-slate-400 text-sm mb-4";
  aboutText.textContent = "The annual celebration of German language and culture at Royal College, showcasing student achievements and promoting German heritage.";
  
  aboutColumn.append(footerLogo, aboutText);
  
  // Quick links column
  const linksColumn = document.createElement("div");
  
  const linksTitle = document.createElement("h4");
  linksTitle.className = "text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4";
  linksTitle.textContent = "Quick Links";
  
  const linksList = document.createElement("ul");
  linksList.className = "space-y-2";
  
  ["Competitions", "Schedule", "Gallery"].forEach(link => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.toLowerCase().replace(/\s+/g, '-') === "contact-us" ? `/pages/contact-us` : `/#${link.toLowerCase().replace(/\s+/g, '-')}`;
    a.className = "text-sm text-slate-400 hover:text-yellow-300 transition-colors";
    a.textContent = link;
    li.appendChild(a);
    linksList.appendChild(li);
  });
  
  linksColumn.append(linksTitle, linksList);
  
  // Contact info column
  const contactColumn = document.createElement("div");
  
  const contactTitle = document.createElement("h4");
  contactTitle.className = "text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4";
  contactTitle.textContent = "Contact";
  
  const contactInfo = document.createElement("ul");
  contactInfo.className = "space-y-3 text-sm text-slate-400";
  
  const contactItems = [
    { icon: "email", text: "info@germanday.live" },
    { icon: "phone", text: "+94 75 122 8301" }
  ];
  
  contactItems.forEach(item => {
    const li = document.createElement("li");
    li.className = "flex items-start";
    li.innerHTML = `
      <span class="mr-2 material-icons">${item.icon}</span>
      <span>${item.text}</span>
    `;
    contactInfo.appendChild(li);
  });
  
  contactColumn.append(contactTitle, contactInfo);
  
  footerGrid.append(aboutColumn, linksColumn, contactColumn);
  
  const footerBottom = document.createElement("div");
  footerBottom.className = "pt-6 mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center";
  
  const copyright = document.createElement("div");
  copyright.className = "text-slate-400 text-sm";
  copyright.innerHTML = `&copy; ${new Date().getFullYear()} Royal College German Unit. All rights reserved.`;
  
  footerContent.append(footerGrid, footerBottom, copyright);
  footer.appendChild(footerContent);
  
  return footer;
}

