const mongoose = require('mongoose')
const config = require('config')
const moment = require('moment')
const { createSchedule, resetSchedule } = require('./schedule')
const { generateDefaultScheduleMaster } = require('./scheduleMaster')

/******************************************
    dummy schedule data
******************************************/
// generate schedule documents( mon ~ sun / given time schedule)
async function generateScheduleCollection(duration) { 
    let times = []
    for(let minute = 0; minute < 1440; minute+=duration) {
        times.push(moment().minute(minute).format('HHmm'))
    }
    return await createSchedule({ times })
}



async function resetScheduleData() {
    await resetSchedule()
    const schedule = await generateScheduleCollection(config.get('schedule.duration'))
    console.log(schedule)
    generateDefaultScheduleMaster(schedule.id)
}


module.exports = { resetScheduleData }