const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { createAddTaskWindow } = require("./addTask");

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

app.on("ready", () => {
  let window = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) window = createWindow();
  });

  ipcMain.on("window:addTask:open", () => {
    createAddTaskWindow(window);
  });

  ipcMain.on("list:read", async () => {
    let data = await lists.getAll();

    window.webContents.send("async:list:read", data);
  });

  ipcMain.on("task:read", async () => {
    let data = await tasks.getAll();

    window.webContents.send("async:task:read", data);
  });

  ipcMain.on("task:add", async (_, data) => {
    let res = await tasks.add(data);

    window.reload();
    window.webContents.send("async:task:add", res);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
