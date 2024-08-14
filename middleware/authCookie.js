const jwt = require('jsonwebtoken');
const JWT_SECRET = "E4d4U$er";
const User = require("../schema/User")
const Business = require("../schema/Business")

const cookieAuth = (cookieName) => {
    return async (req, res, next) => {
        if(req.method !== 'GET'){
            next()
        }
        console.log('req',req)
        try {
            const cookieAuthtoken = req.cookies[cookieName];
            console.log('cookieAuthtoken', cookieAuthtoken)
            if (cookieAuthtoken) {

                const tokenUser = jwt.verify(cookieAuthtoken, JWT_SECRET)
                const dbUser = await User.findById(tokenUser.id)
                const dbBusiness = await Business.findById(tokenUser.id)
                if (dbUser) {
                    const { _id, fullName, primaryEmail, suburb, phone, educationLevel, skills, industryInterest, termsCondition, weeksOfAvailablity, workType, workClassification, preferredJobLocation, positionTypeInterest, salaryExpectation } = dbUser
                    const user = {
                        id: _id, fullName, primaryEmail, suburb, phone, educationLevel, skills, industryInterest, termsCondition, weeksOfAvailablity, workType, workClassification, preferredJobLocation, positionTypeInterest, salaryExpectation
                    }
                    const authtoken = jwt.sign({ id: _id, primaryEmail }, JWT_SECRET);
                    res.cookie('authtoken', authtoken)
                    req.user = user
                    next()
                }
                if (dbBusiness) {
                    const { _id, fullName, address, primaryEmail, phone, password: hashPassword, confirmPassword, location, industry, operatingIndustry, sizeOfCompany, foundedDate, headQuarterLocation, website, companyEmail } = dbBusiness
                    const business = {
                        id: _id, fullName, address, primaryEmail, phone, password: hashPassword, confirmPassword, location, industry, operatingIndustry, sizeOfCompany, foundedDate, headQuarterLocation, website, companyEmail
                    }
                    req.business = business
                    next()
                }
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