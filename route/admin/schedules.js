const config = require('config')
const _ = require('lodash')
const debugError = require('debug')('app:error')
const debugData = require('debug')('app:data')
const ObjectId = require('mongoose').Types.ObjectId
const express = require('express')
const router = express.Router()

const { Schedule } = require('../../models/schedule')
const { Video } = require('../../models/video')

const { findSelectedSchedule } = require('../../models/helper')


router.get('/', async (req, res) => {
    const { days } = await findSelectedSchedule()
    const times = generateTimeList(days[0].times)
    res.render('admin/schedule', { days, times })
})

router.post('/', async (req, res) => {
    const selectedVideos = JSON.parse(req.body.selectedVideos)
    if (validateSelectedVideos(selectedVideos)){
        // TODO : error handling
        debugError('Invalid selectedVideos')
        res.redirect('/admin/schedules')
    }

    const schedule = await findSelectedSchedule()

    const populatingVideoInTimeObj = selectedVideos.map(v => new Promise(async (resolve) => {
        const time = findTimeObj(schedule, v.timeId)
        if (v.videoId) {
            const video = await Video.findById(v.videoId)
            time.video = _.pick(video, ['_id', 'videoId', 'type', 'path', 'title', 'description'])
        } else {
            time.video = null
        }
        resolve(time)
    }))

    const times = await Promise.all(populatingVideoInTimeObj)
    debugData({ times })

    await schedule.save()

    res.send(schedule)
})


// to create ul element to display time schedule
function generateTimeList(times) {
    return times.reduce((acc, cur) =>  {
        acc.push(cur.time)
        return acc
    }, [])
}

function validateSelectedVideos(selectedVideos) {
    for(let v of selectedVideos) {
        const isValid = ObjectId.isValid(v.timeId) && ObjectId.isValid(v.videoId)
        if (!isValid) return false
    }
    return true
}

// find time object with given _id inside schedule document
function findTimeObj({ days }, timeId) {
    console.log(timeId)
    for(let day of days) {
        for(let timeObj of day.times) {
            if (timeObj._id.toString() === timeId) return timeObj
        }
    }
    return null
}

module.exports = router