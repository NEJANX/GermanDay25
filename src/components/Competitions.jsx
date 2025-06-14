import React from 'react';
export default function Competitions() {
  return (
    <section id="competitions" className="py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="h-1 w-24 mx-auto mb-6 flex rounded-full overflow-hidden">
          <div className="flex-1 bg-black"></div>
          <div className="flex-1 bg-red-700"></div>
          <div className="flex-1 bg-yellow-500"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">German Day Competitions</h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg">Showcase your German language skills through exciting competitions</p>
      </div>
    </section>
  );
}
