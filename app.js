const methodOverride = require('method-override')
const debugStartup = require('debug')('app:startup')
const debugData = require('debug')('app:data')
const debugError = require('debug')('app:error')
const path = require('path')
const morgan = require('morgan')
const Joi = require('joi')
const config = require('config')
const moment = require('moment')
const mongoose = require('mongoose')
const home = require('./route/home')
const apiVideo = require('./route/api/videos')
const apiUser = require('./route/api/user')
const adminSchedule = require('./route/admin/schedules')
const adminVideo = require('./route/admin/videos')
const express = require('express')
const app = express()

const { initDummy } = require('./models/dummy')

/******************************************
    set
******************************************/
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
// initDummy()


/******************************************
    middleware
******************************************/
app.use(express.json())
app.use(express.urlencoded( { extended: true }))
app.use(express.static(path.join(__dirname + '/public')))
app.use(methodOverride('_method'))

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
}

/******************************************
    Route
******************************************/ 
app.use('/', home)
app.use('/admin/schedules', adminSchedule)
app.use('/admin/videos', adminVideo)
app.use('/api/videos', apiVideo)
app.use('/api/users', apiUser)



const port = process.env.PORT || 3000
app.listen(port, () => debugStartup(`Start app on port ${port} ...`))


