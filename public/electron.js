const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // ⚠️ Enable if you need Node.js features in React
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // ✅ Development: Loads from React dev server
      : `file://${path.join(__dirname, "../build/index.html")}` // ✅ Production: Loads built React app
  );

  mainWindow.on("closed", () => (mainWindow = null));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) app.whenReady();
});
