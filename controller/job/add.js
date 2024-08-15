const express = require('express');
const router = express.Router();
const Business = require('../../schema/Business')
const Job = require('../../schema/Job')

router.post('/', async (req, res) => {
    try {
        const { company, title, summary, responsiblities, education, skills, experience, certification, position, industry, location, jobType, benefits, salary, workScheduled, applicationPosted, applicationDeadline, applicationInstruction, requiredDocuments, contactPerson, contactNumber, additionalInfo, agreeTerms } = req.body
        console.log(req.body)
        let errors = []
        const business = await Business.findById(company)
        if (!business) {
            return res.status(422).redirect('/sites/e4d4/jobposting?error=You Should LoggedIn as a Company to post A Job Application')
        }
        if (errors.length == 0) {
            const job = await Job.create({ company, title, summary, responsiblities: responsiblities.split('\n'), education, skills: skills.split('\n'), experience, certification, position, industry, location, jobType, benefits: benefits.split('\n'), salary, workScheduled, applicationPosted, applicationDeadline, applicationInstruction, requiredDocuments: requiredDocuments.split('\n'), contactPerson, contactNumber, additionalInfo, agreeTerms })
            if (job) {
                return res.status(200).redirect(`/sites/e4d4/jobdetails/${job._id}?message=Job Posted Successfully`)
            } else {
                return res.status(409).redirect('/sites/e4d4?error=Something Went Wrong')
            }
        }
        else {
            console.log(req.body)
            return res.status(422).redirect('/sites/e4d4/jobposting?error=' + JSON.stringify(errors))
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(422).redirect('/sites/e4d4/jobposting?error=' + err.message)
    }
})

module.exports = router