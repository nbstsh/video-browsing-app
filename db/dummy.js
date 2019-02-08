const mongoose = require('mongoose')
const config = require('config')
const moment = require('moment')
const { createSchedule, resetSchedule } = require('./schedule')
const { generateDefaultScheduleMaster } = require('./scheduleMaster')
const { createVideo, resetVideos } = require('./video')

/******************************************
    dummy schedule data
******************************************/
// generate schedule documents( mon ~ sun / given time schedule)
async function generateScheduleCollection(duration) { 
    let week = []
    Object.values(config.get('schedule.dayId')).forEach((dayId) => {
        const times = []
        for(let minute = 0; minute < 1440; minute+=duration) {
            times.push({
                time: moment().minute(minute).format('HHmm')
            })
        }
        week.push({ day: config.get('schedule.day')[dayId], times })
    })
    return await createSchedule({ week })
}


async function resetScheduleData() {
    await resetSchedule()
    const schedule = await generateScheduleCollection(config.get('schedule.duration'))
    console.log(schedule)
    generateDefaultScheduleMaster(schedule.id)
}



/******************************************
    dummy video data
******************************************/
async function generateDummyVideos() {
    await resetVideos()
    for(let i = 0; i < 10; i++) {
        createVideo({
            videoId: `video id ${i}`, 
            type: 0, 
            path: `path${i}`, 
            title: `String${i}`, 
            description: `description${i}`
        })
    }
}


module.exports = { resetScheduleData, generateDummyVideos }