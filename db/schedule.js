const mongoose = require('mongoose')
const debugData = require('debug')('app:data')
const { getScheduleMaster } = require('./scheduleMaster')
const ObjectId = mongoose.Types.ObjectId

/******************************************
    schedule collectins
******************************************/
const scheduleSchema = new mongoose.Schema({
    week: [ {
        day: String,
        times: [{ 
            videoId: String,
            time: Number
        }]
    } ] 
})
// const scheduleSchema = new mongoose.Schema({
//     times: [ {
//         day: Number,
//         videoId: String,
//         time: Number
//     } ] 
// })

const Schedule = mongoose.model('Schedule', scheduleSchema)

async function createSchedule(input) {
    const schedule = new Schedule(input)
    const result = await schedule.save()
    debugData('create schedule', result)
    return result
}

function getSchedules() {
    return Schedule.find({})
}

async function getSelectedSchedules() {
    const scheduleMaster = await getScheduleMaster()
    const schedules = await Schedule.findOne( { _id: scheduleMaster.selectedScheduleId })
    return schedules
}

async function resetSchedule() {
    const schedules = await Schedule.find({})
    schedules.forEach((schedule) => {
        schedule.delete()
    })
}

module.exports = {
    createSchedule,
    getSchedules,
    resetSchedule,
    getSelectedSchedules
}