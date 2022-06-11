window.addEventListener("DOMContentLoaded", async () => {
  const lists = document.querySelector("#lists");
  const addTask = document.querySelector("#addTask");

  window.api.send("list:read");
  window.api.receive("async:list:read", (data) => {
    for (let i = 0; i < data.length; i++) {
      const newList = document.createElement("div");
      const newListTitle = document.createElement("div");
      const newListContent = document.createElement("div");

      newList.classList.add(
        "bg-slate-200",
        "rounded-lg",
        "flex",
        "flex-col",
        "w-full",
        "self-start",
        "min-h-[100px]"
      );
      newListTitle.classList.add(
        "uppercase",
        "bg-slate-300",
        "py-1",
        "px-3",
        "rounded-t-lg"
      );
      newListContent.classList.add(
        "px-4",
        "py-2",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "grow"
      );

      newListContent.id = `list-${data[i].id}`;
      newListTitle.innerText = `${data[i].title} (${data[i].count})`;
      newListContent.innerHTML = "<div class='no-tasks'>No Tasks</div>";

      newList.append(newListTitle, newListContent);
      lists.append(newList);
    }
    window.api.send("task:read");
  });

  addTask.addEventListener("click", () => {
    window.api.send("window:addTask:open");
  });

  window.api.receive("async:task:read", (data) => {
    for (let i = 0; i < data.length; i++) {
      const newCard = document.createElement("div");

      newCard.classList.add("bg-white", "p-4", "w-full", "my-1");

      newCard.innerText = `${data[i].title}`;

      const list = document.getElementById(`list-${data[i].idList}`);

      Array.from(list.children).map((child) => {
        if (child.classList.contains("no-tasks")) {
          child.remove();
        }
      });

      list.append(newCard);
    }
  });
});
