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
    title: {
        type: String,
        required: true,
        min: 1,
        max: 50
    },
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
    } ],
    duration: {
        type: Number,
        min: 5,
        max: 1440, // 24 * 60 min
        required: true
    },
    selected: {
        type: Boolean,
        required: true,
        validate: {
            isAsync: true,
            validator: function(v, callback) {
                // 'false' is always valid
                if (!v) return callback(true)
                // check if there is another true
                Schedule
                    .find({ selected: true })
                    .countDocuments()
                    .exec((err, count) => {
                        callback(count === 0)
                    })
            }
        },
        default: false
    } 
})

const Schedule = mongoose.model('Schedule', scheduleSchema)

function validateSchedule(selectedSchedule){
    const schema = {
        title: Joi.string().min(1).max(50).required(),
        duration: Joi.number().min(5).max(1440).required()
    }
    return Joi.validate(selectedSchedule, schema)
}


exports.Schedule = Schedule
exports.validateSchedule = validateSchedule