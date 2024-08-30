const express = require('express')
const router = express.Router()
const yourhandle = require('countrycitystatejson')

router.post('/fetch', (req, res) => {
    try {
        const { place } = req.body
        console.log('place', place)
        const allAustrialianPlaces = yourhandle.getCountryByShort('AU')
        res.json(allAustrialianPlaces)
        return
        let availablePlaces = []
        Object.entries(allAustrialianPlaces.states).forEach(([state, cities]) => {
            console.log('state', state)
            console.log('cities', cities)
            cities.forEach((city) => {
                if (city.name.toLowerCase().includes(place.toLowerCase())) {
                    availablePlaces.push({
                        city,
                        state
                    })
                }
            })
            console.log('availablePlaces', availablePlaces)
        });
        res.json(availablePlaces)
    } catch (error) {
        console.log(error)
        res.json({
            error: error.message
        })
    }
})

module.exports = router