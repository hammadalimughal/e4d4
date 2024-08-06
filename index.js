const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const connectionWithDb = require('./db')
const session = require('express-session')
const passport = require("passport")
require('./controller/auth/google')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

const PORT = process.env.PORT || 8080;

connectionWithDb()
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'E4D4-Secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
app.use(passport.initialize())


app.get('/', async (req, res) => {
    res.render(`index`)
})

app.get('/businessdetails', async (req, res) => {
    res.render(`businessdetails`)
})

app.get('/businessregistration', async (req, res) => {
    res.render(`businessregistration`)
})

app.get('/dashboard-main', async (req, res) => {
    res.render(`dashboard-main`)
})

app.get('/dashboard', async (req, res) => {
    res.render(`dashboard`)
})

app.get('/join', async (req, res) => {
    res.render(`join`)
})

app.get('/portfolioreg', async (req, res) => {
    res.render(`portfolioreg`)
})

app.get('/profilepicture', async (req, res) => {
    res.render(`profilepicture`)
})

app.get('/searchprofilehistory', async (req, res) => {
    res.render(`searchprofilehistory`)
})

app.get('/userregistration', async (req, res) => {
    res.render(`userregistration`)
})

app.use('/api',require('./controller/apihandler'))

app.listen(PORT, () => {
    console.log(`App is listening on PORT: http://localhost:${PORT}`)
})