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
    const business = req.business
    console.log('user', user)
    res.render(`index`, { user, business })
})

app.get('/businessdetails', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`businessdetails`, { user, business })
})

app.get('/businessregistration', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`businessregistration`, { user, business })
})

app.get('/dashboard-main', async (req, res) => {
    const user = req.user
    const business = req.business
    if (!user) {
        return res.redirect(`/join`)
    }
    res.render(`dashboard-2`, { user, business })
})

app.get('/dashboard', async (req, res) => {
    const user = req.user
    const business = req.business
    if (user) {
        return res.render(`dashboard`, { user, business })
    }
    return res.redirect(`/join`)
})

app.get('/join', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`join`, { user, business })
})
app.get('/user-loginemail', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`user-loginemail`, { user, business })
})
app.get('/user-login', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`user-login`, { user, business })
})
app.get('/business-login', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`business-login`, { user, business })
})

app.get('/portfolioreg', async (req, res) => {
    const user = req.user || req.session?.passport?.user
    const business = req.business
    res.render(`portfolioreg`, { user, business })
})

app.get('/profilepicture', async (req, res) => {
    const user = req.user
    const business = req.business
    if (!user) {
        return res.redirect(`/join`)
    }
    res.render(`profilepicture`, { user, business })
})
app.get('/business-subscription', async (req, res) => {
    const user = req.user
    const business = req.business
    if (!business) {
        return res.redirect(`/business-login`)
    }
    res.render(`business-subscription`, { user, business })
})

app.get('/searchprofilehistory', async (req, res) => {
    const user = req.user
    const business = req.business
    if (!user) {
        return res.redirect(`/join`)
    }
    res.render(`searchprofilehistory`, { user, business })
})

app.get('/userregistration', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`userregistration`, { user, business })
})

app.get('/jobposting', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`jobposting`, { user, business })
})
app.get('/jobdetails', async (req, res) => {
    const user = req.user
    const business = req.business
    res.render(`jobdetails`, { user, business })
})

app.use('/api', require('./controller/apihandler'))

app.listen(PORT, () => {
    console.log(`App is listening on PORT: http://localhost:${PORT}`)
})