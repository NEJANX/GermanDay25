/**
 * Custom Alert component for displaying popup notifications
 */

export default class Alert {
  constructor() {
    this.alertsContainer = null;
    this.createAlertsContainer();
  }

  /**
   * Create the container for all alerts if it doesn't exist
   */
  createAlertsContainer() {
    if (!this.alertsContainer) {
      this.alertsContainer = document.createElement('div');
      this.alertsContainer.className = 'fixed top-0 right-0 p-4 z-50 flex flex-col items-end gap-4';
      document.body.appendChild(this.alertsContainer);
    }
  }

  /**
   * Show an alert with the specified message and type
   * 
   * @param {string} message - The message to display in the alert
   * @param {string} type - The type of alert: 'success', 'error', 'warning', or 'info'
   * @param {number} duration - How long to show the alert in milliseconds (default: 5000ms)
   */
  show(message, type = 'info', duration = 5000) {
    this.createAlertsContainer();
    
    // Create the alert element
    const alertElement = document.createElement('div');
    
    // Set the appropriate color scheme based on type
    let colorClasses;
    let icon;
    
    switch (type) {
      case 'success':
        colorClasses = 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`;
        break;
      case 'error':
        colorClasses = 'bg-gradient-to-r from-red-500 to-rose-600 text-white';
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>`;
        break;
      case 'warning':
        colorClasses = 'bg-gradient-to-r from-amber-400 to-orange-500 text-black';
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>`;
        break;
      default: // info
        colorClasses = 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
    }

    // Style the alert
    alertElement.className = `flex items-center p-4 rounded-lg shadow-lg ${colorClasses} transform transition-all duration-300 ease-in-out opacity-0 translate-x-8 min-w-[300px] backdrop-blur-sm border border-white/20`;
    
    // Set innerHTML for the alert content
    alertElement.innerHTML = `
      <div class="flex-shrink-0 mr-3">
        ${icon}
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button class="ml-4 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
    
    // Add the alert to the container
    this.alertsContainer.appendChild(alertElement);
    
    // Add event listener to close button
    const closeButton = alertElement.querySelector('button');
    closeButton.addEventListener('click', () => this.hideAlert(alertElement));
    
    // Animate entry
    setTimeout(() => {
      alertElement.classList.remove('opacity-0', 'translate-x-8');
    }, 10);
    
    // Auto-dismiss after duration
    if (duration) {
      setTimeout(() => {
        this.hideAlert(alertElement);
      }, duration);
    }
    
    return alertElement;
  }
  
  /**
   * Hide an alert with a fade-out animation
   * 
   * @param {HTMLElement} alertElement - The alert element to hide
   */
  hideAlert(alertElement) {
    // Animate exit
    alertElement.classList.add('opacity-0', 'translate-x-8');
    
    // Remove after animation
    setTimeout(() => {
      if (alertElement.parentNode === this.alertsContainer) {
        this.alertsContainer.removeChild(alertElement);
      }
    }, 300); // Duration should match the CSS transition
  }
  
  /**
   * Convenience method for success alerts
   */
  success(message, duration) {
    return this.show(message, 'success', duration);
  }
  
  /**
   * Convenience method for error alerts
   */
  error(message, duration) {
    return this.show(message, 'error', duration);
  }
  
  /**
   * Convenience method for warning alerts
   */
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }
  
  /**
   * Convenience method for info alerts
   */
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}