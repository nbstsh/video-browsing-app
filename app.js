
const debugStartup = require('debug')('app:startup')
const debugData = require('debug')('app:data')
const debugError = require('debug')('app:error')
const path = require('path')
const morgan = require('morgan')
const Joi = require('joi')
const config = require('config')
const moment = require('moment')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const { resetScheduleData, generateDummyVideos } = require('./db/dummy')
const { getSelectedSchedules } = require('./db/schedule')
const { getVideos } = require('./db/video')

app.set('view engine', 'pug')

/******************************************
    Mongo DB
******************************************/
mongoose.connect(`mongodb://${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`, { useNewUrlParser: true })
    .then(() => debugStartup('Connected to db ....'))
    .catch(err => debugStartup('Failed to connect to db ....', err))


/******************************************
    dummy 
******************************************/
// resetScheduleData()
// generateDummyVideos()


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
app.get('/', async (req, res) => {
    const schedules = await getSelectedSchedules()
    const times = generateTimelist(config.get('schedule.duration'))

    res.render('index', { week: schedules.week, times })
})

function generateTimelist(duration) {
    const times = []
    for(let minute = 0; minute < 1440; minute+=duration) {
        times.push(moment().minute(minute).format('HHmm'))
    }
    return times.sort((a, b) => a - b)
}


app.get('/api/videos', async (req, res) => {
    const videos = await getVideos()
    res.send(videos)
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


// Admin
app.get('/admin/schedules', async (req, res) => {
    const schedules = await getSelectedSchedules()
    const times = generateTimelist(config.get('schedule.duration'))

    res.render('admin/schedule', { week: schedules.week, times })
})

app.post('/admin/schedules', async (req, res) => {
    const selectedVideos = JSON.parse(req.body.selectedVideos)
    if (!selectedVideos || selectedVideos.length === 0) return 

    let schedule = await getSelectedSchedules()
    // set selected video's id to correcponding time object in schedule collection
    schedule.week.forEach(({ times }) => {
        times.forEach(time => {
            const selectedVideo = selectedVideos.find(v => v.timeId === time._id.toString())
            if (!selectedVideo) return 
            time.videoId = selectedVideo.videoId 
        })
    })

    schedule = await schedule.save()
    res.send(schedule)
})

/******************************************
    util
******************************************/
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


