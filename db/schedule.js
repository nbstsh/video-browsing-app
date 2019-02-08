const mongoose = require('mongoose')
const debugData = require('debug')('app:data')


/******************************************
    schedule collectins
******************************************/
const scheduleSchema = new mongoose.Schema({
    times: [ Number ] 
})

const Schedule = mongoose.model('Schedule', scheduleSchema)

async function createSchedule(input) {
    const schedule = new Schedule(input)
    const result = await schedule.save()
    debugData('create schedule', result)
    return result
}

async function getSchedules() {
    const schedules = await Schedule.find({})
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
    resetSchedule
}