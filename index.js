const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const connectionWithDb = require('./db')
const session = require('express-session')
const passport = require("passport")
require('./controller/auth/google')
require('./controller/auth/facebook')
const cookieAuth = require('./middleware/authCookie')

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
app.use(cookieAuth('authtoken'));


app.get('/', async (req, res) => {
    const user = req.user
    console.log('user', user)
    res.render(`index`, { user })
})

app.get('/businessdetails', async (req, res) => {
    const user = req.user
    res.render(`businessdetails`, { user })
})

app.get('/businessregistration', async (req, res) => {
    const user = req.user
    res.render(`businessregistration`, { user })
})

app.get('/dashboard-main', async (req, res) => {
    const user = req.user
    if (!user) {
        return res.redirect(`/join`)
    }
    res.render(`dashboard-2`, { user })
})

app.get('/dashboard', async (req, res) => {
    const user = req.user
    if (!user) {
        return res.redirect(`/join`)
    }
    res.render(`dashboard`, { user })
})

app.get('/join', async (req, res) => {
    const user = req.user
    res.render(`join`, { user })
})

app.get('/portfolioreg', async (req, res) => {
    const user = req.user || req.session?.passport?.user
    res.render(`portfolioreg`, { user })
})

app.get('/profilepicture', async (req, res) => {
    const user = req.user
    if (!user) {
        return res.redirect(`/join`)
    }
    res.render(`profilepicture`, { user })
})

app.get('/searchprofilehistory', async (req, res) => {
    const user = req.user
    if (!user) {
        return res.redirect(`/join`)
    }
    res.render(`searchprofilehistory`, { user })
})

app.get('/userregistration', async (req, res) => {
    const user = req.user
    res.render(`userregistration`, { user })
})

app.use('/api', require('./controller/apihandler'))

app.listen(PORT, () => {
    console.log(`App is listening on PORT: http://localhost:${PORT}`)
})