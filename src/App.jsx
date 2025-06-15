import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import FrostedBallsBackground from "./components/FrostedBallsBackground";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Competitions", href: "#competitions" },
  { name: "Schedule", href: "#schedule" },
  { name: "Gallery", href: "#gallery" }
];

function useSectionInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Countdown() {
  const eventDate = new Date(2025, 6, 2, 14, 0, 0); // July 2, 2025 at 2:00 PM
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, happening: false });

  useEffect(() => {
    function updateCountdown() {
      const today = new Date();
      const timeDiff = Math.max(0, eventDate - today);
      if (timeDiff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, happening: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
        happening: false
      });
    }
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft.happening) {
    return (
      <div className="px-4 py-2 md:px-6 md:py-3 bg-yellow-600/20 backdrop-blur-sm rounded-lg border border-yellow-500/30 happening-now">
        <span className="block text-xl md:text-2xl font-bold text-yellow-300">Happening Now!</span>
      </div>
    );
  }
  return (
    <div className="flex justify-center space-x-4 md:space-x-6 mb-10">
      { [
        { value: timeLeft.days, label: "days" },
        { value: timeLeft.hours, label: "hours" },
        { value: timeLeft.minutes, label: "mins" },
        { value: timeLeft.seconds, label: "secs" }
      ].map((unit) => (
        <div key={unit.label} className="px-4 py-2 md:px-6 md:py-3 bg-slate-700/50 backdrop-blur-sm rounded-lg border border-slate-600">
          <span className="block text-2xl md:text-3xl font-bold text-white">{unit.value.toString().padStart(2, "0")}</span>
          <span className="text-xs text-slate-400">{unit.label}</span>
        </div>
      )) }
    </div>
  );
}

