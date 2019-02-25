const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const _ = require('lodash')
const debugError = require('debug')('app:error')
const debugData = require('debug')('app:data')
const ObjectId = require('mongoose').Types.ObjectId
const { Video } = require('../models/video')
const { Schedule, validateSchedule } = require('../models/schedule')
const { generateDays } = require('../models/helper')
const mongoose = require('mongoose')
const Fawn = require('fawn')
Fawn.init(mongoose)


// to create ul element to display time schedule
function generateTimeList(times) {
    return times.reduce((acc, cur) =>  {
        acc.push(cur.time)
        return acc
    }, [])
}

function validateSelectedVideos(selectedVideos) {
    for(let v of selectedVideos) {
        const isValid = ObjectId.isValid(v.timeId) && (ObjectId.isValid(v.videoId) || v.videoId === null)
        if (!isValid) return false
    }
    return true
}

// find time object with given _id inside schedule document
function findTimeObj({ days }, timeId) {
    for(let day of days) {
        for(let timeObj of day.times) {
            if (timeObj._id.toString() === timeId) return timeObj
        }
    }
    return null
}

function validateSelected(input) {
    const schema = {
        selectedId: Joi.objectId().required()
    }

    return Joi.validate(input, schema)
}


/************************
* get /
*************************/
exports.show = async (req, res) => {
    const schedules = await Schedule.find()
    const selectedSchedule = schedules.find(s => s.selected)
    console.log(selectedSchedule)
    res.render('admin/schedules/index', { schedules, selectedSchedule })
}

/************************
* post / 
*************************/
exports.create = async (req, res) => {
    const { error } = validateSchedule(req.body)
    if (error) {
        res.render('admin/schedules/form', { errorMessage: error.details[0].message})
    }

    const schedule = new Schedule({
        title: req.body.title,
        days: generateDays(Number(req.body.duration)),
        duration: req.body.duration,
    })
    await schedule.save()

    // const selectedSchedule = new SelectedSchedule({ schedule: schedule._id, duration: req.body.duration })
    // await selectedSchedule.save()

    res.redirect('/admin/schedules')
}

/************************
* get /:id
*************************/
exports.edit = async (req, res) => {
    // const { days } = await findSelectedSchedule()
    const { days, _id } = await Schedule.findById(req.params.id)
    if (!days) {
        // TODO error handling
        res.status(404).send('The schedule with given id was not found')
    }

    const times = generateTimeList(days[0].times)
    res.render('admin/schedules/show', { days, times , scheduleId: _id})
}

/************************
* post /:id
*************************/
exports.update = async (req, res) => {
    const selectedVideos = JSON.parse(req.body.selectedVideos)
    if (!validateSelectedVideos(selectedVideos)){
        // TODO : error handling
        debugError('Invalid selectedVideos')
        return res.redirect('/admin/schedules')
    }

    // const schedule = await findSelectedSchedule()
    const schedule = await Schedule.findById(req.params.id)

    const populatingVideoInTimeObj = selectedVideos.map(v => new Promise(async (resolve) => {
        const time = findTimeObj(schedule, v.timeId)
        if (v.videoId) {
            const video = await Video.findById(v.videoId)
            time.video = _.pick(video, ['_id', 'videoId', 'type', 'path', 'title', 'description'])
        } else {
            time.video = null
        }
        resolve(time)
    }))

    const times = await Promise.all(populatingVideoInTimeObj)
    debugData({ times })

    await schedule.save()

    res.send(schedule)
}


/************************
* post /selected
*************************/
module.exports.selected = async (req, res) => {
    const { error } = validateSelected(req.body)
    if (error) {
        return res.redirect('/admin/schedules')
    }
    
    const task = Fawn.Task()
    await task
        .update("schedules", { selected: true }, { selected: false })
        .update("schedules", {_id: req.body.selectedId }, { selected: true })
        .run({ useMongoose: true })
        .catch((err) => {
            // TODO : error handling
            console.log(err)
        })

    res.redirect('/admin/schedules')
}
