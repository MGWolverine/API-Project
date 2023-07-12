const express = require('express');

const { Op } = require('sequelize');

const { Group, sequelize, GroupImage, User, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
        const groups = await Group.findAll({
          include: [
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
              [sequelize.literal(
                  '(SELECT COUNT(*) FROM Groups WHERE Groups.id = `Group`.id)'
                  ),
                'numMembers'
              ],
            ]
        });
        let groupsList = [];
        groups.forEach(group => {
          groupsList.push(group.toJSON())
        });
        groupsList.forEach(group => {
          group.GroupImages.forEach(image => {
            if (image.preview === true) {
              group.previewImage = image.url
            }
            delete group.GroupImages
          })
        })

        res.status(200).json({Groups: groupsList});
    }
);


router.get('/current', requireAuth, async (req, res) => {
        const userId = req.user.id;
        const groups = await Group.findAll({
          include: [
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
              [sequelize.literal(
                  '(SELECT COUNT(*) FROM Groups WHERE Groups.id = `Group`.id)'
                  ),
                'numMembers'
              ],
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
          group.GroupImages.forEach(image => {
            if (image.preview === true) {
              group.previewImage = image.url
            }
            delete group.GroupImages
          })
        })
        res.status(200).json({Groups: groupsList});
    }
);


router.get('/:groupId', async (req,res) => {
  const {groupId} = req.params;

  const group = await Group.findByPk(groupId, {
    include: [
      {
        model: GroupImage,
        attributes: ['id', 'url', 'preview'],
      },
      {
        model: User,
        as: 'Organizer',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: Venue,
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
      }
    ]
  })
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const groupData = group.toJSON();

  res.status(200).json(groupData);
})
// router.get('/', async (req, res) => {
//         const groups = await Group.findAll({
//             attributes: [
                // 'id',
                // 'organizerId',
                // 'name',
                // 'about',
                // 'type',
                // 'private',
                // 'city',
                // 'state',
                // 'createdAt',
                // 'updatedAt',
                // [sequelize.literal(
                //     '(SELECT COUNT(*) FROM Groups WHERE Groups.id = `Group`.id)'
                //     ),
                //  'numMembers'
                // ],
//                 'previewImage'
//             ],
//         });
//         res.status(200).json(groups);
//     }
// );

router.post('/', validateGroups, requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const UserID = req.user.id;

    // const errors = {};
    // if (!name || name.length > 60) {
    //   errors.name = 'Name must be 60 characters or less';
    // }
    // if (!about || about.length < 50) {
    //   errors.about = 'About must be 50 characters or more';
    // }
    // if (type !== 'Online' && type !== 'In person') {
    //   errors.type = "Type must be 'Online' or 'In person'";
    // }
    // if (typeof private !== 'boolean') {
    //   errors.private = 'Private must be a boolean';
    // }
    // if (!city) {
    //   errors.city = 'City is required';
    // }
    // if (!state) {
    //   errors.state = 'State is required';
    // }
    // if (Object.keys(errors).length > 0) {
    //     return res.status(400).json({
    //       message: 'Bad Request',
    //       errors,
    //     });
    //   }

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

router.post('/:groupId/images', requireAuth, async (req, res) => {
  const { groupId } = req.params;
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

router.put('/:groupId',validateGroups, requireAuth, async (req, res) => {
  const { groupId } = req.params;
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

router.delete('/:groupId', requireAuth, async (req, res) => {
  const {groupId} = req.params;

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

router.get('/:groupId/venues', requireAuth, async (req, res) => {
  const group = await Venue.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }


  res.status(200).json({ Venues: venues });
})

module.exports = router;