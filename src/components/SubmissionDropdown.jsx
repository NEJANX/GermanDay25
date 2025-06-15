import React, { useState, useRef, useEffect } from 'react';

export default function SubmissionDropdown({ 
  name,
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  required = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [hasInteracted, setHasInteracted] = useState(false);
  const dropdownRef = useRef(null);
  
  // Set initial selected value
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    setIsOpen(false);
    setHasInteracted(true);
    if (onChange) {
      const event = { target: { value: option.value, name } };
      onChange(event);
    }
  };

  // Find the label for the currently selected value
  const getSelectedLabel = () => {
    if (!options || !Array.isArray(options)) {
      return placeholder;
    }
    const selected = options.find(option => option.value === selectedValue);
    return selected ? selected.label : placeholder;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div 
        className={`cursor-pointer rounded-lg px-4 py-3 flex items-center justify-between
                   bg-slate-700/50 border border-slate-600 text-white
                   ${isOpen ? 'ring-2 ring-yellow-400 border-transparent' : ''} 
                   transition-all duration-150 ease-in-out
                   hover:border-slate-500`}
        onClick={() => {
          setIsOpen(!isOpen);
          setHasInteracted(true);
        }}
      >
        <span className={selectedValue ? 'text-white' : 'text-slate-400'}>
          {getSelectedLabel()}
        </span>
        <span className="material-icons text-slate-400">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>
      
      {isOpen && options && Array.isArray(options) && (
        <div className="absolute w-full mt-1 z-50 top-full left-0 overflow-hidden">
          <div className="max-h-60 overflow-auto rounded-lg backdrop-blur-xl
                          bg-slate-800/95 border border-slate-600 shadow-2xl
                          transition-all duration-200 ease-in-out animate-slideDown">
            {options.map((option, index) => (
              <div
                key={option.value}
                className={`px-4 py-3 cursor-pointer hover:bg-slate-700/70 transition-colors duration-150
                          ${selectedValue === option.value ? 'bg-yellow-400/20 text-yellow-300' : 'text-slate-200'}
                          ${index !== options.length - 1 ? 'border-b border-slate-700/30' : ''}
                          flex items-center justify-between`}
                onClick={() => handleSelect(option)}
              >
                <span>{option.label}</span>
                {selectedValue === option.value && (
                  <span className="material-icons text-yellow-400 text-sm">check</span>
                )}
              </div>
            ))}
            <style jsx="true">{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-slideDown {
                animation: slideDown 0.2s ease-out;
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
