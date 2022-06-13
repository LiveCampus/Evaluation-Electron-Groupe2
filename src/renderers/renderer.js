const drag = (e) => {
  e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
  e.dataTransfer.setData("text/plain", e.currentTarget.getAttribute("id"));
};

const dragStart = (e) => {
  e.currentTarget.classList.add("opacity-50");
  e.currentTarget.classList.add("scale-75");
};

const dragEnd = (e) => {
  e.currentTarget.classList.remove("opacity-50");
  e.currentTarget.classList.remove("scale-75");
};

const dragEnter = (e) => {
  e.currentTarget.classList.add("border-dashed");
  e.currentTarget.classList.add("border-black");
  e.currentTarget.classList.add("border-2");

  Array.from(e.currentTarget.children).map((child) => {
    if (child.classList.contains("column-kanban")) {
      Array.from(child.children).map((c) => {
        c.classList.add("pointer-events-none");
      });
    }
  });
};

const drop = (e) => {
  e.currentTarget.classList.remove("border-dashed");
  e.currentTarget.classList.remove("border-black");
  e.currentTarget.classList.remove("border-2");

  Array.from(e.currentTarget.children).map((child) => {
    Array.from(child.children).map((c) =>
      c.classList.remove("pointer-events-none")
    );

    if (child.classList.contains("column-kanban")) {
      const moveTo = child.id.split("-")[1];

      window.api.send("task:moveToColumn", {
        id: e.dataTransfer.getData("text/plain"),
        moveTo,
      });
    }
  });
};

const allowDrop = (e) => {
  e.preventDefault();
};

const dragLeave = (e) => {
  e.currentTarget.classList.remove("border-dashed");
  e.currentTarget.classList.remove("border-black");
  e.currentTarget.classList.remove("border-2");

  Array.from(e.currentTarget.children).map((child) => {
    Array.from(child.children).map((c) =>
      c.classList.remove("pointer-events-none")
    );
  });
};

window.addEventListener("DOMContentLoaded", async () => {
  const lists = document.querySelector("#lists");
  const addTask = document.querySelector("#addTask");

  window.api.send("list:read");
  window.api.receive("async:list:read", (data) => {
    for (let i = 0; i < data.length; i++) {
      const newList = document.createElement("div");
      const newListTitle = document.createElement("div");
      const newListContent = document.createElement("div");

      newList.setAttribute("ondrop", "drop(event)");
      newList.setAttribute("ondragover", "allowDrop(event)");
      newList.addEventListener("dragenter", dragEnter);
      newList.addEventListener("dragleave", dragLeave);

      newList.classList.add(
        "transition-all",
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
        "grow",
        "column-kanban"
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
      const newBtn = document.createElement("button");
      let newDetail = document.createElement("img");

      newCard.classList.add(
        "bg-white",
        "transition-all",
        "p-4",
        "cursor-grab",
        "active:cursor-grabbing",
        "w-full",
        "my-1",
        "flex",
        "justify-between",
        "items-center"
      );
      newBtn.classList.add("me-2", "pt-1");
      newDetail.src = "../assets/images/Details.png";
      newDetail.classList.add("h-4");
      newCard.setAttribute("id", `${data[i].id}`);
      newDetail.setAttribute("id", `${data[i].id}`);
      newCard.innerText = `${data[i].title}`;
      newCard.setAttribute("draggable", "true");
      newCard.setAttribute("ondragstart", "drag(event)");

      newCard.addEventListener("dragstart", dragStart);
      newCard.addEventListener("dragend", dragEnd);

      const list = document.getElementById(`list-${data[i].idList}`);

      Array.from(list.children).map((child) => {
        if (child.classList.contains("no-tasks")) {
          child.remove();
        }
      });

      newBtn.append(newDetail);
      newCard.append(newBtn);
      list.append(newCard);
    }

    Array.from(document.querySelectorAll("img")).map((img) => {
      img.addEventListener("click", () => {
        window.api.send("contextMenu:open", img.getAttribute("id"));
      });
    });
  });
});
