let DOMAIN = 'localhost:3000'
let API_VIDEOS_URL = `http://localhost:3000/api/videos`

/************************************
  Video
*************************************/
let videos = null

const laodVideos = async () => {
    videos = await fetch(API_VIDEOS_URL).then(res => res.json())
}

laodVideos()

const findVideo = (id) => videos.find(v => v._id === id)

const findCurrentSelectedVideo = () => {
    const id = findCurrentSelectedVideoId()
    return findVideo(id)
}


/************************************
  Render Tree Process
*************************************/
const renderVideoOptionModal = async() => {
    const videoOptionListEl = document.querySelector('#video-option-list')
    videoOptionListEl.innerHTML = ''

    videos.forEach(video => {
        videoOptionListEl.append(generateVideoOptionItemDOM(video))
    })

    initVideoSelectButtonEvent()
}

const generateVideoOptionItemDOM = (video) => {
    const listEl = document.createElement('li')
    listEl.classList.add('video-option__list-item')

    // video data
    listEl.textContent = video.title
    // video select button
    listEl.append(generateVideoSelectButtonEl(video._id))

    return listEl
}

const generateVideoSelectButtonEl = (videoId) => {
    const buttonEl = document.createElement('button')
    buttonEl.textContent = 'select'
    buttonEl.classList.add('video-select')
    buttonEl.dataset.videoId = videoId
    return buttonEl
}

// add event select video option
const initVideoSelectButtonEvent = () => {
    document.querySelectorAll('.video-select').forEach(button => {
        button.addEventListener('click', (e) => {
            const videoId = e.target.dataset.videoId 
            removeSelectedVideo()
            createSelectedVideo(videoId)
            renderSelectedVideoBox()
            renderThumnail(selectedVideos.find(v => v.timeId === getTimeId()))
        })
    })
}

const renderSelectedVideoBox = () => {
    const boxEl = document.querySelector('#selected-video-box')
    boxEl.innerHTML = '' 
    boxEl.append(generateSelectedVideoEl())

    // check if there is selected video
    if (!findCurrentSelectedVideoId()) return 
    boxEl.append(generateCancelVideoButtonEl())
    initCancelVideoEvent()
}

const generateSelectedVideoEl = () => {
    const video = findCurrentSelectedVideo()
    const selectedVideoEl = document.createElement('div')

    if (video) {
        selectedVideoEl.innerText = video.title
    } else {
        selectedVideoEl.innerText = 'Select video'
    }
    
    return selectedVideoEl
}

const generateCancelVideoButtonEl = () => {
    const buttonEl = document.createElement('button')
    buttonEl.textContent = 'cancel'
    buttonEl.id = 'video-cancel'
    return buttonEl
}

const renderThumnail = ({ timeId, videoId }) => {
    const thumnailEl = document.querySelector(`[data-time-id="${timeId}"]`)
    const video = findVideo(videoId)
    if (video) {
        // TODO: set img props to show thumnail
        thumnailEl.textContent =  video.title
    } else {
        // TODO: reset thumnail 
        thumnailEl.textContent = ''
    }
    

}

const initCancelVideoEvent = () => {
    document.querySelector('#video-cancel').addEventListener('click', () => {
        removeSelectedVideo()
        renderSelectedVideoBox()
        // reset thumnail 
        renderThumnail({ timeId: getTimeId() })
    })
}


/************************************
  selected video
*************************************/
const selectedVideos = []

const findSelectedVideoId = (timeId) => {
    const selectedVideo = selectedVideos.find(v => v.timeId === timeId)
    return selectedVideo ? selectedVideo.videoId : null
}

const findCurrentSelectedVideoId = () => findSelectedVideoId(getTimeId())


const createSelectedVideo = (videoId) => {
    const timeId = getTimeId()
    if (!timeId || !videoId) return 
    
    selectedVideos.push({ timeId, videoId })
}

const removeSelectedVideo = () => {
    const timeId = getTimeId()
    const index = selectedVideos.findIndex(v => v.timeId === timeId)
    if (index > -1) selectedVideos.splice(index, 1)
}

/************************************
  Modal Manupulation
*************************************/
const openModal = (targetId) => {
    document.querySelector(targetId).dataset.status = 'open'
}

const closeModal = (targetId) => {
    document.querySelector(targetId).dataset.status = 'close'
}

// TODO : move to common js file
document.querySelectorAll('.close-modal').forEach(el => {
    el.addEventListener('click', (e) => {
        const targetId = e.target.dataset.target
        document.querySelector(targetId).dataset.status = 'close'
    })
})


/************************************
  timeId 
*************************************/
const extractTimeId = (el) => el.dataset.timeId

let timeId
const setTimeId = (id) => timeId = id
const getTimeId = () => timeId

// open modal
document.querySelectorAll('*[data-time-id]').forEach(el => {
    el.addEventListener('click', (e) => {
        renderVideoOptionModal()
        openModal(e.target.dataset.target)
        setTimeId(extractTimeId(e.target))
        renderSelectedVideoBox()
    })
})

// reset selected timeId when modal close
new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.oldValue !== 'open') return 
        setTimeId('')
    })
}).observe(document.querySelector('#video-option-modal'), { 
    attributes: true,
    attributeOldValue: true, 
    attributeFilter: ['data-status']
})


/************************************
  form
*************************************/

document.querySelector('#schedule-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const inputEl = e.target.children.selectedVideos
    inputEl.value = JSON.stringify(selectedVideos)
    console.log(inputEl.value)

    e.target.submit()
})