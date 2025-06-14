
import React, { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Competitions", href: "#competitions" },
    { name: "Schedule", href: "#schedule" },
    { name: "Gallery", href: "#gallery" }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl font-bold flex items-center">
            <span className="mr-2 flex">
              <span className="h-5 w-2 bg-black rounded-l"></span>
              <span className="h-5 w-2 bg-red-700"></span>
              <span className="h-5 w-2 bg-yellow-500 rounded-r"></span>
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200">
              Zeit für Deutsch '25
            </span>
          </div>

          <div className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="font-medium text-slate-300 hover:text-yellow-200 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-white p-2 relative z-50 transition-all duration-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {!mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-xl md:hidden">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-white hover:text-yellow-300 transition-all duration-300"
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 text-white"
            aria-label="Close mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
