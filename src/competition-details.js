import './style.css';
import { db } from './firebase-config';
import { collection, addDoc, serverTimestamp } from '@firebase/firestore';
import Alert from './components/Alert';

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
  const competitionId = pathParts[pathParts.length - 1] || 'poetry-recitation'; // Default to first competition if no ID

  // Container for the entire page
  const container = document.createElement("div");
  container.className = "min-h-screen flex flex-col bg-slate-900 text-white overflow-x-hidden";
  
  // Add professional German-themed background
  const backgroundOverlay = document.createElement("div");
  backgroundOverlay.className = "fixed inset-0 z-0";
  backgroundOverlay.innerHTML = `
    <div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
    <div class="absolute inset-0 opacity-5" style="background: url('https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&q=80') center/cover no-repeat fixed"></div>
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-red-800 to-yellow-600"></div>
  `;
  container.appendChild(backgroundOverlay);
  
  // Add subtle glass elements
  const glassElements = document.createElement("div");
  glassElements.className = "fixed inset-0 z-0 overflow-hidden";
  
  // Create fewer, more professional glass elements
  for (let i = 0; i < 5; i++) {
    const element = document.createElement("div");
    const size = Math.random() * 300 + 100;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    element.className = "absolute rounded-full backdrop-blur-md bg-white/[0.02]";
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.left = `${posX}%`;
    element.style.top = `${posY}%`;
    element.style.animation = `float 30s ease-in-out ${Math.random() * 10}s infinite alternate`;
    
    glassElements.appendChild(element);
  }
  container.appendChild(glassElements);
  
  // Create navigation
  container.appendChild(createNavigation());
  
  // Main content
  const content = document.createElement("div");
  content.className = "flex-1 z-10 py-10 px-4 md:px-6";
  
  // Inner container
  const innerContent = document.createElement("div");
  innerContent.className = "max-w-7xl mx-auto";
  
  // Find competition details by ID
  const competition = competitions.find(c => c.id === competitionId) || competitions[0];
  
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
  leftColumn.className = "lg:col-span-2 fade-in-element";
  
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
  competitionIcon.textContent = competition.icon;
  
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
      title: "Date & Time",
      value: competition.datetime,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>`
    },
    {
      title: "Location",
      value: competition.location,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>`
    },
    {
      title: "Eligibility",
      value: competition.eligibility,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>`
    },
    {
      title: "Registration Deadline",
      value: competition.deadline,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`
    }
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
  
  // Prizes section
  const prizesSection = document.createElement("div");
  prizesSection.className = "mb-8";
  
  const prizesTitle = document.createElement("h2");
  prizesTitle.className = "text-xl font-bold mb-3";
  prizesTitle.textContent = "Prizes";
  
  const prizesGrid = document.createElement("div");
  prizesGrid.className = "grid grid-cols-3 gap-3";
  
  const prizePositions = [
    { position: "1st Place", amount: competition.prizes.first, color: "from-yellow-500/80 to-amber-600/80" },
    { position: "2nd Place", amount: competition.prizes.second, color: "from-slate-400/80 to-slate-500/80" },
    { position: "3rd Place", amount: competition.prizes.third, color: "from-yellow-700/80 to-amber-800/80" }
  ];
  
  prizePositions.forEach(prize => {
    const prizeCard = document.createElement("div");
    prizeCard.className = `bg-gradient-to-b ${prize.color} backdrop-blur-sm rounded-lg p-4 text-center transform transition-transform hover:scale-105`;
    
    const prizePosition = document.createElement("div");
    prizePosition.className = "text-sm font-medium text-white/80";
    prizePosition.textContent = prize.position;
    
    const prizeAmount = document.createElement("div");
    prizeAmount.className = "text-2xl font-bold text-white";
    prizeAmount.textContent = prize.amount;
    
    prizeCard.append(prizePosition, prizeAmount);
    prizesGrid.appendChild(prizeCard);
  });
  
  prizesSection.append(prizesTitle, prizesGrid);
  
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
  card.append(header, descriptionSection, detailsGrid, prizesSection, rulesSection);
  leftColumn.appendChild(card);
  
  // Right column - Registration form
  const rightColumn = document.createElement("div");
  rightColumn.className = "lg:col-span-1 fade-in-element";
  
  const formCard = document.createElement("div");
  formCard.className = "backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-xl p-8 shadow-2xl sticky top-24";
  
  // Add German flag mini-element
  const formFlagBar = document.createElement("div");
  formFlagBar.className = "h-1 w-12 mb-6 flex rounded-full overflow-hidden";
  formFlagBar.innerHTML = `
    <div class="flex-1 bg-black"></div>
    <div class="flex-1 bg-red-700"></div>
    <div class="flex-1 bg-yellow-500"></div>
  `;
  
  const formTitle = document.createElement("h2");
  formTitle.className = "text-xl font-bold mb-6";
  formTitle.textContent = "Register for this Competition";
  
  const registrationForm = document.createElement("form");
  registrationForm.className = "space-y-4";
  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Gather form data
    const formData = new FormData(registrationForm);
    const data = Object.fromEntries(formData.entries());
    data.timestamp = serverTimestamp(); // Add timestamp
    
    try {
      // Save to Firestore in the competition-specific collection
      const competitionRef = collection(db, "competitions", competitionId, "registrations");
      await addDoc(competitionRef, data);
      
      // Show success message
      alertManager.show("Registration successful!", "success");
      registrationForm.reset();
    } catch (error) {
      console.error("Error saving registration: ", error);
      alertManager.show("Failed to register. Please try again later.", "error");
    }
  });
  
  // Form fields
  const formFields = [
    { type: "text", name: "fullName", label: "Full Name", required: true },
    { type: "email", name: "email", label: "Email", required: true },
    { type: "tel", name: "phone", label: "Phone Number", required: true },
    { 
      type: "custom-select", 
      name: "category", 
      label: "Category", 
      required: true,
      options: competition.categoryOptions
    },
    { 
      type: "textarea", 
      name: "experience", 
      label: "Previous Experience", 
      required: false,
      placeholder: "Tell us about your background and experience with German language and culture"
    }
  ];
  
  formFields.forEach(field => {
    const formGroup = document.createElement("div");
    
    if (field.type === "checkbox") {
      formGroup.className = "flex items-center space-x-3";
      
      const input = document.createElement("input");
      input.type = field.type;
      input.id = field.name;
      input.name = field.name;
      input.required = field.required;
      input.className = "rounded text-yellow-500 focus:ring-2 focus:ring-yellow-400";
      
      const label = document.createElement("label");
      label.htmlFor = field.name;
      label.className = "text-sm text-white";
      label.textContent = field.label;
      
      formGroup.append(input, label);
    } else if (field.type === "custom-select") {
      formGroup.className = "space-y-1";
      
      const label = document.createElement("label");
      label.htmlFor = field.name;
      label.className = "block text-sm text-slate-300";
      label.textContent = field.label;
      
      // Create custom select container
      const customSelect = document.createElement("div");
      customSelect.className = "relative custom-select-container";
      
      // Selected option display
      const selectedDisplay = document.createElement("div");
      selectedDisplay.className = "flex items-center justify-between w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white cursor-pointer hover:bg-slate-600/50 transition-all custom-select-selected";
      selectedDisplay.tabIndex = 0; // Make it focusable
      
      // Text display
      const selectedText = document.createElement("div");
      selectedText.className = "selected-text";
      selectedText.textContent = field.options[0].label;
      selectedText.dataset.value = field.options[0].value;
      
      // Arrow icon
      const arrowIcon = document.createElement("div");
      arrowIcon.className = "transform transition-transform duration-300";
      arrowIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      `;
      
      selectedDisplay.appendChild(selectedText);
      selectedDisplay.appendChild(arrowIcon);
      
      // Options dropdown
      const optionsContainer = document.createElement("div");
      optionsContainer.className = "custom-select-options";
      optionsContainer.style.display = "none";
      
      // Add options
      field.options.forEach((option, index) => {
        if (option.value === "") return; // Skip the placeholder option
        
        const optionEl = document.createElement("div");
        optionEl.className = "px-4 py-2 hover:bg-slate-600 cursor-pointer";
        optionEl.textContent = option.label;
        optionEl.dataset.value = option.value;
        
        optionEl.addEventListener("click", () => {
          selectedText.textContent = option.label;
          selectedText.dataset.value = option.value;
          
          // Update selected state for all options
          optionsContainer.querySelectorAll('div').forEach(opt => {
            opt.classList.remove('bg-slate-600');
          });
          optionEl.classList.add('bg-slate-600');
          
          optionsContainer.classList.remove("active");
          arrowIcon.classList.remove("rotate-180");
          optionsContainer.style.display = "none";
          
          // Create/update hidden input for form submission
          const hiddenInput = customSelect.querySelector('input[type="hidden"]');
          if (hiddenInput) {
            hiddenInput.value = option.value;
          }
          
          // Remove focus from the select
          selectedDisplay.blur();
        });
        
        optionsContainer.appendChild(optionEl);
      });
      
      // Toggle dropdown on click
      selectedDisplay.addEventListener("click", (e) => {
        e.stopPropagation();
        const isActive = optionsContainer.classList.contains("active");
        
        if (isActive) {
          optionsContainer.classList.remove("active");
          arrowIcon.classList.remove("rotate-180");
        } else {
          optionsContainer.classList.add("active");
          arrowIcon.classList.add("rotate-180");
          optionsContainer.style.display = "block"; // Ensure it's visible
        }
      });
      
      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!customSelect.contains(e.target)) {
          optionsContainer.classList.remove("active");
          arrowIcon.classList.remove("rotate-180");
        }
      });
      
      // Also handle keyboard navigation
      selectedDisplay.addEventListener("keydown", (e) => {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          selectedDisplay.click();
        }
      });
      
      // Hidden input for form submission
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = field.name;
      hiddenInput.id = field.name;
      hiddenInput.value = field.options[0].value;
      hiddenInput.required = field.required;
      
      customSelect.appendChild(selectedDisplay);
      customSelect.appendChild(optionsContainer);
      customSelect.appendChild(hiddenInput);
      
      formGroup.append(label, customSelect);
    } else {
      formGroup.className = "space-y-1";
      
      const label = document.createElement("label");
      label.htmlFor = field.name;
      label.className = "block text-sm text-slate-300";
      label.textContent = field.label;
      
      let input;
      
      if (field.type === "textarea") {
        input = document.createElement("textarea");
        input.className = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50";
        input.rows = 4;
        if (field.placeholder) input.placeholder = field.placeholder;
      } else {
        input = document.createElement("input");
        input.type = field.type;
        input.className = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50";
        if (field.placeholder) input.placeholder = field.placeholder;
      }
      
      input.id = field.name;
      input.name = field.name;
      input.required = field.required;
      
      formGroup.append(label, input);
    }
    
    registrationForm.appendChild(formGroup);
  });
  
  // Submit button
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "w-full py-3 px-6 mt-6 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:translate-y-[-2px]";
  submitButton.textContent = "Submit Application";
  
  registrationForm.appendChild(submitButton);
  
  formCard.append(formFlagBar, formTitle, registrationForm);
  rightColumn.appendChild(formCard);
  
  // Assemble details section
  detailsSection.append(leftColumn, rightColumn);
  innerContent.appendChild(detailsSection);
  
  // Add content to page
  content.appendChild(innerContent);
  container.appendChild(content);
  
  // Footer
  container.appendChild(createFooter());
  
  return container;
}

// Helper function to create navigation with German flag elements
function createNavigation() {
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
    <span class="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200">Tag Der Deutschen Sprache '25</span>
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
  mobileMenuBtn.className = "md:hidden text-white p-2";
  mobileMenuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>`;
  
  navContent.append(logo, navLinks, mobileMenuBtn);
  navbar.appendChild(navContent);
  
  return navbar;
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
    <span class="text-lg font-bold">Tag Der Deutschen Sprache</span>
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
    { icon: "", text: "info@germanday.lk" },
    { icon: "", text: "+94 11 111 1111" }
  ];
  
  contactItems.forEach(item => {
    const li = document.createElement("li");
    li.className = "flex items-start";
    li.innerHTML = `
      <span class="mr-2">${item.icon}</span>
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

// Competition data
const competitions = [
  {
    id: "poetry-recitation",
    title: "German Poetry Recitation",
    icon: "🎭",
    description: "Recite classic and modern German poetry with perfect pronunciation and expressive delivery.",
    categories: "Junior, Intermediate, Advanced",
    datetime: "May 30, 2025 • 11:30 AM - 2:00 PM",
    location: "Goethe Hall, Cultural Center",
    eligibility: "Open to all German learners",
    deadline: "April 15, 2025",
    prizes: {
      first: "€500",
      second: "€300",
      third: "€150"
    },
    fullDescription: `
      <p>The German Poetry Recitation Competition is one of the most prestigious events of German Day. Participants will recite poetry from memory, showcasing their mastery of pronunciation, intonation, and artistic interpretation.</p>
      
      <p>Participants will select poems from our curated collection or may propose their own selection (subject to approval). Performances will be judged on pronunciation, memorization, artistic interpretation, and stage presence.</p>
      
      <p>This competition offers a unique opportunity to engage deeply with German literary culture and demonstrate your language proficiency in a creative and expressive way.</p>
    `,
    rules: [
      "Participants must recite from memory (no reading allowed).",
      "Performance time limit: 4 minutes maximum.",
      "Props are not allowed, but appropriate gestures and movement are encouraged.",
      "Participants must provide 3 printed copies of their poem for the judges.",
      "Participants will be judged on pronunciation, memorization, artistic interpretation, and stage presence."
    ],
    categoryOptions: [
      { value: "", label: "Select a category" },
      { value: "junior", label: "Junior (Ages 12-15)" },
      { value: "intermediate", label: "Intermediate (Ages 16-18)" },
      { value: "advanced", label: "Advanced (Ages 19+)" }
    ]
  },
  {
    id: "spelling-bee",
    title: "German Spelling Bee",
    icon: "📝",
    description: "Test your German spelling skills with increasingly difficult words in this competitive spelling challenge.",
    categories: "All Levels",
    datetime: "May 31, 2025 • 10:00 AM - 12:30 PM",
    location: "Schiller Auditorium, Cultural Center",
    eligibility: "All German language students",
    deadline: "April 15, 2025",
    prizes: {
      first: "€400",
      second: "€250",
      third: "€100"
    },
    fullDescription: `
      <p>The German Spelling Bee challenges participants to correctly spell increasingly difficult German words. This competition tests your knowledge of German orthography, including special characters, compound words, and grammatical rules.</p>
      
      <p>Participants will compete in rounds, with words becoming progressively more challenging. You'll need to spell each word correctly, including proper capitalization and umlauts where applicable.</p>
      
      <p>This competition is perfect for language enthusiasts who take pride in their attention to detail and precision in written German.</p>
    `,
    rules: [
      "Each participant will have 30 seconds to spell a word after it is announced.",
      "Contestants may ask for the definition, language of origin, and usage in a sentence.",
      "Once you begin spelling a word, you cannot start over.",
      "Correct capitalization and all special characters (ä, ö, ü, ß) must be included.",
      "Three rounds of increasing difficulty will be conducted."
    ],
    categoryOptions: [
      { value: "", label: "Select a category" },
      { value: "beginner", label: "Beginner (1-2 years of study)" },
      { value: "intermediate", label: "Intermediate (3-4 years of study)" },
      { value: "advanced", label: "Advanced (5+ years of study)" }
    ]
  },
  {
    id: "cultural-quiz",
    title: "Cultural Knowledge Quiz",
    icon: "🧠",
    description: "Show your knowledge of German history, culture, geography, and current events in this challenging quiz.",
    categories: "Individual, Team",
    datetime: "June 1, 2025 • 1:30 PM - 4:00 PM",
    location: "Einstein Conference Hall, Cultural Center",
    eligibility: "Open to all participants",
    deadline: "April 30, 2025",
    prizes: {
      first: "€600",
      second: "€350",
      third: "€200"
    },
    fullDescription: `
      <p>The Cultural Knowledge Quiz tests your understanding of German-speaking countries' history, geography, politics, art, literature, music, sports, and current events. This comprehensive challenge will separate casual enthusiasts from true German culture aficionados.</p>
      
      <p>Participants may compete individually or in teams of up to three people. The quiz consists of multiple rounds featuring various question formats including multiple choice, short answer, identification, and lightning rounds.</p>
      
      <p>This competition rewards both breadth and depth of knowledge about German-speaking countries and their global influence.</p>
    `,
    rules: [
      "Individual participants compete alone; teams may have up to 3 members.",
      "Electronic devices are not permitted during the competition.",
      "The quiz will cover German history, geography, arts, literature, music, sports, politics, and current events.",
      "Judges' decisions are final on all answers.",
      "In case of a tie, a sudden-death question round will determine the winner."
    ],
    categoryOptions: [
      { value: "", label: "Select a category" },
      { value: "individual", label: "Individual Participant" },
      { value: "team", label: "Team (2-3 members)" }
    ]
  },
  {
    id: "cuisine-contest",
    title: "German Cuisine Cook-Off",
    icon: "🍽️",
    description: "Prepare authentic German dishes judged on taste, presentation, and cultural authenticity.",
    categories: "Amateur, Professional",
    datetime: "May 29, 2025 • 2:00 PM - 6:00 PM",
    location: "Culinary Pavilion, Festival Grounds",
    eligibility: "Open to all cooking enthusiasts",
    deadline: "April 15, 2025",
    prizes: {
      first: "€800",
      second: "€500",
      third: "€250"
    },
    fullDescription: `
      <p>The German Cuisine Cook-Off invites culinary enthusiasts to showcase their skills in preparing authentic German dishes. From regional specialties to classic favorites, this competition celebrates the rich gastronomic traditions of Germany.</p>
      
      <p>Participants will prepare their dishes in a timed setting, bringing their own ingredients. Each entry will be judged on taste, presentation, technical skill, and cultural authenticity by a panel of professional chefs and German cuisine experts.</p>
      
      <p>This competition offers food lovers a chance to demonstrate their passion for German cooking techniques, flavors, and traditions.</p>
    `,
    rules: [
      "Participants must prepare one main dish and one side dish or dessert.",
      "All major preparation must be completed on-site within the 2-hour time limit.",
      "Participants must provide their own ingredients and tools.",
      "Dishes must represent authentic German cuisine - regional variations are encouraged.",
      "Judges will evaluate based on taste (50%), presentation (25%), and authenticity (25%)."
    ],
    categoryOptions: [
      { value: "", label: "Select a category" },
      { value: "amateur", label: "Amateur Chef" },
      { value: "professional", label: "Professional Chef" }
    ]
  },
  {
    id: "language-debate",
    title: "German Language Debate",
    icon: "💬",
    description: "Debate various topics entirely in German, showcasing your fluency and persuasive speaking skills.",
    categories: "Beginner, Intermediate, Advanced",
    datetime: "May 30, 2025 • 3:30 PM - 6:00 PM",
    location: "Humboldt Forum, Cultural Center",
    eligibility: "German language students of all levels",
    deadline: "April 15, 2025",
    prizes: {
      first: "€700",
      second: "€400",
      third: "€200"
    },
    fullDescription: `
      <p>The German Language Debate Competition challenges participants to articulate and defend positions on various topics entirely in German. This competition tests not only language proficiency but also critical thinking, research skills, and persuasive speaking.</p>
      
      <p>Participants will be assigned to debate teams and given topics in advance. During the competition, they will present arguments, counter opposing points, and respond to questions from judges - all in German.</p>
      
      <p>This competition is ideal for developing advanced language skills in a dynamic, intellectually challenging context.</p>
    `,
    rules: [
      "All debates must be conducted entirely in German.",
      "Each team will have two members who will work together.",
      "Topics will be announced two weeks before the competition.",
      "Each team will have 5 minutes for opening arguments, 3 minutes for rebuttal, and 2 minutes for closing statements.",
      "Judges will evaluate based on language proficiency, argument quality, evidence, and presentation style."
    ],
    categoryOptions: [
      { value: "", label: "Select a category" },
      { value: "beginner", label: "Beginner (1-2 years of study)" },
      { value: "intermediate", label: "Intermediate (3-4 years of study)" },
      { value: "advanced", label: "Advanced (5+ years of study)" }
    ]
  },
  {
    id: "film-media",
    title: "German Film & Media Creation",
    icon: "🎬",
    description: "Create original short films or media projects that highlight German culture, language, or history.",
    categories: "Individual, Group",
    datetime: "Projects due May 15, Screening June 1, 2025",
    location: "Media Center, Cultural Center",
    eligibility: "Open to all creative media enthusiasts",
    deadline: "April 1, 2025 (for intent to participate)",
    prizes: {
      first: "€1000",
      second: "€600",
      third: "€300"
    },
    fullDescription: `
      <p>The German Film & Media Creation Competition invites participants to produce original short films, documentaries, animations, or digital media projects that explore aspects of German language, culture, or history.</p>
      
      <p>Projects should be 3-8 minutes in length and may incorporate various media elements. While the primary language should be German, limited use of other languages with subtitles is permitted.</p>
      
      <p>This competition offers creative individuals and teams the opportunity to express their connection to German culture through visual storytelling and digital arts.</p>
    `,
    rules: [
      "Projects must be 3-8 minutes in length.",
      "Content must relate to German language, culture, or history.",
      "Primary language should be German (limited use of other languages with German subtitles is permitted).",
      "Projects must be original work created for this competition.",
      "All necessary permissions for music, images, or footage must be secured and documented."
    ],
    categoryOptions: [
      { value: "", label: "Select a category" },
      { value: "individual", label: "Individual Creator" },
      { value: "small-group", label: "Small Group (2-4 people)" },
      { value: "large-group", label: "Large Group (5+ people)" }
    ]
  }
];