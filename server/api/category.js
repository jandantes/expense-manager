const express = require('express');
const Sequelize = require('sequelize');

const router = express.Router();
const { Op } = Sequelize;

const error = require('../utils/error');
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
    const errorMessage = error.generateMessage(err, 'Category');
    res.json({ error: errorMessage || err.toString() });
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
    const message = !category ? { error: 'Category not found.' } : category;
    res.json(message);
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Category');
    res.json({ error: errorMessage || err.toString() });
  }
});

router.delete('/detail/:id', async (req, res) => {
  try {
    const category = await Category
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

    const message = !category ? 'Category not found.' : 'Successfully deleted';
    res.json({ error: message });
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Category');
    res.json({ error: errorMessage || err.toString() });
  }
});


module.exports = router;
