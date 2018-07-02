const express = require('express');
const Sequelize = require('sequelize');

const router = express.Router();
const { Op } = Sequelize;

const logger = require('../utils/logs');
const { Category } = require('../models');

router.use((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
});

router.get('/', async (req, res) => {
  try {
    const events = await Category
      .findAll({
        attributes: ['title', 'description'],
        where: {
          UserId: {
            [Op.eq]: req.user.id,
          },
        },
        order: [['title', 'ASC']],
      });
    res.json(events);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/add', async (req, res) => {
  try {
    const event = await Category
      .create(Object.assign({ UserId: req.user.id }, req.body));
    res.json(event);
  } catch (err) {
    logger.error(err);
    const message = err.name === 'SequelizeUniqueConstraintError'
      ? 'Category already exist.'
      : err.message;
    res.json({ error: message || err.toString() });
  }
});

router.get('/detail/:id', async (req, res) => {
  try {
    const category = await Category
      .findOne({
        where: {
          id: {
            [Op.eq]: req.params.id,
          },
          UserId: {
            [Op.eq]: req.user.id,
          },
        },
      });
    if (!category) {
      res.json({ message: 'Category not found.' });
    } else {
      res.json(category);
    }
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.delete('/detail/:id', async (req, res) => {
  try {
    await Category
      .destroy({
        where: {
          id: {
            [Op.eq]: req.params.id,
          },
          UserId: {
            [Op.eq]: req.user.id,
          },
        },
      });
    res.json({ message: 'Successfully deleted' });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});


module.exports = router;
