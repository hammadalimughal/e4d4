const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const connectionWithDb = require('./db')
const session = require('express-session')
const passport = require("passport")
require('./controller/auth/google')
require('./controller/auth/facebook')
const cookieAuth = require('./middleware/authCookie')
const Job = require("./schema/Job")
const formatDate = require('./helper/formatDate')
const User = require('./schema/User')

app.set('view engine', 'ejs');
app.use('/sites/e4d4/assets', express.static(__dirname + '/views/assets'));


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


app.get('/sites/e4d4/', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        console.log('user', user)
        res.render(`index`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/businessdetails', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        res.render(`businessdetails`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/businessregistration', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        res.render(`businessregistration`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/dashboard-main', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        if (!user) {
            return res.redirect(`/sites/e4d4/join`)
        }
        res.render(`dashboard-2`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/dashboard', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        if (user) {
            return res.render(`dashboard`, { user, business })
        }
        return res.redirect(`/sites/e4d4/join`)
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/join', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        if (user) {
            return res.redirect(`/sites/e4d4/dashboard`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4`)
        }
        return res.render(`join`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})
app.get('/sites/e4d4/user-loginemail', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        res.render(`user-loginemail`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})
app.get('/sites/e4d4/profile/:id', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        const id = req.params.id
        const profileUser = await User.findById(id)
        if (!user) {
            return res.redirect(`/sites/e4d4/join`)
        }
        res.render(`profile`, { user, business, profileUser })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})
app.get('/sites/e4d4/edit/profile', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        if (!user) {
            return res.redirect(`/sites/e4d4/join`)
        }
        res.render(`edit-profile`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})
app.get('/sites/e4d4/user-login', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        res.render(`user-login`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})
app.get('/sites/e4d4/business-login', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        res.render(`business-login`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/portfolioreg', async (req, res) => {
    try {
        const user = req.user || req.session?.passport?.user
        const business = req.business
        res.render(`portfolioreg`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/profilepicture', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        if (!user) {
            return res.redirect(`/sites/e4d4/join`)
        }
        res.render(`profilepicture`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})
app.get('/sites/e4d4/business-subscription', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        if (!business) {
            return res.redirect(`/sites/e4d4/business-login`)
        }
        res.render(`business-subscription`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/searchprofilehistory', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        if (!user) {
            return res.redirect(`/sites/e4d4/join`)
        }
        res.render(`searchprofilehistory`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/userregistration', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        res.render(`userregistration`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.get('/sites/e4d4/jobposting', async (req, res) => {
    try {
        const user = req.user
        const business = req.business
        if (!business) {
            res.redirect(`/sites/e4d4/join`)
            return
        }
        res.render(`jobposting`, { user, business })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})
app.get('/sites/e4d4/jobdetails/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = req.user
        const business = req.business
        const job = await Job.findById(id).populate('company')
        res.render(`jobdetails`, { user, business, job, formatDate })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

app.use('/sites/e4d4/api', require('./controller/apihandler'))

app.listen(PORT, () => {
    console.log(`App is listening on PORT: http://localhost:${PORT}/sites/e4d4`)
})