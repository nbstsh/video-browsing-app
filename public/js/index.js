import moment from 'moment'
const VIDEO_ELEMENT_ID = 'video'
const VIDEO_BOX_ELEMENT_ID = 'video-box' 
const SOURCE_ELEMENT_ID = 'source'

// TODO : set width and height of video element

class VideoManager {
    constructore() {
        this.videoId = null
        this.type =  null
        this.videoEl =  null
    }
    withVideo({ videoId, type }) {
        this.videoId = videoId
        this.type =  type
        return this
    }
    initVideoEl() {
        this.videoEl =  document.createElement('video')
        this.videoEl.id = VIDEO_ELEMENT_ID
        this.videoEl.autoplay = true
        this.videoEl.loop = true 
        this.videoEl.controls = true
    } 
    resetVideoBox() {
        const videoBoxEl = document.getElementById(VIDEO_BOX_ELEMENT_ID)
        videoBoxEl.innerHTML = ''
        this.initVideoEl()
        videoBoxEl.append(this.videoEl)
    }
    initYoutubeVideo() {
        new YT.Player(VIDEO_ELEMENT_ID, {
            height: '360',
            width: '640',
            videoId: this.videoId,
            events : {
                'onReady': function(e) { e.target.playVideo() }
            }
        })
    }
    initGoogleDirveVideo() {
        const src = `https://drive.google.com/uc?export=download&id=${this.videoId}`
        const sourceEl = document.createElement('source')
        sourceEl.id = SOURCE_ELEMENT_ID
        sourceEl.src = src
        this.videoEl.append(sourceEl)
        this.videoEl.load() 
        this.videoEl.play()
    }
    implementCurrentTypeVideo() {
        if (this.type === 'googledrive') this.initGoogleDirveVideo()
        if (this.type === 'youtube') this.initYoutubeVideo()
    }
    render() {
        this.resetVideoBox()
        this.implementCurrentTypeVideo()
    }
}



const videoManager = new VideoManager()

document.querySelectorAll('[data-video-id][data-type]').forEach(el => {
    el.addEventListener('click', (e) => {
        const videoData = {
            videoId: e.target.dataset.videoId,
            type: e.target.dataset.type
        }
        videoManager.withVideo(videoData).render()
    })
})


/*********************
  render vidoe box    
*********************/
function findCurrentElement() {
    // TODO : delete dummy data and get current time
    // const currentTime = moment().format('HHmm')
    const currentTime = 10
    const dayEls = document.querySelector('.program__week').childNodes
    let targetDayEl
    dayEls.forEach(el => {
        if (el.dataset.time && Number(el.dataset.time) > currentTime) return 
        targetDayEl =  el
    })
    return targetDayEl
}

function renderCurrentVideo() {
    const currentEl = findCurrentElement()
    if (!currentEl.dataset.videoId || !currentEl.dataset.type) return 

    const videoData =  {
        videoId: currentEl.dataset.videoId,
        type: currentEl.dataset.type
    }
    videoManager.withVideo(videoData).render()
}


// implemented when finish laoding youtube iframe api
function onYouTubeIframeAPIReady() {
    renderCurrentVideo()
}

