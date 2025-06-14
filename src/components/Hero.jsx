import React from 'react';
export default function Hero() {
  return (
    <section id="home" className="min-h-[90vh] flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-200 mb-4">
          Zeit für Deutsch '25
        </h1>
        <p className="text-xl text-slate-300 mb-2">Royal College German Language Day</p>
        <p className="text-yellow-300 text-2xl mb-6">July 02, 2025</p>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8">
          Experience the vibrant spirit of German culture with exciting competitions, delightful company,
          and unforgettable performances.
        </p>
      </div>
    </section>
  );
}