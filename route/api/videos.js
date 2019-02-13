const express = require('express')
const router = express.Router()

const { Video } = require('../../models/video')

router.get('/', async (req, res) => {
    const videos = await Video.find()
    return res.send(videos)
})

module.exports = router