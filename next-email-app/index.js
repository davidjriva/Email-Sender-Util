const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

// Function to execute AppleScript for sending email via Outlook
function sendEmailWithOutlook(name, email, text) {
  // Escape double quotes in the text
  const escapedText = text.replace(/"/g, '\\"');

  const appleScript = `
    set {ccName01, ccAddress01} to {"Example CC", "exampleCC@example.com"} -- 'Cc:' recipient.
    
    set the_Subject to "Example Subject"

    set the_Content to ("<div>" & "Hello ${name}" & "</div>" & "<br>" & "Thank you for opting in for an email to ${email}" & "</br>" & "<br>" & "</br>" & "<br>" & "Here is some text:" & "</br>" & "<br>" & "${escapedText}" & "</br>" & "<br>" & "</br>" & "<br>" & "</br>" & "<div>" & "Best," & "</div>")

    tell application "Microsoft Outlook"
        
    set ComplaintMessage to make new outgoing message with properties {subject:the_Subject, content:the_Content}
    
    make new cc recipient at ComplaintMessage with properties {email address:{name:ccName01, address:ccAddress01}}

    open ComplaintMessage

    end tell
    `;

  exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
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
    width: 600,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Optional: Preload script
      nodeIntegration: true, // Enable Node integration in renderer
      contextIsolation: false, // Ensure context isolation is off for IPC
    },
  });

  // Load your Next.js app
  mainWindow.loadURL("file://" + path.join(__dirname, "/out/index.html")); // Adjust based on your app build output
}

// Listen for the IPC event from the renderer process
ipcMain.on("send-email", (event, { name, email, text }) => {
  sendEmailWithOutlook(name, email, text);
});

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
