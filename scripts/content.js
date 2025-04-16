// chrome.runtime.onMessage.addListener(({ url }) => {});

function run() {
    const authorEl = document.getElementById("text");
    const buttonEl = document.getElementsByClassName("ytp-play-button").item(0);
    // console.log("authorEl=", authorEl);
    console.log("buttonEl=", buttonEl);
    const authorName = authorEl?.innerText;
    console.log("authorName=", authorName);

    chrome.runtime.sendMessage(
        {
            request: "url-changed",
            authorName,
        },
        ({ allow }) => {
            console.log(allow ? "ALLOW" : "DENY", authorName);
            const playerEl = document.getElementById("movie_player");
            // console.log("playerEl=", playerEl);
            playerEl.style.visibility = allow ? "visible" : "hidden";
            if (!allow && buttonEl.getAttribute("title").startsWith("Pause")) {
                buttonEl.click();
            }
        }
    );
}

window.addEventListener(
    "yt-navigate-finish",
    () => {
        setTimeout(() => {
            run();
        }, 1000);
    },
    true
);

// const { allowed } = await chrome.storage.sync.get({ allowed: [] });

// const authorEl = [...document.getElementsByTagName("span")].find(
//     (el) => el.getAttribute("itemprop") == "author"
// );

// const authorName = [...authorEl.getElementsByTagName("link")]
//     .find((el) => el.getAttribute("itemprop") == "name")
//     ?.getAttribute("content");
