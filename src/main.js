const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  Menu,
  MenuItem,
  dialog,
} = require("electron");
const path = require("path");
const { createAddTaskWindow } = require("./addTask");
const { createShowTaskWindow } = require("./showTask");

const Database = require("./model/Database");
const List = require("./model/List");
const Task = require("./model/Task");
const { createUpdateTaskWindow } = require("./updateTask");

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

  ipcMain.on("window:addTask:close", (e) => {
    BrowserWindow.fromWebContents(e.sender).close();
  });

  ipcMain.on("window:updateTask:close", (e) => {
    BrowserWindow.fromWebContents(e.sender).close();
  });

  ipcMain.on("window:showTask:close", (e) => {
    BrowserWindow.fromWebContents(e.sender).close();
  });

  ipcMain.on("list:read", async () => {
    let data = await lists.getAll();

    window.webContents.send("async:list:read", data);
  });

  ipcMain.on("task:read", async () => {
    let data = await tasks.getAll();

    window.webContents.send("async:task:read", data);
  });

  ipcMain.on("task:move", async (_, data) => {
    await tasks.updateRank(data);

    window.reload();
  });

  ipcMain.on("contextMenu:open", (e, data) => {
    const newMenu = new Menu();
    newMenu.append(
      new MenuItem({
        label: "Update",
        click: () => createUpdateTaskWindow(window, data, tasks),
      })
    );

    newMenu.append(
      new MenuItem({
        label: "Delete",
        click: async () => {
          const { response } = await dialog.showMessageBox(
            BrowserWindow.fromWebContents(e.sender),
            {
              message: "Do you really want to delete this item ?",
              buttons: ["Confirm", "Abort"],
            }
          );

          if (response !== 1) {
            const notif = new Notification({
              title: "Tâche supprimée",
              body: "Cette tâche a été supprimée avec succès",
              icon: "src/assets/images/Deleted.png",
            });
            await tasks.deleteTask(data);

            window.reload();
            notif.show();
          }
        },
      })
    );

    newMenu.append(
      new MenuItem({
        label: "Show",
        click: () => createShowTaskWindow(window, data, tasks),
      })
    );

    newMenu.popup({
      window: BrowserWindow.fromWebContents(e.sender),
    });
  });

  ipcMain.on("task:add", async (e, data) => {
    const notif = new Notification({
      title: "Tâche ajouté",
      body: "Bravo vous avez ajouté une nouvelle tâche",
      icon: "src/assets/images/Add.png",
    });

    await tasks.add(data);

    window.reload();
    //window.webContents.send("task:add", res);

    BrowserWindow.fromWebContents(e.sender).close();
    notif.show();
  });

  ipcMain.on("task:updated", async (e, { id, data }) => {
    const notif = new Notification({
      title: "Tâche modifiée",
      body: "Bravo vous avez modifié la tâche avec succès",
      icon: "src/assets/images/Update.png",
    });

    await tasks.updateTask(id, data);

    window.reload();

    BrowserWindow.fromWebContents(e.sender).close();
    notif.show();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
