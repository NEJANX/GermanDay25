// WhatsApp group links
const whatsappGroups = {
  // singing: "https://chat.whatsapp.com/GWczDBkAbHW34HCylZBlmj",
  // art: "https://chat.whatsapp.com/D8UR7qW3Jpd4S8RQYSIfKr",
  // poetry: "https://chat.whatsapp.com/FZitmFAt5M73dq5IXaEvto",
  // ttc: "https://chat.whatsapp.com/E3foCrwU1cIJ2t3aX2gcUj",
  // speech: "https://chat.whatsapp.com/CuP5EJvhFYgKYFcNTmMybD",
  // general: "https://chat.whatsapp.com/I8MsaEkK84k2O4StyXWixS"
  general: "https://whatsapp.com/channel/0029VbAeB5AFHWq56blkur1e"
};

// Get competition ID from URL path
const path = window.location.pathname;
console.log('Current path:', path); // Debug log

// Handle both /whatsapp/competitionId and /whatsapp?competition=competitionId formats
let competition;
if (path.includes('/whatsapp/')) {
  competition = path.split('/whatsapp/')[1];
} else {
  // Fallback to URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  competition = urlParams.get('competition');
}

console.log('Extracted competition:', competition); // Debug log

// Update redirect message with competition name if available
const redirectMessage = document.getElementById('redirect-message');
if (competition && competition !== '') {
  const competitionName = competition.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  redirectMessage.textContent = `Joining ${competitionName} Competition WhatsApp group...`;
} else {
  redirectMessage.textContent = 'You are being redirected to the WhatsApp group...';
}

// Redirect after 3 seconds
setTimeout(() => {
  const groupUrl = competition && whatsappGroups[competition] 
    ? whatsappGroups[competition] 
    : whatsappGroups.general;
    
  console.log('Redirecting to:', groupUrl); // Debug log
  
  // Use window.open as fallback if direct redirect fails
  try {
    window.location.href = groupUrl;
  } catch (error) {
    console.error('Direct redirect failed, trying window.open:', error);
    window.open(groupUrl, '_self');
  }
}, 3000);
