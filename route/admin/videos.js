const _ = require('lodash')
const debugError = require('debug')('app:error')
const express = require('express')
const router = express.Router()

const { resetScheduleData, generateDummyVideos } = require('../../models/dummy')
const { getSelectedSchedules } = require('../../models/schedule')
const { Video, validate } = require('../../models/video')


router.get('/', async (req, res) => {
    const selectProps = ['_id', 'videoId', 'type', 'path', 'title', 'description']
    let videos = await Video.find().select(selectProps)
    videos = videos.map(v => _.pick(v, selectProps))
    res.render('admin/videos', { videos })
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