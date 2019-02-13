const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const schedules = await getSelectedSchedules()
    const times = generateTimelist(config.get('schedule.duration'))

    res.render('index', { week: schedules.week, times })
})


module.exports = router