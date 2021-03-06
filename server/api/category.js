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
    const categories = await Category
      .findAll({
        attributes: ['id', 'title', 'description'],
        where: {
          UserId: {
            [Op.eq]: req.user.id,
          },
        },
        order: [['title', 'ASC']],
      });
    res.json(categories);
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Category');
    res.json({ error: errorMessage });
  }
});

router.post('/add', async (req, res) => {
  try {
    const category = await Category
      .create(Object.assign({ UserId: req.user.id }, req.body));
    res.json(category);
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Category');
    res.json({ error: errorMessage });
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
    res.json({ error: errorMessage });
  }
});

router.put('/detail/:id', async (req, res) => {
  try {
    const query = {
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
        UserId: {
          [Op.eq]: req.user.id,
        },
      },
    };
    await Category.update(req.body, query);
    const category = await Category.findOne(query);
    res.json(category);
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Category');
    res.json({ error: errorMessage });
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
    res.json({ error: errorMessage });
  }
});


module.exports = router;
