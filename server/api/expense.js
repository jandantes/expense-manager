const express = require('express');
const Sequelize = require('sequelize');

const router = express.Router();
const { Op } = Sequelize;

const error = require('../utils/error');
const { Expense } = require('../models');

router.use((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
});

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense
      .findAll({
        // attributes: ['id', 'title', 'value'],
        where: {
          UserId: {
            [Op.eq]: req.user.id,
          },
        },
        order: [['title', 'ASC']],
      });
    res.json(expenses);
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Expense');
    res.json({ error: errorMessage });
  }
});

router.post('/add', async (req, res) => {
  try {
    const expense = await Expense
      .create(Object.assign({ UserId: req.user.id }, req.body));
    res.json(expense);
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Expense');
    res.json({ error: errorMessage });
  }
});

router.get('/detail/:id', async (req, res) => {
  try {
    const expense = await Expense
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
    const message = !expense ? { error: 'Expense not found.' } : expense;
    res.json(message);
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Expense');
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
    await Expense.update(req.body, query);
    const expense = await Expense.findOne(query);
    const message = !expense ? { error: 'Expense not found.' } : expense;
    res.json(message);
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Expense');
    res.json({ error: errorMessage });
  }
});

router.delete('/detail/:id', async (req, res) => {
  try {
    const expense = await Expense
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

    const message = !expense ? 'Expense not found.' : 'Successfully deleted';
    res.json({ error: message });
  } catch (err) {
    const errorMessage = error.generateMessage(err, 'Expense');
    res.json({ error: errorMessage });
  }
});

module.exports = router;
