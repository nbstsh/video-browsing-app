const _ = require('lodash')
const debugError = require('debug')('app:error')
const express = require('express')
const router = express.Router()

const { Video, validate } = require('../../models/video')

const  SELECTED_PROPS = ['_id', 'videoId', 'type', 'path', 'title', 'description']

router.get('/', async (req, res) => {
    let videos = await Video.find()
    videos = videos.map(v => _.pick(v, SELECTED_PROPS))
    res.render('admin/videos/index', { videos })
})

router.get('/new', (req, res) => {
    console.log('req.body', req.body)
    res.render('admin/videos/form')
})

router.get('/:id', async (req, res) => {
    const video = await Video.findById(req.params.id).catch((e) => {
        // TODO error handling
        res.redirect('./')
    })

    if (!video) {
        debugError('No video found')
        // TODO error handling , show error message
        res.redirect('./')
    }

    res.render('admin/videos/show.pug', { video: _.pick(video, SELECTED_PROPS) })
})

router.get('/:id/edit', async (req, res) => {
    const video = await Video.findById(req.params.id).catch((e) => {
        // TODO error handling
        res.redirect('./')
    })

    if (!video) {
        debugError('No video found')
        // TODO error handling , show error message
        res.redirect('./')
    }

    res.render('admin/videos/form.pug', { video })
})

router.post('/', async (req, res) => {
    emptyVideoProps(req.body)
    const { error } = validate(req.body)
    // TODO set default value for redirected form
    if (error) {
        debugError(error)
        // TODO error handling, show error message
        res.redirect('videos/new')
    }

    const video = new Video(_.pick(req.body, ['videoId', 'type', 'path', 'title', 'description']))
    console.log({video})
    await video.save()
    // TODO: redirect to video list
    res.redirect(`videos/${video._id}`)
})

function emptyVideoProps(video) {
    for(let key in video) {
        if (!video[key]) delete video[key]
    }
} 



module.exports = router