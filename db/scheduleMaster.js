const mongoose = require('mongoose')
const config = require('config')

/******************************************
    schedule Master collectins
******************************************/
const scheduleMasterSchema = new mongoose.Schema({
    selectedScheduleId: String,
    duration: Number,
})

const ScheduleMaster = mongoose.model('ScheduleMaster', scheduleMasterSchema)


async function generateDefaultScheduleMaster(defaultScheduleId) {
    await ScheduleMaster.deleteOne({})
    ScheduleMaster.create({
        selectedScheduleId: defaultScheduleId,
        duration: config.get('schedule.duration')
    })
}

function getScheduleMaster() {
    return ScheduleMaster.findOne({})
}

module.exports = { generateDefaultScheduleMaster, getScheduleMaster }