const { app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const Database = require('./model/Database');
const List = require('./model/List');

const db = new Database('kanban.db');
const lists = new List(db);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preloads/preload.js"),
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile("src/views/index.html");

  return win;
};

let window;
app.on("ready", () => {
  window = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on('list:read', (e, data) => {
  lists.getListsWithTaskCount().then(
      data => {
        window.webContents.send('async:list:read', data)
      }
  )
})