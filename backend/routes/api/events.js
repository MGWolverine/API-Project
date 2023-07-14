const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, Venue, Event, sequelize, Attendance, EventImage } = require('../../db/models');
const attendance = require('../../db/models/attendance');


const router = express.Router();


router.get('/', async (req, res) => {
    const events = await Event.findAll({
        include: [
          {
            model: Group,
            attributes: [
              'id',
              'name',
              'city',
              'state',
              [sequelize.literal(
                  '(SELECT COUNT(*) FROM Groups WHERE Groups.id = `Group`.id)'
                  ),
                'numAttending'
                ],
            ]
          },
          {
            model: Venue,
            attributes: [
              'id',
              'city',
              'state'
            ]
          }
        ],
        attributes: {
          exclude: [
            'capacity',
            'price',
            'description',
            'createdAt',
            'updatedAt'
          ]
        }
    });
    // let eventsList = [];
    //     events.forEach(event => {
    //       eventsList.push(event.toJSON())
    //     });
    //     eventsList.forEach(event => {
    //       event.GroupImages.forEach(image => {
    //         if (image.preview === true) {
    //           event.previewImage = image.url
    //         }
    //         delete event.GroupImages
    //       })
    //     })

  res.status(200).json({ Events: events });
});

router.get('/:eventId', async (req, res) => {
  const {eventId} = req.params;

  const event = await Event.findByPk(eventId, {
    include: [
      {
        model: Group,
        attributes: [
          'id',
          'name',
          'private',
          'city',
          'state',
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Groups WHERE Groups.id = `Group`.id)'
            ),
          'numAttending'
          ],
        ],
      },
      {
        model: Venue,
        attributes: [
          'id',
          'address',
          'city',
          'state',
          'lat',
          'lng'
        ],
      },
      {
        model: EventImage,
        attributes: [
          'id',
          'url',
          'preview'
        ],
      },
    ],
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt'
      ],
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }


  res.status(200).json(event);

})


module.exports = router;