const express = require('express');

const { Group, Venue } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateVenues = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('State is required'),
    check('lat')
    .optional()
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .optional()
    .isDecimal()
    .withMessage('Longitude is not valid'),
    handleValidationErrors,
  ];

const router = express.Router();

// Edit a Venue specified by its id

router.put('/:venueId',validateVenues, requireAuth, async (req, res) => {
    const {venueId} = req.params;
    const { address, city, state, lat, lng } = req.body;


    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    const group = await Group.findByPk(venue.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    venue.address = address;
    venue.city = city;
    venue.state = state;
    venue.lat = lat;
    venue.lng = lng;
    await venue.save();

    res.status(200).json({
      id: venue.id,
      groupId: venue.groupId,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      lat: venue.lat,
      lng: venue.lng
    });
})



module.exports = router;