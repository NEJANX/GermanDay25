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
        <label className="block text-sm text-gray-400 mb-1">{label}</label> // Adjusted label color
      )}
      
      <div 
        className={`cursor-pointer rounded-lg px-4 py-3 flex items-center justify-between
                   bg-black/30 border border-gray-700/70 text-gray-200 // Adjusted background, border, text
                   ${isOpen ? 'ring-2 ring-gray-500/60 border-transparent' : ''} // Adjusted ring
                   transition-all duration-150 ease-in-out`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValue ? 'text-gray-200' : 'text-gray-500'}>
          {getSelectedLabel()}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 // Adjusted icon color
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
                          bg-black/80 border border-gray-700/50 shadow-2xl // Adjusted background and border
                          transition-opacity duration-150 ease-in-out animate-fadeIn
                          scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent`}>
            {options.map((option, index) => (
              <div
                key={option.value}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-700/50 transition-colors duration-150 // Adjusted hover
                          ${selectedValue === option.value ? 'bg-gray-600/70 text-gray-100' : 'text-gray-300'} // Adjusted selected and text
                          ${index !== options.length - 1 ? 'border-b border-gray-700/30' : ''}`} // Adjusted border
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