
const debugStartup = require('debug')('app:startup')
const debugData = require('debug')('app:data')
const debugError = require('debug')('app:error')
const path = require('path')
const morgan = require('morgan')
const Joi = require('joi')
const config = require('config')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const { resetScheduleData, generateDummyVideos } = require('./db/dummy')
const { getSelectedSchedules } = require('./db/schedule')

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
resetScheduleData()
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



app.get('/schedules', async (req, res) => {
    const schedules = await getSelectedSchedules()



    res.send(JSON.stringify(schedules))
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


