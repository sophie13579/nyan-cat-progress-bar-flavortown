const rainbowUrl = chrome.runtime.getURL("images/nyan_cat/rainbow.png");
const nyanCat = chrome.runtime.getURL("images/nyan_cat/nyan_cat.gif");

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

function setProgress(parent, percent) {
    const container = parent.querySelector(".container");
    if (!container) return;

    const rainbow = container.querySelector(".rainbow");
    const cat = container.querySelector(".cat");

    percent = Math.max(0, Math.min(percent, 100));
    rainbow.style.width = percent + "%";
    cat.style.left = percent + "%";
}

function findPercentKitchen() {
    let fractionNums = document.getElementsByClassName("tutorial-steps__progress-text")[0].textContent;
    let percentage = Number(fractionNums.charAt(0)) / Number(fractionNums.charAt(fractionNums.length - 1));
    return Math.round(percentage*100);
}

function findPercentAchievement() {
    const count = Number(
        document.getElementsByClassName("achievements__stats-count")[0]?.textContent
    );
    const total = Number(
        document.getElementsByClassName("achievements__stats-total")[0]?.textContent
    );

    if (!total) return 0;

    const percentage = Math.round((count / total) * 100);
    console.log(percentage);
    return percentage;
}

function createProgressBar(parent) {
        const container = document.createElement("div");
        container.classList.add("container");
        parent.appendChild(container);

        const rainbow = document.createElement("div");
        rainbow.classList.add("rainbow");
        container.appendChild(rainbow);

        const catElem = document.createElement("img");
        catElem.classList.add("cat");
        catElem.src = nyanCat;
        catElem.alt = "Nyan cat";
        container.appendChild(catElem);

        return container;
}

function findPercentSmallAchievement(parent) {
    const text = parent.getElementsByClassName("achievements__progress-text")[0].textContent.trim();
    const percentage = text.slice(0, -1);
    console.log(Number(percentage));
    return Number(percentage);
}

if (location.pathname === "/kitchen") {
    const observer = new MutationObserver(() => {
        if (!document.getElementById("nyan-style")) {
            const styleSheet = document.createElement("style");
            styleSheet.id = "nyan-style";
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        const progress = document.getElementsByClassName("tutorial-steps__progress")[0];
        if (!progress) return;
        if (progress.querySelector(".container")) return;

        createProgressBar(progress)
        setProgress(progress, findPercentKitchen());

        observer.disconnect();
    });

    observer.observe(document, { childList: true, subtree: true });
}

if (location.pathname === "/my/achievements") {
    const observer = new MutationObserver(() => {
        if (!document.getElementById("nyan-style")) {
            const styleSheet = document.createElement("style");
            styleSheet.id = "nyan-style";
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        const achievementsProgress = document.getElementsByClassName("achievements__stats")[0];

        if (!achievementsProgress) return;

        if (!achievementsProgress.querySelector(".container")) {
            createProgressBar(achievementsProgress);
            setProgress(achievementsProgress, findPercentAchievement());
        }

        // const smallProgress = document.querySelectorAll(".achievements__progress .achievements__progress-bar");

        const parents = Array.from(
            document.querySelectorAll(".achievements__progress")
        ).filter(parent =>
            parent.querySelector(".achievements__progress-bar")
        );

        parents.forEach(parent => {
            const newProgress = createProgressBar(parent);
            newProgress.style.height = "12px";
            const sister = parent.getElementsByClassName("achievements__progress-text")[0];
            sister.before(newProgress);
            setProgress(parent, findPercentSmallAchievement(parent));
        });


        observer.disconnect();
    });

    observer.observe(document, { childList: true, subtree: true });
}