function Section({ id, isHero, title, subtitle, children }) {
  const [ref, inView] = useSectionInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`py-20 px-6${inView ? " in-view" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6" style={{ display: isHero ? "none" : "block", margin: isHero ? "0 auto 0 auto" : "" }}>
            <div className="h-1 w-24 mx-auto mb-6 flex rounded-full overflow-hidden">
            <div className="flex-1 bg-black"></div>
            <div className="flex-1 bg-red-700"></div>
            <div className="flex-1 bg-yellow-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg">{subtitle}</p>
        </div>
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}

function Navbar({ menuOpen, onMenuToggle }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-bold flex items-center">
          <span className="mr-2 flex">
            <span className="h-5 w-2 bg-black rounded-l"></span>
            <span className="h-5 w-2 bg-red-700"></span>
            <span className="h-5 w-2 bg-yellow-500 rounded-r"></span>
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200">Zeit für Deutsch '25</span>
        </div>
        <div className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="font-medium text-slate-300 hover:text-yellow-200 transition-all duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={onMenuToggle}
        >
          {menuOpen ? (
            // Close icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon (3 lines)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}

function MobileMenu({ open, onClose }) {
  // Lock scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Close on outside click
  const overlayRef = useRef();
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/80 backdrop-blur-lg pt-32 md:hidden">
      <nav className="flex flex-col items-center gap-8 w-full max-w-xs mx-auto py-12">
        {navLinks.map(link => (
          <a
            key={link.name}
            href={link.href}
            className="text-white hover:text-yellow-300 transition-all duration-300 text-2xl font-semibold px-8 py-2 rounded-lg text-center"
            onClick={onClose}
          >
            {link.name}
          </a>
        ))}
        <button
          className="absolute top-8 right-8 text-white"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroRef, heroInView] = useSectionInView();
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white overflow-x-hidden">
      {/* Frosted glass balls background (DRY, not animated) */}
      <FrostedBallsBackground count={8} />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 opacity-5" style={{ background: "url('https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&q=80') center/cover no-repeat fixed" }}></div>
      </div>
      <Navbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen(v => !v)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 z-10 relative">
        {/* Hero Section */}
        <section
          id="home"
          ref={heroRef}
          isHero={true}
          className={`relative min-h-[100dvh] flex items-center justify-center pt-35 pb-20 px-4${heroInView ? " in-view" : ""}`}
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute left-0 top-0 w-1/4 h-1/2 bg-gradient-to-br from-red-900/10 to-transparent"></div>
          </div>
            <div
              id="hero-middle"
              className="relative backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-xl p-8 md:p-12 w-full max-w-5xl shadow-2xl text-center transform transition-all duration-700 sm:mt-0"
              style={{ animation: "fadeIn 1s ease-out" }}
            >
            <div className="relative z-10">
              <div className="mx-auto mb-8 flex justify-center items-center">
                <img src="/rc.svg" alt="German Day Logo" className="h-20 w-auto" />
              </div>
              <div className="h-1 w-40 mx-auto mb-6 rounded flex">
                <div className="flex-1 bg-black rounded-l"></div>
                <div className="flex-1 bg-red-700"></div>
                <div className="flex-1 bg-yellow-500 rounded-r"></div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200">Zeit für Deutsch '25</h1>
              <p className="text-xl font-light text-slate-300 mb-2">Royal College German Language Day</p>
              <p className="text-yellow-300 text-xl md:text-2xl mb-6">July 02, 2025</p>
              <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">Experience the vibrant spirit of German culture with exciting competitions, delightful company, and unforgettable performances. Join us for the most anticipated German cultural celebration of the year!</p>
              <Countdown />
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <a href="#competitions" className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-md shadow-lg transform hover:translate-y-[-2px] transition-all duration-300">Register Now</a>
                <a href="#schedule" className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-8 py-3 rounded-md backdrop-blur-sm shadow-lg border border-slate-600/50 transform hover:translate-y-[-2px] transition-all duration-300">View Schedule</a>
              </div>
            </div>
          </div>
        </section>
        {/* Competitions section with updated design */}
        <Section id="competitions" title="German Day Competitions" subtitle="Showcase your German language skills through these exciting competitions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            { [
                {
                  title: "Singing Competition",
                  icon: <span className="material-icons">mic</span>,
                  description: "Perform iconic and contemporary German songs with flawless pronunciation, rich emotion, and captivating stage presence.",
                  categories: "Inter School, Intra School",
                  prizes: "1st: €500, 2nd: €300, 3rd: €150",
                  id: "singing"
                },
                {
                  title: "Art Competition",
                  icon: <span className="material-icons">image</span>,
                  description: "Create original artwork inspired by German culture, language, or landmarks. Let your creativity speak in colors, shapes, and imagination!",
                  categories: "Inter School, Intra School",
                  prizes: "1st: €400, 2nd: €250, 3rd: €100",
                  id: "art"
                },
                {
                  title: "Poetry Recitation",
                  icon: <span className="material-icons">description</span>,
                  description: "Recite German poetry with flawless pronunciation, clear intonation, and expressive emotional delivery that brings each verse to life.",
                  categories: "Inter School, Intra School",
                  prizes: "1st: €800, 2nd: €500, 3rd: €250",
                  id: "poetry"
                },
                {
                  title: "Tounge Twister Challenge",
                  icon: <span className="material-icons">psychology</span>,
                  description: "Test your German pronunciation skills with challenging tongue twisters. Show off your fluency and clarity in this fun competition!",
                  categories: "Inter School",
                  prizes: "1st: €600, 2nd: €350, 3rd: €200",
                  id: "ttc"
                },
                {
                  title: "Speech Competition",
                  icon: <span className="material-icons">article</span>,
                  description: "Deliver a compelling speech on a topic related to German culture, history, or language. Showcase your eloquence and persuasive skills!",
                  categories: "Inter School, Intra School",
                  prizes: "1st: €700, 2nd: €400, 3rd: €200",
                  id: "speech"
                }
              ].map(competition => (
                <div key={competition.id} className="backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-lg p-6 transition-all duration-300 hover:transform hover:translate-y-[-5px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{competition.icon}</div>
                    {/* Add German flag mini-element */}
                    <div className="h-1 w-12 flex rounded-full overflow-hidden">
                      <div className="flex-1 bg-black"></div>
                      <div className="flex-1 bg-red-700"></div>
                      <div className="flex-1 bg-yellow-500"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{competition.title}</h3>
                  <p className="text-slate-300 mb-3 text-sm">{competition.description}</p>
                  <div className="text-sm text-yellow-300 mb-2"><span className="font-semibold">Categories:</span> {competition.categories}</div>
                  <a href={`/competitions/${competition.id}`} className="inline-block mt-2 w-full px-4 py-2 bg-slate-700/70 hover:bg-slate-600/70 transition-colors rounded text-center text-sm font-medium">View Details</a>
                </div>
              )) }
          </div>
        </Section>
        {/* Schedule section */}
        <Section id="schedule" title="Event Schedule" subtitle="Plan your German Day experience with our comprehensive schedule">
          <div className="mt-12 space-y-6">
            {["Wednesday, July 02"].map((day, index) => {
              const allEvents = [
                { time: "01:10 PM", event: "Arrival of Guest Schools", location: "Royal College Boake Gate" },
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

              const [showAll, setShowAll] = React.useState(false);
              const visibleEvents = showAll ? allEvents : allEvents.slice(0, 5);

              return (
                <div key={index} className="backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-slate-700/50 px-6 py-4 font-bold text-lg flex items-center justify-between">
                    <span>{day}</span>
                    <div className="h-1 w-16 flex rounded-full overflow-hidden">
                      <div className="flex-1 bg-black"></div>
                      <div className="flex-1 bg-red-700"></div>
                      <div className="flex-1 bg-yellow-500"></div>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-700/50">
                    {visibleEvents.map((item) => (
                      <div key={item.time} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center hover:bg-slate-700/20 transition-colors">
                        <div className="font-mono text-yellow-300 sm:w-1/4">{item.time}</div>
                        <div className="sm:w-2/4 flex-1">
                          <div className="font-medium">{item.event}</div>
                        </div>
                        <div className="sm:w-1/4 text-slate-400 text-sm text-right mt-1 sm:mt-0">{item.location}</div>
                      </div>
                    ))}

                    {allEvents.length > 5 && (
                      <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                        <button
                          className="w-full flex items-center justify-center text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
                          onClick={() => setShowAll(!showAll)}
                        >
                          <svg
                            className={`w-5 h-5 mr-2 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                          <span>{showAll ? "Show less" : `Show more`}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
        {/* Gallery section */}
        <Section id="gallery" title="Event Gallery" subtitle="Highlights from previous German Day celebrations">
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            { [
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
            ].map((item, index) => {
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
              
              return (
                <div key={index} className={`${sizeClass} overflow-hidden rounded-lg backdrop-blur-sm bg-slate-800/40 border border-slate-700 hover:border-slate-600 hover:scale-105 transition-all duration-300 group cursor-pointer relative`}>
                  <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="text-white">
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-300">{item.year}</p>
                      {/* Add German flag mini-element to overlay */}
                      <div className="h-1 w-12 flex rounded-full overflow-hidden mt-2">
                        <div className="flex-1 bg-black"></div>
                        <div className="flex-1 bg-red-700"></div>
                        <div className="flex-1 bg-yellow-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) }
          </div>
        </Section>
      </main>
      {/* Footer with professional design */}
      <footer className="backdrop-blur-md bg-slate-900/90 border-t border-slate-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About column */}
            <div>
              <div className="flex items-center mb-4">
                <span className="mr-2 flex">
                  <span className="h-4 w-1.5 bg-black rounded-l"></span>
                  <span className="h-4 w-1.5 bg-red-700"></span>
                  <span className="h-4 w-1.5 bg-yellow-500 rounded-r"></span>
                </span>
                <span className="text-lg font-bold">Zeit für Deutsch '25</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">The annual celebration of German language and culture at Royal College, showcasing student achievements and promoting German heritage.</p>
              <div className="flex space-x-4">
                { ["facebook", "twitter", "instagram"].map(platform => (
                  <a key={platform} href={`#${platform}`} className="text-slate-400 hover:text-yellow-300 transition-colors"></a>
                )) }
              </div>
            </div>
            {/* Quick links column */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                { ["Competitions", "Schedule", "Gallery"]. map(link => (
                  <li key={link}>
                    <a href={link.toLowerCase().replace(/\s+/g, '-') === "privacy-policy" || link.toLowerCase().replace(/\s+/g, '-') === "contact-us" ? `/pages/${link.toLowerCase().replace(/\s+/g, '-')}` : `#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-slate-400 hover:text-yellow-300 transition-colors">{link}</a>
                  </li>
                )) }
              </ul>
            </div>
            {/* Contact info column */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                { [
                  { icon: "email", text: "info@germanday.live" },
                  { icon: "phone", text: "+94 75 122 8301" }
                ].map(item => (
                  <li key={item.text} className="flex items-start">
                    <span className="mr-2 material-icons">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                )) }
              </ul>
            </div>
          </div>
          <div className="pt-6 mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Royal College German Unit. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}