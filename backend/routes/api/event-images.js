const express = require('express');

const { Group, Venue, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');


const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId;

    const image = await EventImage.findByPk(imageId);

    if (!image) {
        return res.status(404).json({ message: "Event Image couldn't be found" });
    }

    await image.destroy();

    res.status(200).json({ message: "Successfully deleted" });
})

module.exports = router;