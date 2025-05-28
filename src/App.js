export function App() {
  // Create main container
  const container = document.createElement("div");
  container.className = "min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-x-hidden";

  // Add animated background elements for glass effect
  const bubbles = document.createElement("div");
  bubbles.className = "fixed inset-0 z-0";
  for (let i = 0; i < 8; i++) {
    const bubble = document.createElement("div");
    const size = Math.random() * 200 + 50;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 10;
    
    bubble.className = "absolute rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl";
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${posX}%`;
    bubble.style.top = `${posY}%`;
    bubble.style.animation = `float 15s ease-in-out ${delay}s infinite alternate`;
    bubbles.appendChild(bubble);
  }
  container.appendChild(bubbles);

  // Create navbar
  const navbar = document.createElement("nav");
  navbar.className = "sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/10 px-6 py-4";
  
  const navContent = document.createElement("div");
  navContent.className = "flex justify-between items-center max-w-7xl mx-auto";
  
  const logo = document.createElement("div");
  logo.className = "text-xl font-bold flex items-center";
  logo.innerHTML = "Tag Der Deutschen Sprache '25";
  // logo.innerHTML = "<span class='text-2xl mr-2'>🇩🇪</span> Tag Der Deutschen Sprache '25";
  
  const navLinks = document.createElement("div");
  navLinks.className = "hidden md:flex space-x-8";
  
  ["Home", "Competitions", "Schedule", "Gallery", "Register"].forEach(link => {
    const a = document.createElement("a");
    a.href = link.toLowerCase() === "home" ? "#" : `#${link.toLowerCase()}`;
    a.className = "hover:text-yellow-300 transition-all duration-300";
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
  
  // Main content
  const content = document.createElement("div");
  content.className = "flex-1 z-10";
  
  // Hero section
  const heroSection = document.createElement("section");
  heroSection.id = "home";
  heroSection.className = "min-h-[90vh] flex items-center justify-center px-4 py-20 relative";
  
  const heroCard = document.createElement("div");
  heroCard.className = "relative backdrop-blur-xl bg-white/15 border border-white/20 rounded-2xl p-8 md:p-12 w-full max-w-5xl shadow-2xl text-center transform transition-all duration-700";
  heroCard.style.animation = "fadeIn 1s ease-out";
  
  const heroContent = document.createElement("div");
  heroContent.className = "relative z-10";
  
  const germanyFlag = document.createElement("div");
  germanyFlag.className = "mx-auto mb-6 flex justify-center items-center";
  
  const logo1 = document.createElement("img");
  logo1.src = "/rc.svg";
  logo1.alt = "German Day Logo";
  logo1.className = "h-20 w-auto";
  germanyFlag.appendChild(logo1);
  
  const heroTitle = document.createElement("h1");
  heroTitle.className = "text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg";
  heroTitle.textContent = "Tag Der Deutschen Sprache '25";
  
  const heroDate = document.createElement("p");
  heroDate.className = "text-yellow-300 text-xl md:text-2xl mb-6";
  heroDate.textContent = "May 28 - June 2, 2025";
  
  const heroDescription = document.createElement("p");
  heroDescription.className = "text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed";
  heroDescription.textContent = "Experience the vibrant spirit of German culture with exciting competitions, authentic cuisine, and unforgettable performances. Join us for the most anticipated German cultural celebration of the year!";
  
  const heroBtnContainer = document.createElement("div");
  heroBtnContainer.className = "flex flex-col sm:flex-row justify-center gap-4 sm:gap-6";
  
  const registerBtn = document.createElement("a");
  registerBtn.href = "#register";
  registerBtn.className = "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300";
  registerBtn.textContent = "Register Now";
  
  const scheduleBtn = document.createElement("a");
  scheduleBtn.href = "#schedule";
  scheduleBtn.className = "bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full backdrop-blur-sm shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300";
  scheduleBtn.textContent = "View Schedule";
  
  heroBtnContainer.append(registerBtn, scheduleBtn);
  heroContent.append(germanyFlag, heroTitle, heroDate, heroDescription, heroBtnContainer);
  heroCard.appendChild(heroContent);
  heroSection.appendChild(heroCard);
  
  // Events section - Change to Competitions
  const eventsSection = createSection("competitions", "German Day Competitions", "Showcase your German skills and compete in these exciting competitions");
  
  const eventsGrid = document.createElement("div");
  eventsGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10";
  
  const competitions = [
    {
      title: "German Poetry Recitation",
      icon: "🎭",
      description: "Recite classic and modern German poetry with perfect pronunciation and expressive delivery.",
      categories: "Junior, Intermediate, Advanced",
      prizes: "1st: €500, 2nd: €300, 3rd: €150",
      id: "poetry-recitation"
    },
    {
      title: "German Spelling Bee",
      icon: "📝",
      description: "Test your German spelling skills with increasingly difficult words in this competitive spelling challenge.",
      categories: "All Levels",
      prizes: "1st: €400, 2nd: €250, 3rd: €100",
      id: "spelling-bee"
    },
    {
      title: "Cultural Knowledge Quiz",
      icon: "🧠",
      description: "Show your knowledge of German history, culture, geography, and current events in this challenging quiz.",
      categories: "Individual, Team",
      prizes: "1st: €600, 2nd: €350, 3rd: €200",
      id: "cultural-quiz"
    },
    {
      title: "German Cuisine Cook-Off",
      icon: "🍽️",
      description: "Prepare authentic German dishes judged on taste, presentation, and cultural authenticity.",
      categories: "Amateur, Professional",
      prizes: "1st: €800, 2nd: €500, 3rd: €250",
      id: "cuisine-contest"
    },
    {
      title: "German Language Debate",
      icon: "💬",
      description: "Debate various topics entirely in German, showcasing your fluency and persuasive speaking skills.",
      categories: "Beginner, Intermediate, Advanced",
      prizes: "1st: €700, 2nd: €400, 3rd: €200",
      id: "language-debate"
    },
    {
      title: "German Film & Media Creation",
      icon: "🎬",
      description: "Create original short films or media projects that highlight German culture, language, or history.",
      categories: "Individual, Group",
      prizes: "1st: €1000, 2nd: €600, 3rd: €300",
      id: "film-media"
    }
  ];
  
  competitions.forEach(competition => {
    const competitionCard = document.createElement("div");
    competitionCard.className = "backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105";
    
    const competitionIcon = document.createElement("div");
    competitionIcon.className = "text-4xl mb-4";
    competitionIcon.textContent = competition.icon;
    
    const competitionTitle = document.createElement("h3");
    competitionTitle.className = "text-xl font-bold text-white mb-3";
    competitionTitle.textContent = competition.title;
    
    const competitionDescription = document.createElement("p");
    competitionDescription.className = "text-white/80 mb-3";
    competitionDescription.textContent = competition.description;
    
    const competitionCategories = document.createElement("div");
    competitionCategories.className = "text-sm text-yellow-300 mb-2";
    competitionCategories.innerHTML = `<span class="font-semibold">Categories:</span> ${competition.categories}`;
    
    const competitionPrizes = document.createElement("div");
    competitionPrizes.className = "text-sm text-green-300 mb-4";
    competitionPrizes.innerHTML = `<span class="font-semibold">Prizes:</span> ${competition.prizes}`;
    
    const learnMoreLink = document.createElement("a");
    learnMoreLink.href = `/competitions/${competition.id}`;
    learnMoreLink.className = "inline-block mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg text-center";
    learnMoreLink.textContent = "Competition Details";
    
    competitionCard.append(competitionIcon, competitionTitle, competitionDescription, competitionCategories, competitionPrizes, learnMoreLink);
    eventsGrid.appendChild(competitionCard);
  });
  
  eventsSection.querySelector(".section-content").appendChild(eventsGrid);
  
  // Schedule section
  const scheduleSection = createSection("schedule", "Event Schedule", "Plan your German Day experience with our detailed schedule");
  
  const schedule = document.createElement("div");
  schedule.className = "mt-10 space-y-4";
  
  const days = ["Friday, May 30", "Saturday, May 31", "Sunday, June 1"];
  
  days.forEach(day => {
    const dayCard = document.createElement("div");
    dayCard.className = "backdrop-blur-md bg-white/10 border border-white/10 rounded-xl overflow-hidden";
    
    const dayHeader = document.createElement("div");
    dayHeader.className = "bg-white/20 px-6 py-3 font-bold text-lg";
    dayHeader.textContent = day;
    
    const eventsList = document.createElement("div");
    eventsList.className = "divide-y divide-white/10";
    
    const eventTimes = [
      { time: "10:00 AM", event: "Opening Ceremony", location: "Main Stage" },
      { time: "11:30 AM", event: "Poetry Competition Preliminaries", location: "Goethe Hall" },
      { time: "2:00 PM", event: "Cuisine Exhibition", location: "Festival Grounds" },
      { time: "4:30 PM", event: "Film Screening", location: "Auditorium" },
      { time: "7:00 PM", event: "Evening Concert", location: "Main Stage" }
    ];
    
    eventTimes.forEach(item => {
      const eventItem = document.createElement("div");
      eventItem.className = "px-6 py-4 flex flex-col sm:flex-row sm:items-center";
      
      const eventTime = document.createElement("div");
      eventTime.className = "font-mono text-yellow-300 sm:w-1/4";
      eventTime.textContent = item.time;
      
      const eventInfo = document.createElement("div");
      eventInfo.className = "sm:w-2/4";
      
      const eventName = document.createElement("div");
      eventName.className = "font-medium";
      eventName.textContent = item.event;
      
      const eventLocation = document.createElement("div");
      eventLocation.className = "sm:w-1/4 text-white/60 text-right sm:block flex";
      eventLocation.textContent = item.location;
      
      eventInfo.appendChild(eventName);
      eventItem.append(eventTime, eventInfo, eventLocation);
      eventsList.appendChild(eventItem);
    });
    
    dayCard.append(dayHeader, eventsList);
    schedule.appendChild(dayCard);
  });
  
  scheduleSection.querySelector(".section-content").appendChild(schedule);
  
  // Gallery section
  const gallerySection = createSection("gallery", "Photo Gallery", "Moments from previous German Day celebrations");
  
  const gallery = document.createElement("div");
  gallery.className = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10";
  
  for (let i = 1; i <= 8; i++) {
    const imgContainer = document.createElement("div");
    imgContainer.className = "aspect-square overflow-hidden rounded-lg backdrop-blur-sm bg-white/10 border border-white/10 hover:scale-105 transition-all duration-300 flex items-center justify-center";
    
    // Since we don't have actual images, we'll create placeholders
    const placeholder = document.createElement("div");
    placeholder.className = "text-center p-4";
    
    const emoji = document.createElement("div");
    const emojis = ["🍺", "🥨", "🎭", "🏰", "🇩🇪", "🎻", "🍖", "🎪"];
    emoji.className = "text-4xl mb-2";
    emoji.textContent = emojis[i - 1];
    
    const text = document.createElement("div");
    text.className = "text-sm text-white/70";
    text.textContent = `German Day ${2023 - i}`;
    
    placeholder.append(emoji, text);
    imgContainer.appendChild(placeholder);
    gallery.appendChild(imgContainer);
  }
  
  gallerySection.querySelector(".section-content").appendChild(gallery);
  
  // Registration section
  const registerSection = createSection("register", "Registration", "Secure your spot for German Day Competitions 2025");
  
  const registerCard = document.createElement("div");
  registerCard.className = "backdrop-blur-xl bg-white/15 border border-white/20 rounded-2xl p-8 mt-10 max-w-3xl mx-auto";
  
  const registerText = document.createElement("p");
  registerText.className = "mb-6 text-white/80";
  registerText.textContent = "Registration opens February 1, 2025. Enter your email to be notified when registration begins.";
  
  const form = document.createElement("form");
  form.className = "flex flex-col sm:flex-row gap-4";
  form.addEventListener("submit", (e) => e.preventDefault());
  
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.placeholder = "Your email address";
  emailInput.className = "flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50";
  
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 whitespace-nowrap";
  submitBtn.textContent = "Notify Me";
  
  form.append(emailInput, submitBtn);
  registerCard.append(registerText, form);
  registerSection.querySelector(".section-content").appendChild(registerCard);
  
  // Footer
  const footer = document.createElement("footer");
  footer.className = "backdrop-blur-lg bg-black/40 border-t border-white/10 py-8 mt-20";
  
  const footerContent = document.createElement("div");
  footerContent.className = "max-w-7xl mx-auto px-4 text-center";
  
  const footerLogo = document.createElement("div");
  footerLogo.className = "text-2xl font-bold mb-4";
  footerLogo.innerHTML = "Tag Der Deutschen Sprache '25";
  
  const footerLinks = document.createElement("div");
  footerLinks.className = "flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm text-white/70";
  
  ["Home", "Events", "Schedule", "Gallery", "Contact", "Privacy Policy", "Terms"].forEach(link => {
    const a = document.createElement("a");
    a.href = link.toLowerCase() === "home" ? "#" : `#${link.toLowerCase().replace(" ", "-")}`;
    a.className = "hover:text-yellow-300 transition-colors";
    a.textContent = link;
    footerLinks.appendChild(a);
  });
  
  const copyright = document.createElement("div");
  copyright.className = "text-white/60 text-sm";
  copyright.textContent = `© 2025 Royal College German Unit`;
  
  footerContent.append(footerLogo, footerLinks, copyright);
  footer.appendChild(footerContent);
  
  // Helper function to create sections
  function createSection(id, title, subtitle) {
    const section = document.createElement("section");
    section.id = id;
    section.className = "py-20 px-4";
    
    const sectionInner = document.createElement("div");
    sectionInner.className = "max-w-7xl mx-auto";
    
    const sectionHeader = document.createElement("div");
    sectionHeader.className = "text-center mb-10";
    
    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "text-3xl md:text-4xl font-bold mb-4";
    sectionTitle.textContent = title;
    
    const sectionSubtitle = document.createElement("p");
    sectionSubtitle.className = "text-white/70 max-w-3xl mx-auto";
    sectionSubtitle.textContent = subtitle;
    
    const sectionContent = document.createElement("div");
    sectionContent.className = "section-content";
    
    sectionHeader.append(sectionTitle, sectionSubtitle);
    sectionInner.append(sectionHeader, sectionContent);
    section.appendChild(sectionInner);
    
    return section;
  }
  
  // Append all sections to content
  content.append(heroSection, eventsSection, scheduleSection, gallerySection, registerSection);
  
  // Assemble the page
  container.append(navbar, content, footer);
  
  return container;
}
