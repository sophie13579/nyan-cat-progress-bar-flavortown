function kitchenProgressBar(progress) {
    const progressBar = progress.getElementsByClassName("tutorial-steps__progress-bar")[0]
    progressBar.remove()
}

if (window.location.href === "https://flavortown.hackclub.com/kitchen") {
    kitchenProgressBar(document.getElementsByClassName("tutorial-steps__progress")[0])
}