// WhatsApp group links
const whatsappGroups = {
  singing: "https://chat.whatsapp.com/singing-group-link",
  "spelling-bee": "https://chat.whatsapp.com/spelling-bee-group-link",
  "cultural-quiz": "https://chat.whatsapp.com/cultural-quiz-group-link",
  "cuisine-contest": "https://chat.whatsapp.com/cuisine-contest-group-link",
  "language-debate": "https://chat.whatsapp.com/language-debate-group-link",
  "film-media": "https://chat.whatsapp.com/film-media-group-link",
  general: "https://chat.whatsapp.com/general-group-link"
};

// Get competition ID from URL path
const path = window.location.pathname;
const competition = path.split('/whatsapp/')[1];

// Update redirect message with competition name if available
const redirectMessage = document.getElementById('redirect-message');
if (competition && competition !== '') {
  const competitionName = competition.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  redirectMessage.textContent = `You are being redirected to the ${competitionName} WhatsApp group...`;
}

// Redirect after 3 seconds
setTimeout(() => {
  const groupUrl = competition && whatsappGroups[competition] 
    ? whatsappGroups[competition] 
    : whatsappGroups.general;
    
  window.location.href = groupUrl;
}, 3000);
