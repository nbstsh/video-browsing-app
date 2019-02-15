const controller = require('../../controllers/video')
const express = require('express')
const router = express.Router()

router.get('/', controller.showVideos)

router.get('/new', controller.new)

router.get('/:id', controller.showVidoe)

router.get('/:id/edit', controller.edit)

router.post('/', controller.create)

router.delete('/:id', controller.delete)


module.exports = router