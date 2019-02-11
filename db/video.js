const debugData = require('debug')('app:data')
const mongoose = require('mongoose')

/******************************************
    video collections
******************************************/
const videoSchema = new mongoose.Schema({
    videoId: String, 
    type: Number, 
    path: String, 
    title: String, 
    description: String ,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Video = mongoose.model('Video', videoSchema)

async function createVideo(input) {
    const video = new Video(input)
    const result = await video.save()
    debugData('result',result)
    return result
}

async function getVideos() {
    const videos = await Video.find({})
    debugData('videos', videos)
    return videos
}

async function getVideo(id) {
    return await Video.findById(id)
}

async function resetVideos() {
    const videos = await Video.find({})
    videos.forEach(v => v.delete())
}

module.exports = {
    createVideo,
    getVideos,
    getVideo,
    resetVideos
}