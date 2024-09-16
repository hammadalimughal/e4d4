const jwt = require('jsonwebtoken');
const JWT_SECRET = "E4d4U$er";
const User = require("../schema/User");
const Business = require("../schema/Business");

const cookieAuth = (cookieName) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        try {
            const cookieAuthtoken = req.cookies[cookieName];
            if (cookieAuthtoken) {
                const tokenUser = jwt.verify(cookieAuthtoken, JWT_SECRET);
                const dbUser = await User.findById(tokenUser.id).populate('projects').populate('connection').lean();

                if (dbUser) {
                    const { _id, primaryEmail } = dbUser;
                    const user = {
                        id: _id, ...dbUser
                    };
                    const authtoken = jwt.sign({ id: _id, primaryEmail }, JWT_SECRET);
                    res.cookie('authtoken', authtoken);
                    req.user = user;
                    // console.log('user', user)
                    return next(); // Stop further execution by returning
                }

                const dbBusiness = await Business.findById(tokenUser.id).lean();
                if (dbBusiness) {
                    const { _id } = dbBusiness;
                    const business = { id: _id, ...dbBusiness };
                    req.business = business;
                    return next(); // Stop further execution by returning
                }
            }
            next();
        } catch (err) {
            console.log(err.message);
            next(err); // Pass the error to the next middleware
        }
    };
}

module.exports = cookieAuth;
