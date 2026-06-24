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

function searchKnowledgeBase(userMessage) {
  const lower = userMessage.toLowerCase();
  const match = faqData.find(item =>
    item.keywords.some(keyword => lower.includes(keyword))
  );
  return match ? match.answer : null;
}

module.exports = { searchKnowledgeBase };