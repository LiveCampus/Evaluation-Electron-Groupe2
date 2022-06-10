const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const Database = require("./model/Database");
const List = require("./model/List");

const db = new Database("kanban.db");
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

app.on("ready", () => {
  let window = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) window = createWindow();
  });

  ipcMain.on("list:read", async () => {
    let data = await lists.getAll();

    window.webContents.send("async:list:read", data);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
