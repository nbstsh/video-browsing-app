const config = require('config')
const moment = require('moment')
const express = require('express')
const router = express.Router()

const { findSelectedSchedule } = require('../models/helper')

router.get('/', async (req, res) => {
    const { days } = await findSelectedSchedule()
    if (!days) {
        //TODO: error handling
        // default の selectedScheduleを用意しておく必要があるかもしれない
        return res.status(404).send('error: selected schedule not found')
    }

    const times = days[0].times.reduce((acc, cur) =>  {
        acc.push(cur.time)
        return acc
    }, [])


    sortByCurrentDay(days)

    res.render('index', { days, times })
})


function sortByCurrentDay(days) {
    const currentDay = moment().day()
    const add = moment().day('saturday').day() + 1
    const adjustNum = (day) => {
        const num = moment().day(day).day()
        return num < currentDay ? num + add : num
    } 
    days.sort((a, b) => adjustNum(a.day) - adjustNum(b.day))
}


module.exports = router