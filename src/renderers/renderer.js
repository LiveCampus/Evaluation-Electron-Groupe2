window.addEventListener('DOMContentLoaded', async () => {
    const lists = document.querySelector("#lists");

    window.item.send('list:read', 'List');
    window.item.receive('async:list:read', data => {
        console.log(data)

        for (let i = 0; i < data.length; i++) {
            const newList = document.createElement("div");
            newList.classList.add('bg-slate-200','py-1','px-3','rounded-sm','flex-auto','uppercase');
            newList.innerText = `${data[i].title} (${data[i].count})`;

            lists.append(newList);
        }
    });
})
