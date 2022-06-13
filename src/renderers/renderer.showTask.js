window.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector('#title');
    const description = document.querySelector('#desc');
    const list = document.querySelector('#list');


    window.api.send("task:show");
    window.api.receive("async:task:show", (data) => {
        let listName = "";
        switch(data.idList){
            case 1:
                listName = "TODO"
                break;
            case 2:
                listName = "IN PROGRESS"
                break;
            case 3:
                listName = "REVIEW"
                break;
            
            case 4:
                listName = "DONE"
                break;
        }
      title.innerText = data.title;
      description.innerText = data.description;
      list.innerText = listName;
      });

      document.querySelector("#cancel").addEventListener("click", () => {
        window.api.send("window:showTask:close");
      });
    });

