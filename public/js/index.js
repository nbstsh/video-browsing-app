

const videoEl = document.getElementById('video')
const source = document.getElementById('source')
const thumnailSelector = 'img'
const thumnailEls = document.querySelectorAll(thumnailSelector)

const url = 'videos/sample.mov'

const changeVideo = (url) => {
    source.setAttribute('src', url)
    videoEl.load()
    videoEl.play()
}

if (thumnailEls) {
    thumnailEls.forEach((el) => {
        el.addEventListener('click', (e) => { changeVideo(e.target.dataset.url)})
    })
}

/////////////////////////////////////////////////// TEST

const log = () => {
    console.log('audioTracks', videoEl.audioTracks)
    console.log('videoTracks', videoEl.videoTracks)
    console.log('textTracks', videoEl.textTracks)
    console.log('seekable', videoEl.seekable)
}

log()

console.log(videoEl)

videoEl.addEventListener('addTracks', (e) => {
    console.log('load end')
    log()
})






