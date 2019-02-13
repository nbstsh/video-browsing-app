const _ = require('lodash')
const debugError = require('debug')('app:error')
const express = require('express')
const router = express.Router()

const { resetScheduleData, generateDummyVideos } = require('../../models/dummy')
const { getSelectedSchedules } = require('../../models/schedule')
const { Video, getVideos, validate } = require('../../models/video')

// T0DO create pug
router.get('/', (req, res) => {
    res.redirect('/admin/form.html')
})

router.post('/', async (req, res) => {
    emptyVideoProps(req.body)
    const { error } = validate(req.body)
    // TODO set default value for redirected form
    if (error) {
        debugError(error)
        res.send(error.details[0].message)
        return res.redirect('/admin/form.html')
    }

    const video = new Video(_.pick(req.body, ['videoId', 'type', 'path', 'title', 'description']))
    console.log({video})
    await video.save()
    // TODO: redirect to video list
    res.send(video)
})

function emptyVideoProps(video) {
    for(let key in video) {
        if (!video[key]) delete video[key]
    }
} 

module.exports = router