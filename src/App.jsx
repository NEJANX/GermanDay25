export function App() {
  // Create main container
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

  // Add professional-styled navbar
  const navbar = document.createElement("nav");
  navbar.className = "sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-6 py-4";
  
  const navContent = document.createElement("div");
  navContent.className = "flex justify-between items-center max-w-7xl mx-auto";
  
  const logo = document.createElement("div");
  logo.className = "text-xl font-bold flex items-center";
  
  // Add German flag colors to the logo
  logo.innerHTML = `
    <span class="mr-2 flex">
      <span class="h-5 w-2 bg-black rounded-l"></span>
      <span class="h-5 w-2 bg-red-700"></span>
      <span class="h-5 w-2 bg-yellow-500 rounded-r"></span>
    </span>
    <span class="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200">Zeit für Deutschland '25</span>
  `;
  
  const navLinks = document.createElement("div");
  navLinks.className = "hidden md:flex space-x-8";
  
  ["Home", "Competitions", "Schedule", "Gallery"].forEach(link => {
    const a = document.createElement("a");
    a.href = link.toLowerCase() === "home" ? "#" : `#${link.toLowerCase()}`;
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
  
  // Create main content container
  const content = document.createElement("div");
  content.className = "flex-1 z-10";
  
  // Hero section with professional design
  const heroSection = document.createElement("section");
  heroSection.id = "home";
  heroSection.className = "relative min-h-[90vh] flex items-center justify-center px-4 py-20";
  
  // Add hero background elements
  const heroBackground = document.createElement("div");
  heroBackground.className = "absolute inset-0 z-0";
  // heroBackground.innerHTML = `
  //   <div class="absolute right-0 bottom-0 w-1/3 h-1/3 bg-gradient-to-tl from-yellow-500/10 to-transparent"></div>
  //   <div class="absolute left-0 top-0 w-1/4 h-1/2 bg-gradient-to-br from-red-900/10 to-transparent"></div>
  // `;
  heroBackground.innerHTML = `
    <div class="absolute left-0 top-0 w-1/4 h-1/2 bg-gradient-to-br from-red-900/10 to-transparent"></div>
    `;
  heroSection.appendChild(heroBackground);
  
  // Hero card with professional design
  const heroCard = document.createElement("div");
  heroCard.className = "relative backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-xl p-8 md:p-12 w-full max-w-5xl shadow-2xl text-center transform transition-all duration-700";
  heroCard.style.animation = "fadeIn 1s ease-out";
  
  const heroContent = document.createElement("div");
  heroContent.className = "relative z-10";
  
  const brandingContainer = document.createElement("div");
  brandingContainer.className = "mx-auto mb-8 flex justify-center items-center";
  
  const logo1 = document.createElement("img");
  logo1.src = "/rc.svg";
  logo1.alt = "German Day Logo";
  logo1.className = "h-20 w-auto";
  
  // Add German flag colors bar
  const flagBar = document.createElement("div");
  flagBar.className = "h-1 w-40 mx-auto mb-6 rounded flex";
  flagBar.innerHTML = `
    <div class="flex-1 bg-black rounded-l"></div>
    <div class="flex-1 bg-red-700"></div>
    <div class="flex-1 bg-yellow-500 rounded-r"></div>
  `;
  
  brandingContainer.appendChild(logo1);
  
  const heroTitle = document.createElement("h1");
  heroTitle.className = "text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200";
  heroTitle.textContent = "Zeit für Deutschland '25";
  
  const heroSubtitle = document.createElement("p");
  heroSubtitle.className = "text-xl font-light text-slate-300 mb-2";
  heroSubtitle.textContent = "Royal College German Language Day";
  
  const heroDate = document.createElement("p");
  heroDate.className = "text-yellow-300 text-xl md:text-2xl mb-6";
  heroDate.textContent = "July 02, 2025";
  
  const heroDescription = document.createElement("p");
  heroDescription.className = "text-slate-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed";
  heroDescription.textContent = "Experience the vibrant spirit of German culture with exciting competitions, delightful company, and unforgettable performances. Join us for the most anticipated German cultural celebration of the year!";
  
  // Add countdown timer for professional touch
  const countdownContainer = document.createElement("div");
  countdownContainer.className = "flex justify-center space-x-4 md:space-x-6 mb-10";
  
  const eventDate = new Date(2025, 6, 2, 14, 0, 0); // July 2, 2025 at 2:00 PM
  
  // Function to calculate time remaining
  function updateCountdown() {
    const today = new Date();
    const timeDiff = Math.max(0, eventDate - today);
    
    if (timeDiff <= 0) {
      // Event has started
      if (!countdownContainer.querySelector('.happening-now')) {
        countdownContainer.innerHTML = '';
        const nowShowingBlock = document.createElement("div");
        nowShowingBlock.className = "px-4 py-2 md:px-6 md:py-3 bg-yellow-600/20 backdrop-blur-sm rounded-lg border border-yellow-500/30 happening-now";
        nowShowingBlock.innerHTML = `
          <span class="block text-xl md:text-2xl font-bold text-yellow-300">Happening Now!</span>
        `;
        countdownContainer.appendChild(nowShowingBlock);
      }
      return;
    }
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Clear previous countdown
    countdownContainer.innerHTML = '';
    
    // Add each time unit in a separate block
    const timeUnits = [
      { value: days, label: 'days' },
      { value: hours, label: 'hours' },
      { value: minutes, label: 'mins' },
      { value: seconds, label: 'secs' }
    ];
    
    timeUnits.forEach(unit => {
      const countdownBlock = document.createElement("div");
      countdownBlock.className = "px-4 py-2 md:px-6 md:py-3 bg-slate-700/50 backdrop-blur-sm rounded-lg border border-slate-600";
      countdownBlock.innerHTML = `
        <span class="block text-2xl md:text-3xl font-bold text-white">${unit.value.toString().padStart(2, '0')}</span>
        <span class="text-xs text-slate-400">${unit.label}</span>
      `;
      countdownContainer.appendChild(countdownBlock);
    });
  }
  
  // Initial update
  updateCountdown();
  
  // Set interval to update every second
  const countdownInterval = setInterval(updateCountdown, 1000);
  
  // Store the interval ID in a property to clear it if needed
  countdownContainer.countdownIntervalId = countdownInterval;
  
  const heroBtnContainer = document.createElement("div");
  heroBtnContainer.className = "flex flex-col sm:flex-row justify-center gap-4 sm:gap-6";
  
  const registerBtn = document.createElement("a");
  registerBtn.href = "#competitions";
  registerBtn.className = "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-md shadow-lg transform hover:translate-y-[-2px] transition-all duration-300";
  registerBtn.textContent = "Register Now";
  
  const scheduleBtn = document.createElement("a");
  scheduleBtn.href = "#schedule";
  scheduleBtn.className = "bg-slate-700/50 hover:bg-slate-600/50 text-white px-8 py-3 rounded-md backdrop-blur-sm shadow-lg border border-slate-600/50 transform hover:translate-y-[-2px] transition-all duration-300";
  scheduleBtn.textContent = "View Schedule";
  
  heroBtnContainer.append(registerBtn, scheduleBtn);
  
  heroContent.append(brandingContainer, flagBar, heroTitle, heroSubtitle, heroDate, heroDescription, countdownContainer, heroBtnContainer);
  heroCard.appendChild(heroContent);
  heroSection.appendChild(heroCard);
  
  // Competitions section with updated design
  const competitionsSection = createSection("competitions", "German Day Competitions", "Showcase your German language skills through these exciting competitions");
  
  const competitionsGrid = document.createElement("div");
  competitionsGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12";
  
  // Wrapper for better grid control
  const gridContent = document.createElement("div");
  gridContent.className = "contents lg:flex lg:flex-wrap lg:justify-center lg:gap-8";
  
  const competitions = [
    {
      title: "Singing Competition",
      icon: "<span class='material-icons'>mic</span>",
      description: "Perform iconic and contemporary German songs with flawless pronunciation, rich emotion, and captivating stage presence.",
      categories: "Inter School, Intra School",
      prizes: "1st: €500, 2nd: €300, 3rd: €150",
      id: "singing"
    },
    {
      title: "Art Competition",
      icon: "<span class='material-icons'>image</span>",
      description: "Create original artwork inspired by German culture, language, or landmarks. Let your creativity speak in colors, shapes, and imagination!",
      categories: "Inter School, Intra School",
      prizes: "1st: €400, 2nd: €250, 3rd: €100",
      id: "art"
    },
    {
      title: "Poetry Recitation",
      icon: "<span class='material-icons'>description</span>",
      description: "Recite German poetry with flawless pronunciation, clear intonation, and expressive emotional delivery that brings each verse to life.",
      categories: "Inter School, Intra School",
      prizes: "1st: €800, 2nd: €500, 3rd: €250",
      id: "poetry"
    },
    {
      title: "Tounge Twister Challenge",
      icon: "<span class='material-icons'>psychology</span>",
      description: "Test your German pronunciation skills with challenging tongue twisters. Show off your fluency and clarity in this fun competition!",
      categories: "Inter School",
      prizes: "1st: €600, 2nd: €350, 3rd: €200",
      id: "ttc"
    },
    {
      title: "Speech Competition",
      icon: "<span class='material-icons'>article</span>",
      description: "Deliver a compelling speech on a topic related to German culture, history, or language. Showcase your eloquence and persuasive skills!",
      categories: "Inter School, Intra School",
      prizes: "1st: €700, 2nd: €400, 3rd: €200",
      id: "speech"
    }
  ];
  
  competitions.forEach(competition => {
    const competitionCard = document.createElement("div");
    competitionCard.className = "backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-lg p-6 transition-all duration-300 hover:transform hover:translate-y-[-5px]";
    
    const cardHeader = document.createElement("div");
    cardHeader.className = "flex items-center justify-between mb-4";
    
    const competitionIcon = document.createElement("div");
    competitionIcon.className = "text-3xl";
    competitionIcon.innerHTML = competition.icon;
    
    // Add German flag mini-element
    const flagMini = document.createElement("div");
    flagMini.className = "h-1 w-12 flex rounded-full overflow-hidden";
    flagMini.innerHTML = `
      <div class="flex-1 bg-black"></div>
      <div class="flex-1 bg-red-700"></div>
      <div class="flex-1 bg-yellow-500"></div>
    `;
    
    cardHeader.append(competitionIcon, flagMini);
    
    const competitionTitle = document.createElement("h3");
    competitionTitle.className = "text-xl font-bold text-white mb-3";
    competitionTitle.textContent = competition.title;
    
    const competitionDescription = document.createElement("p");
    competitionDescription.className = "text-slate-300 mb-3 text-sm";
    competitionDescription.textContent = competition.description;
    
    const competitionCategories = document.createElement("div");
    competitionCategories.className = "text-sm text-yellow-300 mb-2";
    competitionCategories.innerHTML = `<span class="font-semibold">Categories:</span> ${competition.categories}`;
    
    // const competitionPrizes = document.createElement("div");
    // competitionPrizes.className = "text-sm text-green-300 mb-4";
    // competitionPrizes.innerHTML = `<span class="font-semibold">Prizes:</span> ${competition.prizes}`;
    
    const learnMoreLink = document.createElement("a");
    learnMoreLink.href = `/competitions/${competition.id}`;
    learnMoreLink.className = "inline-block mt-2 w-full px-4 py-2 bg-slate-700/70 hover:bg-slate-600/70 transition-colors rounded text-center text-sm font-medium";
    learnMoreLink.textContent = "View Details";
    
    competitionCard.append(cardHeader, competitionTitle, competitionDescription, competitionCategories, learnMoreLink);
    competitionsGrid.appendChild(competitionCard);
  });
  
  competitionsSection.querySelector(".section-content").appendChild(competitionsGrid);
  
  // Schedule section
  const scheduleSection = createSection("schedule", "Event Schedule", "Plan your German Day experience with our comprehensive schedule");
  
  const schedule = document.createElement("div");
  schedule.className = "mt-12 space-y-6";
  
  const days = ["Wednesday, July 02"];
  
  days.forEach((day, index) => {
    const dayCard = document.createElement("div");
    dayCard.className = "backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-lg overflow-hidden";
    
    const dayHeader = document.createElement("div");
    dayHeader.className = "bg-slate-700/50 px-6 py-4 font-bold text-lg flex items-center justify-between";
    
    const dayTitle = document.createElement("span");
    dayTitle.textContent = day;
    
    // Add German flag mini-element to day headers
    const flagMini = document.createElement("div");
    flagMini.className = "h-1 w-16 flex rounded-full overflow-hidden";
    flagMini.innerHTML = `
      <div class="flex-1 bg-black"></div>
      <div class="flex-1 bg-red-700"></div>
      <div class="flex-1 bg-yellow-500"></div>
    `;
    
    dayHeader.append(dayTitle, flagMini);
    
    const eventsList = document.createElement("div");
    eventsList.className = "divide-y divide-slate-700/50";
    
    // Different events for each day
    let eventTimes;
    if (index === 0) {
      eventTimes = [{ time: "01:10 PM", event: "Arrival of Guest Schools", location: "Royal College Boake Gate" },
        { time: "01:30 PM", event: "Lunch", location: "Royal College Main Hall" },
        { time: "02:30 PM", event: "Arrival of the Chief Guest", location: "Royal College Boake Gate" },
        { time: "02:35 PM", event: "Lighting of the Oil Lamp", location: "Royal College Main Hall" },
        { time: "02:40 PM", event: "School song by Royal College Western Band", location: "Royal College Main Hall" },
        { time: "02:45 PM", event: "Welcome Speech", location: "Royal College Main Hall" },
        { time: "02:50 PM", event: "Dance Act", location: "Royal College Main Hall" },
        { time: "02:55 PM", event: "Principal's speech", location: "Royal College Main Hall" },
        { time: "03:05 PM", event: "Song by the Grade 6 students", location: "Royal College Main Hall" },
        { time: "03:10 PM", event: "Special Surprise Performance", location: "Royal College Main Hall" },
        { time: "03:20 PM", event: "Germany - an informative outlook into carrer and education", location: "Royal College Main Hall" },
        { time: "03:40 PM", event: "Q&A session with the experts", location: "Royal College Main Hall" },
        { time: "03:50 PM", event: "Song by the Grade 8 and 9 students", location: "Royal College Main Hall" },
        { time: "03:55 PM", event: "Invited Schools' performances", location: "Royal College Main Hall" },
        { time: "04:05 PM", event: "German Drama", location: "Royal College Main Hall" },
        { time: "04:15 PM", event: "Chief Guest's Speech", location: "Royal College Main Hall" },
        { time: "04:25 PM", event: "Awarding Ceremony", location: "Royal College Main Hall" },
        { time: "04:45 PM", event: "Vote of Thanks", location: "Royal College Main Hall" },
        { time: "04:50 PM", event: "National Anthem", location: "Royal College Main Hall" },
        { time: "04:55 PM", event: "Refreshments", location: "Royal College Main Hall" }
      ];
    } else if (index === 1) {
      eventTimes = [
        { time: "09:30 AM", event: "Spelling Bee Competition", location: "Main Hall" },
        { time: "11:00 AM", event: "German Business Forum", location: "Conference Center" },
        { time: "02:00 PM", event: "Cultural Knowledge Quiz", location: "Amphitheater" },
        { time: "04:30 PM", event: "German Wine Tasting", location: "Garden Terrace" },
        { time: "07:00 PM", event: "Classical Music Concert", location: "Concert Hall" }
      ];
    } else {
      eventTimes = [
        { time: "10:00 AM", event: "Language Debate Finals", location: "Main Auditorium" },
        { time: "12:30 PM", event: "German Food Festival", location: "Festival Grounds" },
        { time: "03:00 PM", event: "Award Ceremony", location: "Grand Hall" },
        { time: "05:00 PM", event: "Networking Reception", location: "Banquet Hall" },
        { time: "07:30 PM", event: "Closing Celebration", location: "Main Stage" }
      ];
    }
    
    // Show only first 5 events initially
    const visibleEvents = eventTimes.slice(0, 5);
    const hiddenEvents = eventTimes.slice(5);
    
    // Create visible events
    visibleEvents.forEach(item => {
      const eventItem = document.createElement("div");
      eventItem.className = "px-6 py-4 flex flex-col sm:flex-row sm:items-center hover:bg-slate-700/20 transition-colors";
      
      const eventTime = document.createElement("div");
      eventTime.className = "font-mono text-yellow-300 sm:w-1/4";
      eventTime.textContent = item.time;
      
      const eventInfo = document.createElement("div");
      eventInfo.className = "sm:w-2/4";
      
      const eventName = document.createElement("div");
      eventName.className = "font-medium";
      eventName.textContent = item.event;
      
      const eventLocation = document.createElement("div");
      eventLocation.className = "sm:w-1/4 text-slate-400 text-sm text-right sm:block flex mt-1 sm:mt-0";
      eventLocation.textContent = item.location;
      
      eventInfo.appendChild(eventName);
      eventItem.append(eventTime, eventInfo, eventLocation);
      eventsList.appendChild(eventItem);
    });
    
    // Create hidden events container
    if (hiddenEvents.length > 0) {
      const hiddenEventsContainer = document.createElement("div");
      hiddenEventsContainer.className = "hidden";
      hiddenEventsContainer.id = `hidden-events-${index}`;
      
      hiddenEvents.forEach(item => {
        const eventItem = document.createElement("div");
        eventItem.className = "px-6 py-4 flex flex-col sm:flex-row sm:items-center hover:bg-slate-700/20 transition-colors border-t border-slate-700/50";
        
        const eventTime = document.createElement("div");
        eventTime.className = "font-mono text-yellow-300 sm:w-1/4";
        eventTime.textContent = item.time;
        
        const eventInfo = document.createElement("div");
        eventInfo.className = "sm:w-2/4";
        
        const eventName = document.createElement("div");
        eventName.className = "font-medium";
        eventName.textContent = item.event;
        
        const eventLocation = document.createElement("div");
        eventLocation.className = "sm:w-1/4 text-slate-400 text-sm text-right sm:block flex mt-1 sm:mt-0";
        eventLocation.textContent = item.location;
        
        eventInfo.appendChild(eventName);
        eventItem.append(eventTime, eventInfo, eventLocation);
        hiddenEventsContainer.appendChild(eventItem);
      });
      
      eventsList.appendChild(hiddenEventsContainer);
      
      // Create expand button
      const expandButton = document.createElement("div");
      expandButton.className = "px-6 py-4 border-t border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/30 transition-colors";
      
      const expandBtn = document.createElement("button");
      expandBtn.className = "w-full flex items-center justify-center text-yellow-300 hover:text-yellow-200 font-medium transition-colors";
      expandBtn.innerHTML = `
        <svg class="w-5 h-5 mr-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
        <span>Show more</span>
      `;
      
      // Add click handler to expand/collapse
      expandBtn.addEventListener('click', () => {
        const hiddenContainer = document.getElementById(`hidden-events-${index}`);
        const svg = expandBtn.querySelector('svg');
        const span = expandBtn.querySelector('span');
        
        if (hiddenContainer.classList.contains('hidden')) {
          hiddenContainer.classList.remove('hidden');
          svg.style.transform = 'rotate(180deg)';
          span.textContent = 'Show less';
        } else {
          hiddenContainer.classList.add('hidden');
          svg.style.transform = 'rotate(0deg)';
          span.textContent = `Show ${hiddenEvents.length} more events`;
        }
      });
      
      expandButton.appendChild(expandBtn);
      eventsList.appendChild(expandButton);
    }
    
    dayCard.append(dayHeader, eventsList);
    schedule.appendChild(dayCard);
  });
  
  scheduleSection.querySelector(".section-content").appendChild(schedule);
  
  // Gallery section
  const gallerySection = createSection("gallery", "Event Gallery", "Highlights from previous German Day celebrations");
  
  const gallery = document.createElement("div");
  gallery.className = "mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]";
  
  // Professional gallery with diverse German cultural imagery and varied sizes
  const galleryImages = [
    { 
      src: "/gallery/IMG_9323.jpg", 
      title: "Tag Der Deutschen Sprache '23", 
      year: "2023", 
      size: "tall",
      alt: ""
    },
    { 
      src: "/gallery/IMG_9399.jpg", 
      title: "Tag Der Deutschen Sprache '23", 
      year: "2023", 
      size: "medium",
      alt: ""
    },
    { 
      src: "/gallery/IMG_9310.jpg", 
      title: "Tag Der Deutschen Sprache '23", 
      year: "2023", 
      size: "wide",
      alt: ""
    },
    { 
      src: "/gallery/IMG_9435.jpg", 
      title: "Tag Der Deutschen Sprache '23", 
      year: "2023", 
      size: "wide",
      alt: ""
    },
    { 
      src: "/gallery/IMG_9317.jpg", 
      title: "Tag Der Deutschen Sprache '23", 
      year: "2023", 
      size: "medium",
      alt: ""
    }
  ];
  
  galleryImages.forEach((item, index) => {
    const imgContainer = document.createElement("div");
    
    // Apply different sizes based on the size property
    let sizeClass = "";
    switch(item.size) {
      case "large":
        sizeClass = "md:col-span-2 md:row-span-2";
        break;
      case "wide":
        sizeClass = "md:col-span-2";
        break;
      case "tall":
        sizeClass = "row-span-2";
        break;
      case "medium":
        sizeClass = "md:col-span-1";
        break;
      default:
        sizeClass = "";
    }
    
    imgContainer.className = `${sizeClass} overflow-hidden rounded-lg backdrop-blur-sm bg-slate-800/40 border border-slate-700 hover:border-slate-600 hover:scale-105 transition-all duration-300 group cursor-pointer relative`;
    
    // Create actual image element
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.className = "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300";
    img.loading = "lazy";
    
    // Create overlay with image info
    const overlay = document.createElement("div");
    overlay.className = "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4";
    
    const overlayContent = document.createElement("div");
    overlayContent.className = "text-white";
    
    const title = document.createElement("h3");
    title.className = "text-lg font-bold mb-1";
    title.textContent = item.title;
    
    const year = document.createElement("p");
    year.className = "text-sm text-slate-300";
    year.textContent = item.year;
    
    // Add German flag mini-element to overlay
    const flagMini = document.createElement("div");
    flagMini.className = "h-1 w-12 flex rounded-full overflow-hidden mt-2";
    flagMini.innerHTML = `
      <div class="flex-1 bg-black"></div>
      <div class="flex-1 bg-red-700"></div>
      <div class="flex-1 bg-yellow-500"></div>
    `;
    
    overlayContent.append(title, year, flagMini);
    overlay.appendChild(overlayContent);
    
    // Add loading placeholder
    const loadingPlaceholder = document.createElement("div");
    loadingPlaceholder.className = "absolute inset-0 bg-slate-800/60 flex items-center justify-center";
    loadingPlaceholder.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
    `;
    
    // Hide placeholder when image loads
    img.addEventListener('load', () => {
      loadingPlaceholder.style.display = 'none';
    });
    
    // Handle image load errors
    img.addEventListener('error', () => {
      loadingPlaceholder.innerHTML = `
        <div class="text-center p-4">
          <div class="text-4xl mb-2">🖼️</div>
          <div class="text-sm text-white font-medium">${item.title}</div>
          <div class="text-xs text-slate-400 mt-1">${item.year}</div>
        </div>
      `;
      loadingPlaceholder.className = "absolute inset-0 bg-slate-800/60 flex items-center justify-center text-slate-300";
    });
    
    imgContainer.append(loadingPlaceholder, img, overlay);
    gallery.appendChild(imgContainer);
  });
  
  gallerySection.querySelector(".section-content").appendChild(gallery);
  
  // Registration section
  // const registerSection = createSection("register", "Registration", "Join us for the German Day 2025 celebrations");
  
  // const registerContent = document.createElement("div");
  // registerContent.className = "mt-12 max-w-3xl mx-auto";
  
  // const registerCard = document.createElement("div");
  // registerCard.className = "backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-lg p-8";
  
  // const registerHeader = document.createElement("div");
  // registerHeader.className = "flex items-center justify-between mb-6";
  
  // const registerTitle = document.createElement("h3");
  // registerTitle.className = "text-2xl font-bold";
  // registerTitle.textContent = "Register for German Day '25";
  
  // // Add German flag mini-element
  // const flagElement = document.createElement("div");
  // flagElement.className = "h-1 w-16 flex rounded-full overflow-hidden";
  // flagElement.innerHTML = `
  //   <div class="flex-1 bg-black"></div>
  //   <div class="flex-1 bg-red-700"></div>
  //   <div class="flex-1 bg-yellow-500"></div>
  // `;
  
  // registerHeader.append(registerTitle, flagElement);
  
  // const registerText = document.createElement("p");
  // registerText.className = "mb-6 text-slate-300";
  // registerText.textContent = "Enter your email to be notified when registration opens for all German Day competitions and events.";
  
  // const form = document.createElement("form");
  // form.className = "flex flex-col sm:flex-row gap-4";
  // form.addEventListener("submit", (e) => e.preventDefault());
  
  // const inputGroup = document.createElement("div");
  // inputGroup.className = "flex-1";
  
  // const emailLabel = document.createElement("label");
  // emailLabel.className = "block text-sm font-medium text-slate-400 mb-1";
  // emailLabel.htmlFor = "email";
  // emailLabel.textContent = "Email Address";
  
  // const emailInput = document.createElement("input");
  // emailInput.type = "email";
  // emailInput.id = "email";
  // emailInput.placeholder = "yourname@example.com";
  // emailInput.className = "w-full px-4 py-3 rounded-md bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500";
  
  // inputGroup.append(emailLabel, emailInput);
  
  // const submitBtn = document.createElement("button");
  // submitBtn.type = "submit";
  // submitBtn.className = "px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-medium rounded-md hover:shadow-lg transition-all duration-300 whitespace-nowrap self-end";
  // submitBtn.textContent = "Notify Me";
  
  // form.append(inputGroup, submitBtn);
  
  // // Add event types selection with professional design
  // const eventsInterest = document.createElement("div");
  // eventsInterest.className = "mt-8";
  
  // const eventsLabel = document.createElement("label");
  // eventsLabel.className = "block text-sm font-medium text-slate-400 mb-3";
  // eventsLabel.textContent = "I'm interested in:";
  
  // const eventOptions = document.createElement("div");
  // eventOptions.className = "flex flex-wrap gap-2";
  
  // ["Competitions", "Workshops", "Cultural Events", "All Events"].forEach(option => {
  //   const checkbox = document.createElement("div");
  //   checkbox.className = "flex items-center";
    
  //   const input = document.createElement("input");
  //   input.type = "checkbox";
  //   input.id = `option-${option.toLowerCase().replace(/\s+/g, '-')}`;
  //   input.className = "sr-only";
    
  //   const label = document.createElement("label");
  //   label.htmlFor = `option-${option.toLowerCase().replace(/\s+/g, '-')}`;
  //   label.className = "px-3 py-2 rounded-md text-sm bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50 cursor-pointer transition-colors";
  //   label.textContent = option;
    
  //   // Make the last option selected by default
  //   if (option === "All Events") {
  //     label.className += " bg-slate-600/80 border-slate-500";
  //   }
    
  //   checkbox.append(input, label);
  //   eventOptions.appendChild(checkbox);
  // });
  
  // eventsInterest.append(eventsLabel, eventOptions);
  
  // registerCard.append(registerHeader, registerText, form, eventsInterest);
  // registerContent.appendChild(registerCard);
  
  // registerSection.querySelector(".section-content").appendChild(registerContent);
  
  // Footer with professional design
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
    <span class="text-lg font-bold">Zeit für Deutschland '25</span>
  `;
  
  const aboutText = document.createElement("p");
  aboutText.className = "text-slate-400 text-sm mb-4";
  aboutText.textContent = "The annual celebration of German language and culture at Royal College, showcasing student achievements and promoting German heritage.";
  
  const socialLinks = document.createElement("div");
  socialLinks.className = "flex space-x-4";
  
  ["facebook", "twitter", "instagram"].forEach(platform => {
    const socialLink = document.createElement("a");
    socialLink.href = `#${platform}`;
    socialLink.className = "text-slate-400 hover:text-yellow-300 transition-colors";
    // socialLink.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    //   <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" clip-rule="evenodd" />
    // </svg>`;
    socialLinks.appendChild(socialLink);
  });
  
  aboutColumn.append(footerLogo, aboutText, socialLinks);
  
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
    a.href = link.toLowerCase().replace(/\s+/g, '-') === "privacy-policy" || link.toLowerCase().replace(/\s+/g, '-') === "contact-us" ? `/pages/${link.toLowerCase().replace(/\s+/g, '-')}` : `#${link.toLowerCase().replace(/\s+/g, '-')}`;
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
    { icon: "email", text: "royalcollegegermanunit@gmail.com" },
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
  
  const footerLinks = document.createElement("div");
  footerLinks.className = "flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0";
  
  // ["Terms", "Privacy", "Cookies"].forEach(link => {
  //   const a = document.createElement("a");
  //   a.href = `/${link.toLowerCase()}`;
  //   a.className = "text-xs text-slate-400 hover:text-yellow-300 transition-colors";
  //   a.textContent = link;
  //   footerLinks.appendChild(a);
  // });
  
  footerBottom.append(copyright, footerLinks);
  
  footerContent.append(footerGrid, footerBottom);
  footer.appendChild(footerContent);
  
  // Helper function to create sections with professional design
  function createSection(id, title, subtitle) {
    const section = document.createElement("section");
    section.id = id;
    section.className = "py-20 px-6";
    
    const sectionInner = document.createElement("div");
    sectionInner.className = "max-w-7xl mx-auto";
    
    const sectionHeader = document.createElement("div");
    sectionHeader.className = "text-center mb-6";
    
    // Add German flag color bar for visual identity
    const colorBar = document.createElement("div");
    colorBar.className = "h-1 w-24 mx-auto mb-6 flex rounded-full overflow-hidden";
    colorBar.innerHTML = `
      <div class="flex-1 bg-black"></div>
      <div class="flex-1 bg-red-700"></div>
      <div class="flex-1 bg-yellow-500"></div>
    `;
    
    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "text-3xl md:text-4xl font-bold mb-4";
    sectionTitle.textContent = title;
    
    const sectionSubtitle = document.createElement("p");
    sectionSubtitle.className = "text-slate-400 max-w-3xl mx-auto text-lg";
    sectionSubtitle.textContent = subtitle;
    
    const sectionContent = document.createElement("div");
    sectionContent.className = "section-content";
    
    sectionHeader.append(colorBar, sectionTitle, sectionSubtitle);
    sectionInner.append(sectionHeader, sectionContent);
    section.appendChild(sectionInner);
    
    return section;
  }
  
  // Add styles for animations
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    @keyframes float {
      0% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-20px) rotate(5deg); }
      100% { transform: translateY(0) rotate(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleElement);
  
  // Append all sections to content
  content.append(heroSection, competitionsSection, scheduleSection, gallerySection);
  
  // Assemble the page
  container.append(navbar, content, footer);
  
  return container;
}
