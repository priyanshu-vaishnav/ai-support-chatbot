const faqData = [
  {
    keywords: ["refund", "money back", "return money"],
    answer: "Refund is processed within 5-7 business days after approval."
  },
  {
    keywords: ["track", "order status", "where is my order"],
    answer: "You can track your order using the Order ID on the Track Order page."
  },
  {
    keywords: ["password", "login", "forgot password", "reset password"],
    answer: "Click on 'Forgot Password' on the login page to reset your password via email."
  },
  {
    keywords: ["delivery time", "how long", "shipping"],
    answer: "Standard delivery takes 3-5 business days depending on your location."
  },
  {
    keywords: ["cancel order", "cancellation"],
    answer: "You can cancel your order within 24 hours of placing it from the Orders page."
  }
];

const smallTalkData = [
  { keywords: ["hi", "hello", "hey", "hola", "sup"], answer: "Hello! How can I assist you today?" },
  { keywords: ["thank you", "thanks", "ty"], answer: "You're very welcome!" },
  { keywords: ["bye", "goodbye"], answer: "Goodbye! Have a great day." }
];

const abuseKeywords = ["stupid", "idiot", "bad service", "fraud", "scam", "nonsense", "gali", "fuck"];

function searchKnowledgeBase(userMessage) {
  
  if (!userMessage || !userMessage.trim()) {
    return "Please type a valid question so I can help you.";
  }

  const lower = userMessage.toLowerCase().trim();

  
  const hasValidChars = /[a-zA-Z0-9]/.test(lower);
  if (!hasValidChars) {
    return "It looks like you typed only symbols. Please ask a proper question like 'Where is my order?'";
  }

  const isSmallTalk = smallTalkData.some(item => item.keywords.includes(lower));
  if (lower.length < 3 && !isSmallTalk) {
    return "Your message is too short. Please type a complete question.";
  }

  const isAbusive = abuseKeywords.some(keyword => lower.includes(keyword));
  if (isAbusive) {
    return "Please use polite words. Tell me how I can help you with your account or order.";
  }

 
  const smallTalkMatch = smallTalkData.find(item =>
    item.keywords.some(keyword => lower === keyword || lower.startsWith(keyword + " "))
  );
  if (smallTalkMatch) {
    return smallTalkMatch.answer;
  }

  const faqMatch = faqData.find(item =>
    item.keywords.some(keyword => lower.includes(keyword))
  );
  if (faqMatch) {
    return faqMatch.answer;
  }

  return "I'm sorry, I couldn't find a direct answer for that. You can try asking about 'refund', 'track order', or 'shipping'.";
}

module.exports = { searchKnowledgeBase };
