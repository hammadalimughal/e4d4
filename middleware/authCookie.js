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
                const dbUser = await User.findById(tokenUser.id);

                if (dbUser) {
                    const { _id, fullName, primaryEmail, suburb, phone, educationLevel, skills, industryInterest, termsCondition, weeksOfAvailablity, workType, workClassification, preferredJobLocation, positionTypeInterest, salaryExpectation, createdAt, updatedAt, jobTitle, subHeading, about, projects,linkedin } = dbUser;
                    const user = {
                        id: _id, fullName, primaryEmail, suburb, phone, educationLevel, skills, industryInterest, termsCondition, weeksOfAvailablity, workType, workClassification, preferredJobLocation, positionTypeInterest, salaryExpectation, createdAt, updatedAt, jobTitle, subHeading, about, projects,linkedin
                    };
                    const authtoken = jwt.sign({ id: _id, primaryEmail }, JWT_SECRET);
                    res.cookie('authtoken', authtoken);
                    req.user = user;
                    console.log('user',user)
                    return next(); // Stop further execution by returning
                }

                const dbBusiness = await Business.findById(tokenUser.id);
                if (dbBusiness) {
                    const { _id, fullName, address, primaryEmail, phone, password: hashPassword, confirmPassword, location, industry, operatingIndustry, sizeOfCompany, foundedDate, headQuarterLocation, website, companyEmail } = dbBusiness;
                    const business = {
                        id: _id, fullName, address, primaryEmail, phone, password: hashPassword, confirmPassword, location, industry, operatingIndustry, sizeOfCompany, foundedDate, headQuarterLocation, website, companyEmail
                    };
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
