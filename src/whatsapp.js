// WhatsApp group links
const whatsappGroups = {
  singing: "https://chat.whatsapp.com/GWczDBkAbHW34HCylZBlmj",
  art: "https://chat.whatsapp.com/D8UR7qW3Jpd4S8RQYSIfKr",
  poetry: "https://chat.whatsapp.com/FZitmFAt5M73dq5IXaEvto",
  ttc: "https://chat.whatsapp.com/E3foCrwU1cIJ2t3aX2gcUj",
  speech: "https://chat.whatsapp.com/CuP5EJvhFYgKYFcNTmMybD",
  general: "https://chat.whatsapp.com/I8MsaEkK84k2O4StyXWixS"
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
  redirectMessage.textContent = `You are being redirected to the WhatsApp group...`;
}

// Redirect after 3 seconds
setTimeout(() => {
  const groupUrl = competition && whatsappGroups[competition] 
    ? whatsappGroups[competition] 
    : whatsappGroups.general;
    
  window.location.href = groupUrl;
}, 3000);
