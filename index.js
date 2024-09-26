const express = require("express")
const app = express()
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const cookieParser = require('cookie-parser')
const connectionWithDb = require('./db')
const session = require('express-session')
const passport = require("passport")
require('./controller/auth/google')
require('./controller/auth/facebook')
const cookieAuth = require('./middleware/authCookie')
const formatDate = require('./helper/formatDate')
const JWT_SECRET = "E4d4U$er";
const jwt = require('jsonwebtoken')
const extractDomain = require('./helper/extractDomainFromUrl')
const calculateYearsDifference = require('./helper/calculateYearsDifference')
const Job = require("./schema/Job")
const User = require('./schema/User')
const Business = require('./schema/Business')
const Connection = require("./schema/Connection")
const Chat = require('./schema/Chat')
app.set('view engine', 'ejs');
app.use('/sites/e4d4/assets', express.static(__dirname + '/views/assets'));


const PORT = process.env.PORT || 8080;

connectionWithDb()
app.use(cookieParser())
// app.use(express.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true })); // for form data
app.use(session({
    secret: 'E4D4-Secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 5 * 60000 }
}))
app.use(passport.initialize())
app.use(cookieAuth('authtoken'));


app.use((req, res, next) => {
    req.session = req.session
    next()
})

app.get('/sites/e4d4/', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        // console.log('user', user)
        res.render(`index`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/businessdetails', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        res.render(`businessdetails`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/businessregistration', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (business) {
            return res.redirect('/sites/e4d4/edit/profile')
        }
        res.render(`businessregistration`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/dashboard-main', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (!user) {
            return res.redirect(`/sites/e4d4/join`)
        }
        res.render(`dashboard-2`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/dashboard', async (req, res) => {
    try {
        const { error, message, title, location, industry, position } = req.query
        const user = req.user
        const business = req.business
        if (user) {
            let filter = {}
            if (title) {
                filter.fullName = { $regex: title, $options: 'i' }
            }
            if (location) {
                filter.location = { $regex: location, $options: 'i' }
            }
            if (industry) {
                filter.industry = { $regex: industry, $options: 'i' }
            }
            if (position) {
                let positionsId = []
                const jobs = await Job.find({
                    $or: [
                        { title: { $regex: position, $options: 'i' } },
                        { skills: { $regex: position, $options: 'i' } },
                        { position: { $regex: position, $options: 'i' } }
                    ]
                })
                jobs.map(item => {
                    positionsId.push(item.company.toString())
                })
                filter._id = positionsId
            }
            const companies = Object.entries(filter).length > 0 ? await Business.find(filter).populate('jobs').exec() : []
            const requested = await Connection.find({ user: user._id, approved: false }).populate('business').populate({
                path: 'business',
                populate: { path: 'jobs' }
            })
            .select('business');
            const connected = await Connection.find({ user: user._id, approved: true }).populate('business').populate({
                path: 'business',
                populate: { path: 'jobs' }
            })
            .select('business');
            return res.render(`dashboard`, { message, error, user, business, companies, filter, requested, connected })
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        return res.redirect(`/sites/e4d4/join`)
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/connection-request', async (req, res) => {
    try {
        const { error, message, company } = req.query
        const user = req.user
        const business = req.business
        const companyObj = await Business.findById(company)
        if (!companyObj) {
            res.redirect(`/sites/e4d4/dashboard?error=Company Not Found`)
        }
        if (user) {
            // const jobs = await Job.find()
            // console.log('companyObj', companyObj)
            const companies = await Business.find().populate('jobs').exec()
            return res.render(`connection-request`, { message, error, user, business, companies, companyObj, calculateYearsDifference })
        }
        return res.redirect(`/sites/e4d4/join`)
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/join', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (user) {
            return res.redirect(`/sites/e4d4/dashboard`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        return res.render(`join`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/user-loginemail', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (user) {
            return res.redirect(`/sites/e4d4/profile`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        res.render(`user-loginemail`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/reset-password', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (user) {
            return res.redirect(`/sites/e4d4/profile`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        res.render(`reset-password`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/business-reset-password', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (user) {
            return res.redirect(`/sites/e4d4/profile`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        res.render(`business-reset-password`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/business-otp-verification', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        const token = jwt.verify(req.cookies['businesscodepass'], JWT_SECRET)
        const otpBusinessId = token.business
        const otpObjId = token.otp
        if (user) {
            return res.redirect(`/sites/e4d4/profile`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        if (otpObjId && otpBusinessId) {
            return res.render(`business-otp-verification`, { message, error, user, business })
        }
        return res.redirect(`/sites/e4d4/business-reset-password?error=Session Expired`)
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/business-reset-password?error=Session Expired`)
        // return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/business-update-password', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        const token = jwt.verify(req.cookies['businesscodepass'], JWT_SECRET)
        const otpBusinessId = token.business
        const otpObjId = token.otp
        // console.log('otpObjId', otpObjId)
        // console.log('otpUserId', otpBusinessId)
        if (user) {
            return res.redirect(`/sites/e4d4/profile`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        if (otpObjId && otpBusinessId) {
            return res.render(`business-update-password`, { message, error, user, business })
        }
        return res.redirect(`/sites/e4d4/business-reset-password?error=Session Expired`)
    } catch (error) {
        console.log(error)
        // return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
        return res.redirect(`/sites/e4d4/business-reset-password?error=Session Expired`)
    }
})
app.get('/sites/e4d4/otp-verification', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        const token = jwt.verify(req.cookies['codepass'], JWT_SECRET)
        const otpUserId = token.user
        const otpObjId = token.otp
        if (user) {
            return res.redirect(`/sites/e4d4/profile`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        if (otpObjId && otpUserId) {
            return res.render(`otp-verification`, { message, error, user, business })
        }
        return res.redirect(`/sites/e4d4/reset-password?error=Session Expired`)
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/reset-password?error=Session Expired`)
    }
})
app.get('/sites/e4d4/update-password', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        const token = jwt.verify(req.cookies['codepass'], JWT_SECRET)
        const otpUserId = token.user
        const otpObjId = token.user
        // console.log('otpObjId', otpObjId)
        // console.log('otpUserId', otpUserId)
        if (user) {
            return res.redirect(`/sites/e4d4/profile`)
        }
        if (business) {
            return res.redirect(`/sites/e4d4/business-dashboard`)
        }
        if (otpObjId && otpUserId) {
            return res.render(`update-password`, { message, error, user, business })
        }
        return res.redirect(`/sites/e4d4/reset-password?error=Session Expired`)
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/profile', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (user) {
            return res.render(`profile`, { message, error, user, business, extractDomain, calculateYearsDifference })
        }
        if (business) {
            // console.log('business', business.notifications)
            const jobs = await Job.find({ company: business._id })
            return res.render(`business-profile`, { message, error, user, business, extractDomain, calculateYearsDifference, jobs })
        }
        res.redirect('/sites/e4d4/join')
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/business/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        const company = await Business.findById(id)
        const jobs = await Job.find({ company: company._id })
        return res.render(`business-public`, { message, error, user, business, extractDomain, calculateYearsDifference, jobs, company })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/edit/profile', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (user) {
            return res.render(`edit-profile`, { message, error, user, business, extractDomain, calculateYearsDifference })
        }
        if (business) {
            const jobs = await Job.find({ company: business._id })
            return res.render(`edit-business-profile`, { message, error, user, business, jobs, extractDomain, calculateYearsDifference, formatDate })
        }
        return res.redirect(`/sites/e4d4/join`)
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/user-login', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (user) {
            return res.redirect(`/sites/e4d4/profile`)
        }
        res.render(`user-login`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/business-login', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (business) {
            return res.redirect('/sites/e4d4/business-dashboard')
        }
        res.render(`business-login`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/portfolioreg', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user || req.session?.passport?.user
        const business = req.business
        res.render(`portfolioreg`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/profilepicture', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (!user) {
            return res.redirect(`/sites/e4d4/join`)
        }
        res.render(`profilepicture`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/business-subscription', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (!business) {
            return res.redirect(`/sites/e4d4/business-login`)
        }
        res.render(`business-subscription`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/connection/request/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { error, message } = req.query
        const user = req.user
        const business = req.business

        const businessObj = await Business.findById(business._id)

        businessObj.notifications?.forEach((notification) => {
            if (notification.relatedId == id) {
                notification.isRead = true
            }
        })

        await businessObj.save()

        const connection = await Connection.findById(id).populate('user').populate('business')
        if (connection) {
            // console.log('connection', connection)
            // console.log('business._id', business._id)
            // console.log('connection.business._id', connection.business._id)
            if (connection.business._id.toString() == business._id.toString()) {
                if (connection.approved) {
                    return res.redirect(`/sites/e4d4/connected-profile/${connection._id}`)
                }
                return res.render(`requested-profile`, { message, error, user, business, connection, calculateYearsDifference })
            }

            return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)

        }
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    } catch (error) {
        console.log('error on requested profile Page', error.message)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/connected-profile/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { error, message } = req.query
        const user = req.user
        const business = req.business

        const businessObj = await Business.findById(business._id)

        businessObj.notifications?.forEach((notification) => {
            if (notification.relatedId == id) {
                notification.isRead = true
            }
        })

        await businessObj.save()

        const connection = await Connection.findById(id).populate('user').populate('business')
        if (connection) {
            // console.log('connection', connection)
            // console.log('business._id', business._id)
            // console.log('connection.business._id', connection.business._id)
            if (connection.business._id.toString() == business._id.toString()) {
                if (connection.approved) {
                    return res.render(`requested-profile`, { message, error, user, business, connection, calculateYearsDifference })
                }
                return res.redirect(`/sites/e4d4/connection/request/${connection._id}`)
            }

            return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)

        }
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    } catch (error) {
        console.log('error on requested profile Page', error.message)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/business-dashboard', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        // console.log('business', business)
        if (!business) {
            return res.redirect(`/sites/e4d4/business-login`)
        }
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const itemsPerPage = 9;
        const skipItems = (currentPage - 1) * itemsPerPage;
        // console.log('currentPage', currentPage)
        // console.log('skipItems', skipItems)
        const allUsers = await User.find().skip(skipItems).limit(itemsPerPage);
        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / itemsPerPage);
        // console.log('totalPages', totalPages)
        const jobs = await Job.find({ company: business._id }).populate('company')
        const connections = await Connection.find({ business: business._id, approved: true }).populate('user')
        res.render(`business-dashboard`, { message, error, user, business, allUsers, currentPage, totalPages, totalUsers, jobs, connections })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/searchprofilehistory', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (!user) {
            return res.redirect(`/sites/e4d4/join`)
        }
        res.render(`searchprofilehistory`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/userregistration', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        res.render(`userregistration`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.get('/sites/e4d4/jobposting', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        if (!business) {
            res.redirect(`/sites/e4d4/join`)
            return
        }
        res.render(`jobposting`, { message, error, user, business })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/jobdetails/:id', async (req, res) => {
    try {
        const { error, message } = req.query
        const id = req.params.id
        const user = req.user
        const business = req.business
        const job = await Job.findById(id).populate('company')
        res.render(`jobdetails`, { message, error, user, business, job, formatDate })
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/editjob/:id', async (req, res) => {
    try {
        const { error, message } = req.query
        const id = req.params.id
        const user = req.user
        const business = req.business
        const job = await Job.findById(id).populate('company')
        if (job?.company?._id.toString() == business?._id.toString()) {
            return res.render(`jobedit`, { message, error, user, business, job, formatDate })
        }
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})
app.get('/sites/e4d4/chat', async (req, res) => {
    try {
        const { error, message } = req.query
        const user = req.user
        const business = req.business
        const recipentUser = req.query.user
        const recipentBusiness = req.query.business

        let availableList = []
        let recipent
        if (!user && !business) {
            return res.redirect(`/sites/e4d4/join?error=Login to Chat`)
        }
        if (user) {
            const connections = await Connection.find({ user: user._id }).populate('business')
            for (let item of connections) {
                const unreadMessages = await Chat.find({ recipent: item._id, isRead: false })
                const lastMessage = await Chat.findOne({
                    $or: [
                        { sender: user._id, recipient: item.business._id },
                        { sender: item.business._id, recipient: user._id }
                    ]
                }).sort({ createdAt: -1 });
                availableList.push({ ...item.business.toObject(), unreadMessages, lastMessage })
            }
            recipent = await Business.findById(recipentBusiness)
        } else if (business) {
            const connections = await Connection.find({ business: business._id }).populate('user')
            for (let item of connections) {
                const unreadMessages = await Chat.find({ recipent: item._id, isRead: false })
                const lastMessage = await Chat.findOne({
                    $or: [
                        { sender: business._id, recipient: item.user._id },
                        { sender: item.user._id, recipient: business._id }
                    ]
                }).sort({ createdAt: -1 });
                availableList.push({ ...item.user.toObject(), unreadMessages, lastMessage })
            }
            recipent = await User.findById(recipentUser)
        }
        const conversation = await Chat.find({
            $or: [
                {
                    sender: recipentUser ? recipentUser : user?._id,
                    senderModel: 'user',
                    recipient: business?._id ? business?._id : recipentBusiness,
                    recipientModel: 'business'
                },
                {
                    sender: recipentBusiness ? recipentBusiness : business?._id,
                    senderModel: 'business',
                    recipient: user?._id ? user?._id : recipentUser,
                    recipientModel: 'user'
                }
            ]
        }).populate('recipient').populate('sender').sort('timestamp'); // Sort by timestamp to get the conversation in order
        for (let message of conversation) {
            message.isRead = true;
            await message.save();
        }
        res.render(`chat`, { message, error, user, business, conversation, recipent, availableList })

    } catch (error) {
        console.log(error)
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    }
})

app.use('/sites/e4d4/api', require('./controller/apihandler'))

io.on('connection', socket => {
    try {
        console.log("Client Connected")
        socket.on('joinRoom', (data) => {
            const { id, model } = data; // `id` could be userId or businessId
            const room = `${model}_${id}`; // E.g., 'user_123', 'business_456'
            socket.join(room);
            console.log(`${model} with ID: ${id} joined room: ${room}`);
        });
        socket.on('sendMessage', async (data) => {
            try {
                const { sender, senderModel, recipient, recipientModel, message } = data;

                const newMessage = new Chat({
                    sender,
                    senderModel,
                    recipient,
                    recipientModel,
                    message
                });

                await newMessage.save();

                const recipientRoom = `${recipientModel}_${recipient}`; // E.g., 'user_123' or 'business_456'
                io.to(recipientRoom).emit('newMessage', newMessage);
                // io.emit('newMessage', newMessage);
            } catch (error) {
                console.log('error sending Message', error.message)
            }
        });
        socket.on('disconnect', async () => {
            try {
                console.log("client Disconnected")
            } catch (error) {
                console.log(error.message)
            }
        });

    } catch (error) {
        console.log(error.message)
    }
});
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/sites/e4d4`);
});