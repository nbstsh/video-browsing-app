const moment = require('moment')
const config = require('config')
const { Schedule } = require('./schedule')

async function findSelectedSchedule() {
    const schedule =  await Schedule.findOne({ selected: true })
    const sortTimes = (times) => times.sort((a, b) => a.time - b.time)
    schedule.days.forEach(day => sortTimes(day.times))

    return schedule
}


// generate schedule documents( mon ~ sun / given time schedule)
function generateDays(duration) { 
    let days = []
    Object.values(config.get('schedule.dayId')).forEach((dayId) => {
        const times = []
        for(let minute = 0; minute < 1440; minute+=duration) {
            times.push({
                time: moment().hour(0).minute(minute).format('HHmm')
            })
        }
        days.push({ day: config.get('schedule.day')[dayId], times })
    }) 
    return days
}

module.exports = {
    findSelectedSchedule,
    generateDays
}

