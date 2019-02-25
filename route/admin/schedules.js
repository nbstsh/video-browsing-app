const controller = require('../../controllers/schedule')
const express = require('express')
const router = express.Router()


router.get('/', controller.show)
router.post('/', controller.create)
router.post('/selected', controller.selected)
router.get('/:id', controller.edit)
router.post('/:id', controller.update)


module.exports = router