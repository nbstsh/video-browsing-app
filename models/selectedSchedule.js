const mongoose = require('mongoose')
const config = require('config')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const selectedScheduleSchema = new mongoose.Schema({
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
    },
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
                SelectedSchedule
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

const SelectedSchedule = mongoose.model('SelectedSchedule', selectedScheduleSchema)


function validateSelectedSchedule(selectedSchedule){
    const schema = {
        duration: Joi.number().min(5).max(1440).required()
    }
    return Joi.validate(selectedSchedule, schema)
}


exports.SelectedSchedule = SelectedSchedule
exports.validateSelectedSchedule = validateSelectedSchedule
