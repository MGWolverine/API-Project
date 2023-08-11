const express = require('express');

const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, Venue, Event, sequelize, Attendance, EventImage, User, Membership } = require('../../db/models');
const attendance = require('../../db/models/attendance');
const { query } = require('express');

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

const validateQueryParameters = [
  check("page")
    .optional()
    .isInt({ min: 1 }, { max: 10 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be between 1 and 20"),
  check("name").optional().isString().withMessage("Name must be a string"),
  check("type")
    .optional()
    .isIn(["Online", "In Person"])
    .withMessage("Type must be 'Online' or 'In Person'"),
  check("startDate")
    .optional()
    .isDate()
    .withMessage("Start date must be a valid datetime"),
  handleValidationErrors,
];

const router = express.Router();

// Get all Events*

router.get('/', validateQueryParameters , async (req, res) => {
  let query = {
    where: {},
  };

  const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
  const size = req.query.size === undefined ? 20 : parseInt(req.query.size);

  if (page >= 1 && size >= 1) {
    query.limit = size;
    query.offset = size * (page - 1);
  }

  const events = await Event.findAndCountAll({
    ...query,
    include: [
      {
        model: EventImage,
      },
      {
        model: Attendance,
        as: 'Attendances'
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
  res.status(200).json({Events: eventsList});
});



// Get details of an Event specified by its id*

router.get('/:eventId', async (req, res) => {
  const eventId = req.params.eventId
  const event = await Event.findByPk(eventId, {
  include: [
    {
      model: Attendance,
      as: 'Attendances',
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

  const event = await Event.findByPk(eventId, {
    include: {
      model: Group,
      include: Membership,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const checkAuth = event.Group.organizerId === req.params.userId ||
    event.Group.Memberships.some(
      membership => membership.userId === req.params.userId && membership.status === "co-host"
    );
  let allAttendees = [];
  if (checkAuth) {
    allAttendees = await User.findAll({
      include: {
        model: Attendance,
        as: "Attendances",
        where: {
          eventId: eventId,
        },
        attributes: ["status"],
      },
      attributes: ["id", "firstName", "lastName"],
    });
  } else {
    allAttendees = await User.findAll({
      include: {
        model: Attendance,
        as: "Attendances",
        where: {
          eventId: eventId,
          status: {
            [Op.not]: "pending",
          },
        },
        attributes: ["status"],
      },
      attributes: ["id", "firstName", "lastName"],
    });
  }

  res.status(200).json({ Attendees: allAttendees })
})

// Request to Attend an Event based on the Event's id

router.post('/:eventId/attendance', requireAuth, async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const existingAttendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: userId,
      status: { [Op.ne]: 'pending' },
    }
  });

  if (existingAttendance) {
    if (existingAttendance.status === 'pending') {
      return res.status(400).json({ message: "Attendance has already been requested" });
    } else {
      return res.status(400).json({ message: "User is already an attendee of the event" });
    }
  }

  const attendance = await Attendance.create({
    eventId: eventId,
    userId: userId,
    status: 'pending'
  });

  res.status(200).json({ userId: attendance.userId, status: attendance.status });
});


// Change the status of an attendance for an event specified by id

router.put('/:eventId/attendance', requireAuth, async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  const { userId: requestedUserId, status } = req.body;

  const event = await Event.findByPk(eventId, {
    include: {
      model: Group,
      include: {
        model: Membership,
      }
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const checkAuth = event.Group.organizerId === userId ||
    event.Group.Memberships.some(
      membership => membership.userId === userId && membership.status === "co-host"
    );

  if (!checkAuth) {
    return res.status(403).json({ message: "Unauthorized: User is not the organizer or co-host" });
  }

  if (status === "pending") {
    return res.status(400).json({ message: "Cannot change an attendance status to pending" });
  }

  const attendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: requestedUserId
    }
  });

  if (!attendance) {
    return res.status(404).json({ message: "Attendance between the user and the event does not exist" });
  }

  attendance.status = status;
  await attendance.save();

  res.status(200).json({ id: attendance.id, eventId: attendance.eventId, userId: attendance.userId, status: attendance.status });
});

// Delete attendance to an event specified by id

router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  const { userId: requestedUserId } = req.body;

  const event = await Event.findByPk(eventId, {
    include: {
      model: Group,
      include: {
        model: Membership,
      }
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const checkAuth = event.Group.organizerId === userId ||
    event.Group.Memberships.some(
      membership => membership.userId === userId && membership.status === "co-host"
    );

  if (!checkAuth && userId !== requestedUserId) {
    return res.status(403).json({ message: "Only the User or organizer may delete an Attendance" });
  }

  const attendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: requestedUserId
    }
  });

  if (!attendance) {
    return res.status(404).json({ message: "Attendance does not exist for this User" });
  }

  await attendance.destroy();

  res.status(200).json({ message: "Successfully deleted attendance from event" });
});

module.exports = router;