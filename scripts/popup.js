let { enabled } = await chrome.storage.sync.get({ enabled: false });
let currentAuthorName = null;

chrome.runtime.sendMessage({ request: "popup-loaded" }, function (response) {
    currentAuthorName = response.currentAuthorName;
    document.getElementById("author-name").innerText = currentAuthorName ?? "";
});

const enableEl = document.getElementById("enable");
enableEl.checked = enabled;
enableEl.addEventListener("change", async (event) => {
    enabled = event.target.checked;
    await chrome.storage.sync.set({ enabled });
});

async function updateList() {
    const listEl = document.getElementById("list");
    listEl.innerHTML = "";
    const { allowed } = await chrome.storage.sync.get({ allowed: [] });
    allowed.forEach((authorName) => {
        const li = document.createElement("li");
        li.innerText = authorName;
        listEl.appendChild(li);
    });
}
await updateList();

document.getElementById("add").addEventListener("click", async () => {
    if (!currentAuthorName) return;
    const { allowed } = await chrome.storage.sync.get({ allowed: [] });
    if (!allowed.includes(currentAuthorName)) {
        allowed.push(currentAuthorName);
        await chrome.storage.sync.set({ allowed });
    }
    await updateList();
});

document.getElementById("remove").addEventListener("click", async () => {
    if (!currentAuthorName) return;
    const { allowed } = await chrome.storage.sync.get({ allowed: [] });
    if (allowed.includes(currentAuthorName)) {
        allowed.splice(allowed.indexOf(currentAuthorName), 1);
        await chrome.storage.sync.set({ allowed });
    }
    await updateList();
});
