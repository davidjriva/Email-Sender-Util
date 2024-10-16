const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { execFile } = require("child_process");
const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const validator = require("validator");

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

// Function to execute AppleScript for sending email via Outlook
function sendEmailWithOutlook(name, email, text) {
  // Sanitize inputs
  const safeName = isValidName(name) ? name : "";
  const safeEmail = isValidEmail(email) ? email : "";

  if (containsHTMLTags(text)) {
    console.log(`HTML tags are not allowed in text: ${text}.`);
    return;
  }

  const formattedText = text.replace(/\n/g, "<br>"); // Replace newlines with breaks.
  const safeText = sanitizeHTML(formattedText).replace(/"/g, '\\"'); // Sanitize any HTML in the body and escape any double quotes in the text

  const appleScript = `
    set {ccName01, ccAddress01} to {"Example CC", "exampleCC@example.com"} -- 'Cc:' recipient.
    
    set the_Subject to "Example Subject"

    set the_Content to ("<div>" & "Hello ${safeName}" & "</div>" & "<br>" & "Thank you for opting in for an email to ${safeEmail}" & "</br>" & "<br>" & "</br>" & "<br>" & "Here is some text:" & "</br>" & "<br>" & "${safeText}" & "</br>" & "<br>" & "</br>" & "<br>" & "</br>" & "<div>" & "Best," & "</div>")

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

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Disables Node integration in renderer
      contextIsolation: true, // Isolates context for security
      enableRemoteModule: false, // Disables remote module
      webviewTag: false, // Block all web view tags
      preload: path.join(__dirname, "preload.js"), // Use a secure preloading script for IPC
    },
  });

  mainWindow.webContents.openDevTools();

  // Load your Next.js app
  mainWindow.loadURL("file://" + path.join(__dirname, "/out/index.html")); // Adjust based on your app build output
}

// Listen for the IPC event from the renderer process
ipcMain.on(
  "send-email",
  (event, { sanitizedName, sanitizedEmail, sanitizedText }) => {
    sendEmailWithOutlook(sanitizedName, sanitizedEmail, sanitizedText);
  }
);

// Disables network access entirely
app.commandLine.appendSwitch("disable-network-access");

// Enable sandbox for all processes
app.enableSandbox();

// Electron initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
