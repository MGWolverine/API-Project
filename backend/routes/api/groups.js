const express = require('express');

const { Op } = require('sequelize');

const { Group, sequelize, GroupImage, User, Venue, Membership, Event, Attendance, EventImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const venue = require('../../db/models/venue');

const validateGroups = [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 60 })
      .withMessage('Name must be 60 characters or less'),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage('About must be 50 characters or more'),
    check('type')
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .exists({ checkFalsy: true })
      .isBoolean()
      .withMessage('Private must be a boolean'),
    check('city')
       .exists({ checkFalsy: true })
       .isLength({ min: 1 })
       .withMessage('City is required'),
    check('state')
       .exists({ checkFalsy: true })
       .isLength({ min: 1 })
       .withMessage('State is required'),
    handleValidationErrors
  ];

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

//Get all Groups*

router.get('/', requireAuth, async (req, res) => {
        const groups = await Group.findAll({
          include: [
            {
              model: Membership
            },
            {
              model: GroupImage
            }
          ],
          attributes:[
              'id',
              'organizerId',
              'name',
              'about',
              'type',
              'private',
              'city',
              'state',
              'createdAt',
              'updatedAt',
            ]
        });
        let groupsList = [];
        groups.forEach(group => {
          groupsList.push(group.toJSON())
        });
        groupsList.forEach(group => {
          group.numMembers = group.Memberships.length
          group.GroupImages.forEach(image => {
            if (image.preview === true) {
              group.previewImage = image.url
            }
            delete group.GroupImages
            delete group.Memberships
          })
        })

        res.status(200).json({Groups: groupsList});
    }
);

//Get all Groups joined or organized by the Current User*

router.get('/current', requireAuth, async (req, res) => {
        const userId = req.user.id;
        const groups = await Group.findAll({
          include: [
            {
              model: Membership
            },
            {
              model: GroupImage
            }
          ],
          attributes:[
              'id',
              'organizerId',
              'name',
              'about',
              'type',
              'private',
              'city',
              'state',
              'createdAt',
              'updatedAt',
            ],
            where: {
              [Op.or]: [
                {organizerId: userId},
              ]
            }
        });
        let groupsList = [];
        groups.forEach(group => {
          groupsList.push(group.toJSON())
        });
        groupsList.forEach(group => {
          group.numMembers = group.Memberships.length
          group.GroupImages.forEach(image => {
            if (image.preview === true) {
              group.previewImage = image.url
            }
            delete group.GroupImages
            delete group.Memberships
          })
        })
        res.status(200).json({Groups: groupsList});
    }
);

//Get details of a Group from an id*

router.get('/:groupId', async (req,res) => {
  const groupId = req.params.groupId;

  const group = await Group.findByPk(groupId, {
    include: [
      {
        model: Membership
      },
      {
        model: GroupImage,
        attributes: [
          'id', 'url', 'preview'
        ],
      },
      {
        model: User,
        as: 'Organizer',
        attributes: [
          'id', 'firstName', 'lastName'
        ],
      },
      {
        model: Venue,
        attributes: [
          'id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'
        ],
      }
    ]
  })
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const groupData = group.toJSON();
  groupData.numMembers = groupData.Memberships.length
  delete groupData.Memberships

  res.status(200).json(groupData);
})

//Creates and returns a new group.*

router.post('/', validateGroups, requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const UserID = req.user.id;

    try {
      const createdGroup = await Group.create({
        organizerId: UserID,
        name,
        about,
        type,
        private,
        city,
        state,
      });

      res.status(201).json(createdGroup);
    } catch (error) {
      res.status(400).json({ message: 'Bad Request', error });
    }
  });

//Create and return a new image for a group specified by id.*

router.post('/:groupId/images', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const { url, preview } = req.body;

  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const image = await GroupImage.create({
    groupId: group.id,
    url,
    preview,
  });

  res.status(200).json({
    id: image.id,
    url: image.url,
    preview: image.preview,
  });
});

// Updates and returns an existing group.*

