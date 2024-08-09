const jwt = require('jsonwebtoken');
const JWT_SECRET = "E4d4U$er";
const User = require("../schema/User")

const cookieAuth = (cookieName) => {
    return async (req, res, next) => {
        try {
            const cookieAuthtoken = req.cookies[cookieName];
            console.log('cookieAuthtoken',cookieAuthtoken)
            if (cookieAuthtoken) {

                const tokenUser = jwt.verify(cookieAuthtoken, JWT_SECRET)
                const dbUser = await User.findById(tokenUser.id)
                const { _id, fullName, primaryEmail, suburb, phone, educationLevel, skills, industryInterest, termsCondition, weeksOfAvailablity, workType, workClassification, preferredJobLocation, positionTypeInterest, salaryExpectation } = dbUser
                const user = {
                    id: _id, fullName, primaryEmail, suburb, phone, educationLevel, skills, industryInterest, termsCondition, weeksOfAvailablity, workType, workClassification, preferredJobLocation, positionTypeInterest, salaryExpectation
                }
                const authtoken = jwt.sign({ id: _id, primaryEmail }, JWT_SECRET);
                res.cookie('authtoken', authtoken)
                req.user = user
                next()
            }
            else {
                next()
            }
        }
        catch (err) {
            next()
            console.log(err.message)
        }
    }
}

module.exports = cookieAuth