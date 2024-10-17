const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const validator = require("validator");
const applescript = require("applescript");

// Setup DOMPurify instance with JSDOM
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Sanitize HTML content
function sanitizeHTML(input) {
  return purify.sanitize(input);
}

// Function to validate email format
function isValidEmail(email) {
  return validator.isEmail(email);
}

function isValidName(name) {
  return /^[a-zA-Z\s]*$/.test(name);
}

function containsHTMLTags(input) {
  const htmlTagRegex = /<[^>]+>/; // Regex to detect HTML tags
  return htmlTagRegex.test(input); // Returns true if HTML tags are found
}

// Function to spawn child process for sending email
function sendEmail(name, email, text) {
  // Sanitize inputs
  const safeName = isValidName(name) ? name : "";
  const safeEmail = isValidEmail(email) ? email : "";

  if (containsHTMLTags(text)) {
    console.log(`HTML tags are not allowed in text: ${text}.`);
    return;
  }

  const formattedText = text.replace(/\n/g, "<br>"); // Replace newlines with breaks.
  const safeText = sanitizeHTML(formattedText).replace(/"/g, '\\"'); // Sanitize any HTML in the body

  // Spawn a child process for sending the email
  const script = `
  set {ccName01, ccAddress01} to {"Example CC", "exampleCC@example.com"} -- 'Cc:' recipient.
  
  set the_Subject to "Example Subject"

  set the_Content to ("<div>" & "Hello ${safeName}" & "</div>" & "<br>" & "Thank you for opting in for an email to ${safeEmail}" & "</br>" & "<br>" & "</br>" & "<br>" & "Here is some text:" & "</br>" & "<br>" & "${safeText}" & "</br>" & "<br>" & "</br>" & "<br>" & "</br>" & "<div>" & "Best," & "</div>")

  tell application "Microsoft Outlook"
      set ComplaintMessage to make new outgoing message with properties {subject:the_Subject, content:the_Content}
      make new cc recipient at ComplaintMessage with properties {email address:{name:ccName01, address:ccAddress01}}
      open ComplaintMessage
  end tell
`;

  applescript.execString(script, (err, result) => {
    if (err) {
      console.error(`Error executing AppleScript: ${err}`);
      return;
    }
    console.log(`AppleScript result: ${result}`);
  });
}

module.exports = sendEmail;
