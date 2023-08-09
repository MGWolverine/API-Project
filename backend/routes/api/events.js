const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, Venue, Event, sequelize, Attendance, EventImage, User } = require('../../db/models');
const attendance = require('../../db/models/attendance');

const validateEvents = [
  check('venueId')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Venue does not exist'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({min: 5})
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage('Type must be Online or In person'),
  check('capacity')
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Price is invalid'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required'),
  check('startDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isAfter(new Date().toString())
    .withMessage('Start date must be in the future'),
  check('endDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('End date is less than start date'),
  handleValidationErrors,
];


const router = express.Router();

// Get all Events*

router.get('/', async (req, res) => {
  const {page = 1, size = 20, name, type, startDate} = req.query;

  const filter = {}

  if (name) {
    filter.name = name;
  }

  if (type) {
    filter.type = type;
  }

  if (startDate) {
    filter.startDate = startDate;
  }

  const events = await Event.findAndCountAll({
    where: filter,
    offset: (page - 1) * size,
    limit: size,
    include: [
      {
        model: EventImage,
      },
      {
        model: Attendance
      },
      {
        model: Group,
        attributes: [
          'id',
          'name',
          'city',
          'state',
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
  let eventsList = [];

  events.rows.forEach(event => {
    const eventJson = event.toJSON();
    eventJson.numAttending = eventJson.Attendances.length;

    eventJson.EventImages.forEach(image => {
      if (image.preview === true) {
        eventJson.previewImage = image.url;
      }
    });

    delete eventJson.EventImages;
    delete eventJson.Attendances;

    eventsList.push(eventJson);
  });

  const totalEvents = events.count;
  const totalPages = Math.ceil(totalEvents / size);

  res.status(200).json({Events: eventsList});
});



// Get details of an Event specified by its id*

router.get('/:eventId', async (req, res) => {
  const eventId = req.params.eventId
  const event = await Event.findByPk(eventId, {
  include: [
    {
      model: Attendance,
      where: {
        status: 'attending'
      }
    },
    {
      model: Group,
      attributes: [
        'id',
        'name',
        'private',
        'city',
        'state'
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

let response = event.toJSON()

response.numAttending = response.Attendances.length;

delete response.Attendances

res.status(200).json(response);

})


// Edit an Event specified by its id

router.put('/:eventId', requireAuth, async (req,res) => {
  const {eventId} = req.params;
  const {
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate
  } = req.body;

  if(!eventId) {
    return res.status(404).json({message: "Event couldn't be found"})
  }

  if(!venueId) {
    return res.status(404).json({message: "Venue couldn't be found"})
  }

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({message: "Event couldn't be found"})
  }

  event.venueId = venueId
  event.name = name;
  event.type = type;
  event.capacity = capacity;
  event.price = price;
  event.description = description;
  event.startDate = startDate;
  event.endDate = endDate

  await event.save();

  res.status(200).json({
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate
  })
})

// Add an Image to a Event based on the Event's id

router.post('/:eventId/images', requireAuth, async (req, res) => {
  const {eventId} = req.params;
  const {url, preview} = req.body;

  const event = await Event.findByPk(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const image = await EventImage.create({
    eventId: event.id,
    url,
    preview
  })

  res.status(200).json({
    id: image.id,
    url: image.url,
    preview: image.preview,
  })
})

// Delete an Event specified by its id

router.delete('/:eventId', requireAuth, async (req, res) => {
  const eventId = req.params.eventId;

  const event = await Event.findByPk(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  await event.destroy()

  res.status(200).json({ message: 'Successfully deleted' });
})

//Get all Attendees of an Event specified by its id

router.get('/:eventId/attendees', async(req, res) => {
  const eventId = req.params.eventId;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }
  const attendee = await Attendance.findAll({
    where: {
      eventId: eventId
    },
    include: [
      {
        model: User,
        attributes: [
          'id', 'firstName', 'lastName'
        ],
      }
    ],
    attributes: {
      exclude: [
        'id', 'eventId', 'updatedAt', 'createdAt'
      ]
    }
  })


  res.status(200).json({ Attendees: attendee })
})

// Request to Attend an Event based on the Event's id

router.post('/:eventId/attendance', requireAuth, async(req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const attendance = await Attendance.create({
    eventId,
    userId,
    status: 'pending'
  });

  res.status(200).json(attendance);
})

// Change the status of an attendance for an event specified by id

router.put('/:eventId/attendance', requireAuth, async(req, res) => {
  const eventId = req.params.eventId;
  const userId = req.params.userId;
  const status = req.params.body;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  if (status === "pending") {
    return res.status(400).json({ message: "Cannot change an attendance status to pending" });
  }

  const attendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: userId
    }
  });

  if (!attendance) {
    return res.status(404).json({ message: "Attendance between the user and the event does not exist" });
  }

  attendance.status = status;
  await attendance.save();

  res.status(200).json(attendance);
})

// Delete attendance to an event specified by id

router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
  const eventId = req.params.eventId;

  const event = await Event.findByPk(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  await event.destroy()

  res.status(200).json({ message: 'Successfully deleted' });
})

module.exports = router;