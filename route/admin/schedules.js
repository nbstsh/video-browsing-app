const controller = require('../../controllers/schedule')
const express = require('express')
const router = express.Router()


router.get('/', controller.show)
router.post('/', controller.create)


module.exports = router