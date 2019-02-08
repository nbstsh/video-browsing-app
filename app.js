
const debugStartup = require('debug')('app:startup')
const debugData = require('debug')('app:data')
const debugError = require('debug')('app:error')
const path = require('path')
const morgan = require('morgan')
const Joi = require('joi')
const moment = require('moment')
const mongoose = require('mongoose')
const express = require('express')
const app = express()


/******************************************
    Mongo DB
******************************************/
mongoose.connect('mongodb://localhost/videoBrowsingApp', { useNewUrlParser: true })
    .then(() => debugStartup('Connected to db ....'))
    .catch(err => debugStartup('Failed to connect to db ....', err))


/******************************************
    video collections
******************************************/
const videoSchema = new mongoose.Schema({
    videoId: String, 
    type: Number, 
    path: String, 
    title: String, 
    description: String , 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Video = mongoose.model('Video', videoSchema)

async function createVideo(input) {
    const video = new Video(input)
    const result = await video.save()
    debugData('result',result)
    return result
}

async function getVidoes() {
    const videos = await Video.find({})
    debugData('videos', videos)
    return videos
}


/******************************************
    schedule collectins
******************************************/
const scheduleSchema = new mongoose.Schema({
    day: Number,
    time: Number 
})

const Schedule = mongoose.model('Schedule', scheduleSchema)

async function createSchedule(input) {
    const schedule = new Schedule(input)
    const result = await schedule.save()
    debugData(result)
    return result
}

/******************************************
    dummy schedule data
******************************************/
async function generateScheduleTable(duration) {
    for(let minute = 0; minute < 1440; minute+=duration) {
        const time = moment().minute(minute).format('HHmm')
        await createSchedule({ time })

    }
}

async function resetSchedule() {
    const schedules = await Schedule.find({})
    console.log(schedules)
    schedules.forEach((schedule) => {
        schedule.delete()
    })
}

// resetSchedule()
// console.log(moment().hour(0).minute(0).format('HHmm'))
// generateScheduleTable(30)



/******************************************
    middleware
******************************************/
app.use(express.json())
app.use(express.urlencoded( { extended: true }))
app.use(express.static(path.join(__dirname + '/public')))

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
}



/******************************************
    Route
******************************************/ 
app.get('/videos', (req, res) => {
    getVidoes().then((videos) => {
        res.send(videos)
    }).catch((err) => {
        debugError(err)
        res.send('Error')
    })
})


app.post('/videos', (req, res) => {
    const { error } = validateVideo(req.body)
    // TODO set default value for redirected form
    if (error) {
        debugError(error)
        return res.redirect('/admin/form.html')
    }

    createVideo(req.body).then(video => {
        res.send(video)
    }).catch((err) => {
        res.redirect('/admin/form.html')
    })
})


// Util
function validateVideo(video) {
    const schema = {
        videoId: Joi.string().required(), 
        type: Joi.number().required(), 
        path: Joi.string().required(), 
        title: Joi.string(), 
        description: Joi.string()
    }

    return Joi.validate(video, schema)
}


const port = process.env.PORT || 3000
app.listen(port, () => debugStartup(`Start app on port ${port} ...`))


