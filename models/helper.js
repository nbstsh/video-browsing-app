
const { SelectedSchedule } = require('./selectedSchedule')

async function getSelectedSchedule() {
    const { schedule } =  await SelectedSchedule.findOne({ selected: true }).populate('schedule')

    const sortTimes = (times) => times.sort((a, b) => a.time - b.time)
    schedule.days.forEach(day => sortTimes(day.times))

    return schedule
}

module.exports = {
    getSelectedSchedule
}