const moment = require('moment')
const config = require('config')
const express = require('express')
const router = express.Router()

const { Schedule } = require('../../models/schedule')
const { Video } = require('../../models/video')

const { getSelectedSchedule } = require('../../models/helper')


router.get('/', async (req, res) => {
    const { days } = await getSelectedSchedule()
    const times = generateTimeList(days[0].times)
    res.render('admin/schedule', { days, times })
})


router.post('/', async (req, res) => {
    const selectedVideos = JSON.parse(req.body.selectedVideos)
    if (!selectedVideos || selectedVideos.length === 0) return 

    let schedule = await Schedule.find()

    // set selected video's id to correcponding time object in schedule collection

    const updateData = []
    schedule.week.forEach(({ times }) => {
        times.forEach(time => {
            const selectedVideo = selectedVideos.find(v => v.timeId=== time._id.toString())
            if (selectedVideo) updateData.push({ time, videoId: selectedVideo.videoId })
        })
    })
    
    const updateVideo = () => {
        let promise = Promise.resolve()
        updateData.forEach(update => {
            promise = promise.then(() => {
                return Video.findById(update.videoId)
            }).then(video => {
                if (video) update.time.video = {
                    _id: video._id,
                    videoId: video.videoId,
                    type: video.type,
                    path: video.path,
                    title: video.title,
                    description: video.description
                }
            })
        })
        return promise
    }

    
    await updateVideo()
    console.log(updateData)

    console.log('************ save scheduel *************')
    schedule = await schedule.save()
    res.send(schedule)
})


function generateTimeList(times) {
    return times.reduce((acc, cur) =>  {
        acc.push(cur.time)
        return acc
    }, [])
}


module.exports = router