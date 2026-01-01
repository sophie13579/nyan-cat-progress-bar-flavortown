const rainbowUrl = chrome.runtime.getURL("images/nyan_cat/rainbow.png");
const nyanCat = chrome.runtime.getURL("images/nyan_cat/nyan_cat.gif");

function setProgress(percent) {
    const container = document.querySelector(".container");
    const rainbow = container.querySelector(".rainbow");
    const cat = container.querySelector(".cat");

    // clamp percent 0–100
    percent = Math.max(0, Math.min(percent, 100));

    // set rainbow width
    rainbow.style.width = percent + "%";

    // move cat to end of rainbow
    cat.style.left = percent + "%";
}

function findPercent() {
    let fractionNums = document.getElementsByClassName("tutorial-steps__progress-text")[0].textContent;
    let percentage = Number(fractionNums.charAt(0)) / Number(fractionNums.charAt(fractionNums.length - 1));
    return Math.round(percentage*100);
}

if (location.pathname === "/kitchen") {
    const observer = new MutationObserver(() => {
        const progress = document.getElementsByClassName("tutorial-steps__progress")[0];
        if (!progress) return;
        if (progress.querySelector(".container")) return;

        const styles = `
.container {
    position: relative;
    height: 15px;
    width: 100%;
    border: 1.5px solid #a8987d;
    border-radius: 50px;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.rainbow {
    height: 100%;
    width: 0%;
    background: url("${rainbowUrl}") repeat-x;
    background-size: auto 100%;
    transition: width 0.3s ease;
    border-radius: 50px;
    animation: scroll 5s linear infinite;
}

.cat {
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translate(-50%, -50%);
    height: 20px;
    pointer-events: none;
    transition: left 0.3s ease;
}

@keyframes scroll {
    from { background-position: 0 0; }
    to   { background-position: -300px 0; }
}
        `;

        if (!document.getElementById("nyan-style")) {
            const styleSheet = document.createElement("style");
            styleSheet.id = "nyan-style";
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        const container = document.createElement("div");
        container.classList.add("container");
        progress.appendChild(container);

        const rainbow = document.createElement("div");
        rainbow.classList.add("rainbow");
        container.appendChild(rainbow);

        const catElem = document.createElement("img");
        catElem.classList.add("cat");
        catElem.src = nyanCat;
        catElem.alt = "Nyan cat";
        container.appendChild(catElem);

        let percentNums = document.getElementsByClassName("tutorial-steps__progress-text")[0]
        setProgress(findPercent());

        observer.disconnect();
    });

    observer.observe(document, { childList: true, subtree: true });
}