router.put('/:groupId',validateGroups, requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const { name, about, type, private, city, state } = req.body;

  const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (group.organizerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    group.name = name;
    group.about = about;
    group.type = type;
    group.private = private;
    group.city = city;
    group.state = state;
    await group.save();

    res.status(200).json({
      id: group.id,
      organizerId: group.organizerId,
      name: group.name,
      about: group.about,
      type: group.type,
      private: group.private,
      city: group.city,
      state: group.state,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    });
})

//Deletes an existing group.*

router.delete('/:groupId', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;

  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  if (group.organizerId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await group.destroy();

  res.status(200).json({ message: 'Successfully deleted' });
})

// Create a new Venue for a Group specified by its id*

router.post('/:groupId/venues',validateVenues, requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const { address, city, state, lat, lng } = req.body;

  const group = await Venue.findByPk(groupId);
  console.log(group)
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const userId = req.user.id;
  const membership = await Membership.findOne({
    where: {
      groupId,
      userId,
      status: 'co-host'
    }
  });

  if (!membership && group.ownerId !== userId) {
    return res.status(403).json({ message: "You are not authorized to create a venue for this group." });
  }

  const venue = await Venue.create({
    groupId,
    address,
    city,
    state,
    lat,
    lng
  });


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

// Get All Venues for a Group specified by its id*

router.get('/:groupId/venues', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const userId = req.user.id;
  const membership = await Membership.findOne({
    where: {
      groupId,
      userId,
      status: 'co-host'
    }
  });

  if (!membership && group.ownerId !== userId) {
    return res.status(403).json({ message: "You are not authorized to view venues for this group." });
  }

  const venues = await Venue.findAll({
    where: {
      groupId
    },
    attributes: [
      'id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'
    ]
  });

  res.status(200).json({ Venues: venues });

});

// Get all Events of a Group specified by its id*

router.get('/:groupId/events', async (req, res) => {
  const groupId = req.params.groupId;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const events = await Event.findAll({
    where: {
      groupId: groupId
    },
    include: [
      {
        model: Attendance
      },
      {
        model: EventImage
      },
      {
        model: Group,
        attributes: ['id', 'name', 'city', 'state'],
      },
      {
        model: Venue,
        attributes: ['id', 'city', 'state'],
      },
    ],
    attributes: {
      exclude: [
        'capacity',
        'price',
        'description',
        'createdAt',
        'updatedAt'
      ],
    },
  });
  let eventsList = [];
        events.forEach(event => {
          eventsList.push(event.toJSON())
        });
        eventsList.forEach(event => {
          event.numAttending = event.Attendances.length
          event.EventImages.forEach(image => {
            if (image.preview === true) {
              event.previewImage = image.url
            }
            delete event.EventImages
            delete event.Attendances
          })
        })


  res.status(200).json({Events: eventsList});
})


// Create an Event for a Group specified by its id*

router.post('/:groupId/events', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
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

  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

    const event = await Event.create({
      groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate
    });

    const {updatedAt, createdAt, ...eventData} = event.toJSON();

    res.status(200).json(eventData);
});

// Get all Members of a Group specified by its id

router.get('/:groupId/members', async (req, res) => {
  const groupId = req.params.groupId;

  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const members = await Membership.findAll({
    where: {
      groupId
    },
    attributes: [
      'status'
    ]
  })

  res.status(200).json(members)
})

//Request a Membership for a Group based on the Group's id

router.post('/:groupId/membership', requireAuth, async(req, res) => {
  const groupId = req.params.groupId;
  console.log(req.params)

  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  // if (status === 'member') {
  //   return res.status(404).json({ message: "User is already a member of the group" });
  // }

  const membership = await Membership.create({
    groupId,
    status: 'pending'
  });

  res.status(200).json(membership)
})

// Change the status of a membership for a group specified by id

router.put('/:groupId/membership', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;

  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const membership = await Membership.findOne({
    where: {
      groupId: groupId,
    }
  });

  if (!membership) {
    return res.status(404).json({ message: "Membership couldn't be found" });
  }

  res.status(200).json(membership);
})

// Delete membership to a group specified by id

router.delete('/:groupId/membership', requireAuth, async(req, res) => {
  const groupId = req.params.groupId;

  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  await group.destroy();

  res.status(200).json({ message: 'Successfully deleted' });
})

module.exports = router;