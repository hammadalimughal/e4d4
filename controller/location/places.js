const express = require('express')
const router = express.Router()
// const yourhandle = require('countrycitystatejson')
const ausCities = require('../../data/austrailian-cities')

router.post('/fetch', (req, res) => {
    try {
        const { place } = req.body
        console.log('place', place)
        // res.json(allAustrialianPlaces)
        // return
        let availablePlaces = []
        ausCities.forEach((city) => {
            if (city.city.toLowerCase().includes(place.toLowerCase())) {
                availablePlaces.push(city)
            }
        })
        console.log('availablePlaces', availablePlaces)
        res.json(availablePlaces)
    } catch (error) {
        console.log(error)
        res.json({
            error: error.message
        })
    }
})

module.exports = router