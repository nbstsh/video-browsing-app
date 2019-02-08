const mongoose = require('mongoose')
const config = require('config')

/******************************************
    schedule Master collectins
******************************************/
const scheduleMasterSchema = new mongoose.Schema({
    selectedSchedule: mongoose.Schema.Types.ObjectId,
    duration: Number,
})

const ScheduleMaster = mongoose.model('ScheduleMaster', scheduleMasterSchema)

async function generateDefaultScheduleMaster(defaultScheduleId) {
    await ScheduleMaster.deleteOne({})
    ScheduleMaster.create({
        selectedSchedule: defaultScheduleId,
        duration: config.get('schedule.duration')
    })
}

module.exports = { generateDefaultScheduleMaster }