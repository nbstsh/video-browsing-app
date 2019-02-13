const mongoose = require('mongoose')
const debugData = require('debug')('app:data')
const config = require('config')
const Joi = require('joi')
const { getScheduleMaster } = require('./selectedSchedule')
const { videoSchema } = require('./video')

/******************************************
    schedule collectins
******************************************/
const scheduleSchema = new mongoose.Schema({
    days: [ {
        day: {
            type: String,
            enum: Object.values(config.get('schedule.day'))
        },
        times: [{ 
            time: {
                type: Number,
                required: true,
                min: 0,
                max: 2400
            },
            video: videoSchema
        }]
    } ] 
})

const Schedule = mongoose.model('Schedule', scheduleSchema)


/* TODO : validationどうするか考える (inputがどのようなデータ構造なのかによる)
 
function validateSchedule(schedule) {
    for(let dayObj of schedule.days) {
        const dayValidation = valiateDay(schedule.day)
        if (dayValidation.error) return dayValidation 
        
        const timesValidation = validate

    }

    
}

function validateDay(day) {
    const schema = {
        day: Joi.string().valid(Object.values(config.get('schedule.day'))).required()
    }
    return Joi.validate(day, schema)
}

*/

exports.Schedule = Schedule
// exports.validate = validateSchedule