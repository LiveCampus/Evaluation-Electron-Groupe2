window.addEventListener("DOMContentLoaded", async () => {
  const lists = document.querySelector("#lists");
  const addTask = document.querySelector("#addTask");

  window.api.send("list:read");
  window.api.receive("async:list:read", (data) => {
    for (let i = 0; i < data.length; i++) {
      const newList = document.createElement("div");
      const newListTitle = document.createElement("h1");
      const newListContent = document.createElement("div");

      newList.classList.add(
        ..."list transition-all bg-slate-200 rounded-lg flex flex-col w-full self-start min-h-[100px]".split(
          " "
        )
      );
      newListTitle.classList.add(
        ..."uppercase bg-slate-300 py-1 px-3 rounded-t-lg".split(" ")
      );
      newListContent.classList.add(
        ..."draggingContainer px-4 py-2 flex flex-col items-center justify-center grow".split(
          " "
        )
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
    let sortedData = data.sort((a, b) => (a.rank > b.rank ? 1 : -1));
    for (let i = 0; i < sortedData.length; i++) {
      const newCard = document.createElement("div");
      const newBtn = document.createElement("button");
      let newDetail = document.createElement("img");

      newCard.classList.add(
        ..."card bg-white transition-all p-4 w-full my-1 flex justify-between items-center".split(
          " "
        )
      );
      newBtn.classList.add("me-2", "pt-1");
      newDetail.src = "../assets/images/Details.png";
      newDetail.classList.add("h-4");
      newCard.setAttribute("id", `${sortedData[i].id}`);
      newCard.setAttribute("rank", `${sortedData[i].rank}`);
      newCard.setAttribute("draggable", "true");
      newDetail.setAttribute("id", `${sortedData[i].id}`);
      newCard.innerHTML = `<div>${sortedData[i].title}</div>`;

      const list = document.getElementById(`list-${sortedData[i].idList}`);

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

    /**
     * ====================================
     * ===          DRAG cards          ===
     * ====================================
     */
    const moveCard = (taskId, listId, rank) => {
      window.api.send("task:move", {
        taskId,
        listId,
        rank,
      });
    };
    const registerEventsOnCard = (card) => {
      card.addEventListener("dragstart", () => {
        card.classList.add("dragging", "opacity-60");
      });

      card.addEventListener("dragend", () => {
        moveCard(
          card.getAttribute("id"),
          card.parentNode.getAttribute("id").split("-")[1],
          Array.from(card.parentNode.children).findIndex(
            (el) => el.getAttribute("id") === card.getAttribute("id")
          )
        );
        card.classList.remove("dragging", "opacity-60");
      });
    };

    const getCardAfterDraggingCard = (list, yDraggingCard) => {
      let listCards = [...list.querySelectorAll(".card:not(.dragging)")];

      return listCards.reduce(
        (closestCard, nextCard) => {
          let nextCardRect = nextCard.getBoundingClientRect();
          let offset =
            yDraggingCard - nextCardRect.top - nextCardRect.height / 2;

          if (offset < 0 && offset > closestCard.offset) {
            return { offset, element: nextCard };
          } else {
            return closestCard;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    };

    let cards = document.querySelectorAll(".card");
    let lists = document.querySelectorAll(".draggingContainer");

    cards.forEach((card) => {
      registerEventsOnCard(card);
    });

    lists.forEach((list) => {
      list.addEventListener("dragover", (e) => {
        e.preventDefault();

        let draggingCard = document.querySelector(".dragging");
        let cardAfterDraggingCard = getCardAfterDraggingCard(list, e.clientY);

        if (cardAfterDraggingCard) {
          cardAfterDraggingCard.parentNode.insertBefore(
            draggingCard,
            cardAfterDraggingCard
          );
        } else {
          list.appendChild(draggingCard);
        }
      });

      list.addEventListener("drop", (_) => {
        window.api.send("window:reload");
      });
    });
  });
});
