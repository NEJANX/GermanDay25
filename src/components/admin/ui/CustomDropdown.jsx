import React, { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  label = '',
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
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
    if (onChange) {
      const event = { target: { value: option.value } };
      onChange(event);
    }
  };

  // Find the label for the currently selected value
  const getSelectedLabel = () => {
    const selected = options.find(option => option.value === selectedValue);
    return selected ? selected.label : placeholder;
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm text-white/70 mb-1">{label}</label>
      )}
      
      <div 
        className={`cursor-pointer rounded-lg px-4 py-3 flex items-center justify-between
                   bg-white/20 border border-white/10 text-white
                   ${isOpen ? 'ring-2 ring-yellow-400/50 border-transparent' : ''}
                   transition-all duration-150 ease-in-out`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValue ? 'text-white' : 'text-white/50'}>
          {getSelectedLabel()}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 text-white/70 transition-transform duration-200 
                     ${isOpen ? 'transform rotate-180' : ''}`}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute w-full mt-1 z-50 top-full left-0 overflow-hidden">
          <div className={`max-h-60 overflow-auto rounded-lg backdrop-blur-xl
                          bg-gray-800/95 border border-white/20 shadow-2xl
                          transition-opacity duration-150 ease-in-out animate-fadeIn
                          scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent`}>
            {options.map((option, index) => (
              <div
                key={option.value}
                className={`px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors duration-150
                          ${selectedValue === option.value ? 'bg-yellow-500/20 text-yellow-300' : 'text-white'}
                          ${index !== options.length - 1 ? 'border-b border-white/5' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}