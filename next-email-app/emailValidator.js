const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const validator = require("validator");

// Setup DOMPurify instance with JSDOM
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Sanitize HTML content
exports.sanitizeHTML = (input) => {
  return purify.sanitize(input);
};

// Function to validate email format
exports.isValidEmail = (email) => {
  return validator.isEmail(email);
};

exports.isValidName = (name) => {
  return /^[a-zA-Z\s]*$/.test(name);
};

exports.containsHTMLTags = (input) => {
  const htmlTagRegex = /<[^>]+>/; // Regex to detect HTML tags
  return htmlTagRegex.test(input); // Returns true if HTML tags are found
};
