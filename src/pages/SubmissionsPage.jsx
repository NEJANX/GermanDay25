import React, { useState, useEffect, useCallback } from 'react';

export default function SubmissionsPage() {

  return (

    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl font-bold flex items-center">
            <span className="mr-2 flex">
              <span className="h-5 w-2 bg-black rounded-l"></span>
              <span className="h-5 w-2 bg-red-700"></span>
              <span className="h-5 w-2 bg-yellow-400 rounded-r"></span>
            </span>
            Zeit für Deutsch '25
          </div>
          <a href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            <span className='mr-2 material-icons'>arrow_back</span> Back to Home
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            Submit your performance
          </h1>
          <p className="text-xl text-slate-300">
            Submit your piece of art to showcase your talents!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-12">
            { [
                {
                  title: "Singing Competition",
                  icon: <span className="material-icons">mic</span>,
                  id: "singing"
                },
                {
                  title: "Art Competition",
                  icon: <span className="material-icons">image</span>,
                  id: "art"
                },
                {
                  title: "Poetry Recitation",
                  icon: <span className="material-icons">description</span>,
                  id: "poetry"
                },
                {
                  title: "Tounge Twister Challenge",
                  icon: <span className="material-icons">psychology</span>,
                  id: "ttc"
                },
                {
                  title: "Speech Competition",
                  icon: <span className="material-icons">article</span>,
                  id: "speech"
                }
              ].map(competition => (
                <div key={competition.id} className="backdrop-blur-sm bg-slate-800/40 border border-slate-700 rounded-lg p-4 transition-all duration-300 hover:transform hover:translate-y-[-5px]">
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
                  <p className="text-slate-300 mb-3 text-sm"><br /></p>
                  <a href={`/submissions/${competition.id}`} className="absolute inset-x-0 bottom-0 inline-block mt-2 w-full px-4 py-2 bg-slate-700/70 hover:bg-slate-600/70 transition-colors rounded-lg text-center text-sm font-medium">Upload</a>
                </div>
              )) }
          </div>
      </div>
    </div>
  );
}