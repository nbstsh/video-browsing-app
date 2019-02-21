const mongoose = require('mongoose')
const config = require('config')
const debugError = require('debug')('app:error')
const moment = require('moment')
const { Schedule } = require('./schedule')
const { SelectedSchedule } = require('./selectedSchedule')
const { Video } = require('./video')
const { generateDays } = require('./helper')

/******************************************
    dummy schedule data
******************************************/
async function initDummySelectedSchedule() {
    await SelectedSchedule.deleteMany()

    const schedule = await Schedule.findOne()
    if (!schedule) throw new Error('There is no schedule document')

    const selectedSchedule = new SelectedSchedule({
        schedule: schedule._id,
        duration: config.get('schedule.duration'),
        selected: true
    })
    await selectedSchedule.save() 
    return selectedSchedule
}


async function initDummySchedule() {
    await Schedule.deleteMany()

    const days = generateDays(config.get('schedule.duration'))
    const schedule = new Schedule({ days })
    await schedule.save()
    return schedule
}


/******************************************
    dummy video data
******************************************/
async function initDummyVideo() {
    await Video.deleteMany()
    for(let i = 0; i < 10; i++) {
        Video.create({
            videoId: `video id ${i}`, 
            type: 'youtube', 
            path: `https://images.unsplash.com/photo-1549758895-6eab7830c05d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80`, 
            title: `Sample ${i}`, 
            description: `description ${i}`
        })
    }
}


async function initDummy() {
    await initDummySchedule()
    initDummySelectedSchedule()
    initDummyVideo()
}

module.exports = { initDummy }