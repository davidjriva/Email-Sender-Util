const { execFile } = require("child_process");

function sendEmailWithOutlook(name, email, text) {
  const appleScript = `
    set {ccName01, ccAddress01} to {"Example CC", "exampleCC@example.com"} -- 'Cc:' recipient.
    
    set the_Subject to "Example Subject"

    set the_Content to ("<div>" & "Hello ${name}" & "</div>" & "<br>" & "Thank you for opting in for an email to ${email}" & "</br>" & "<br>" & "</br>" & "<br>" & "Here is some text:" & "</br>" & "<br>" & "${text}" & "</br>" & "<br>" & "</br>" & "<br>" & "</br>" & "<div>" & "Best," & "</div>")

    tell application "Microsoft Outlook"
        
    set ComplaintMessage to make new outgoing message with properties {subject:the_Subject, content:the_Content}
    
    make new cc recipient at ComplaintMessage with properties {email address:{name:ccName01, address:ccAddress01}}

    open ComplaintMessage

    end tell
  `;

  execFile("osascript", ["-e", appleScript], (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing AppleScript: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`AppleScript error: ${stderr}`);
      return;
    }
    console.log(`AppleScript output: ${stdout}`);
  });
}

// Get arguments from the command line
const [, , name, email, text] = process.argv;

// Send the email
sendEmailWithOutlook(name, email, text);
