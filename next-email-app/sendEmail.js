const applescript = require("applescript");
const path = require("path");
const {
  isValidName,
  isValidEmail,
  containsHTMLTags,
  sanitizeHTML,
} = require(path.join(__dirname, "emailValidator.js"));

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
  });
}

module.exports = sendEmail;
