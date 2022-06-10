const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const Database = require("./model/Database");
const List = require("./model/List");
const Task = require("./model/Task");

const db = new Database("kanban.db");
const lists = new List(db);
const tasks = new Task(db);

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preloads/preload.js"),
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile("src/views/index.html");

  return mainWindow;
};

const createChildWindow = () => {
  const childWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    parent: mainWindow,
    webPreferences: {
      preload:path.join(app.getAppPath(), 'preloads/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
  })
  childWindow.loadFile('views/template.html')
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}

app.on("ready", () => {
  let window = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) window = createWindow();
  });

  ipcMain.on("openChildWindow", (event, arg) =>{
    createChildWindow();
  })

  ipcMain.on("list:read", async () => {
    let data = await lists.getAll();

    window.webContents.send("async:list:read", data);
  });

  ipcMain.on("task:read", async () => {
    let data = await tasks.getAll();

    window.webContents.send("async:task:read", data);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
