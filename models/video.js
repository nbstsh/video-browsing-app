const Joi = require('joi')
const debugData = require('debug')('app:data')
const mongoose = require('mongoose')


const videoSchema = new mongoose.Schema({
    videoId: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true
    }, 
    type: {
        type: String,
        required: true,
        enum: ['youtube', 'googledrive']
    }, 
    path: {
        type: String,
        minlength: 5,
        maxlength: 2048,
    }, 
    title: {
        type: String,
        minlength: 1,
        maxlength: 50,
    }, 
    description: {
        type: String,
        minlength: 5,
        maxlength: 255
    } ,
})

const Video = mongoose.model('Video', videoSchema)

function validateVideo(video) {
    const schema = {
        videoId: Joi.string().min(1).max(255).required(), 
        type: Joi.string().required(), 
        path: Joi.string().min(5).max(2048), 
        title: Joi.string().min(1).max(50), 
        description: Joi.string().min(5).max(255)
    }
    return Joi.validate(video, schema)
}


exports.validate = validateVideo
exports.Video = Video
exports.videoSchema = videoSchema