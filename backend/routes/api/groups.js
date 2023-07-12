const express = require('express');

const { Group } = require('../../db/models');
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

router.get('/', async (req, res) => {
        const groups = await Group.findAll({
            attributes: [
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
                    '(SELECT COUNT(*) FROM GroupMembers WHERE GroupMembers.groupId = Group.id)'
                    ),
                 'numMembers'
                ],
                'previewImage'
            ],
        });
        res.status(200).json(groups);
    }
);

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

module.exports = router;