const express = require('express');
const HabitController = require('../controllers/habitController');
const LogController = require('../controllers/logController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createHabitSchema,
  updateHabitSchema,
  checkInSchema,
} = require('../validations/habitValidation');

const router = express.Router();

// Guard all habit routes with authentication
router.use(authenticate);

// Habits CRUD
router.get('/', HabitController.getHabits);
router.post('/', validate(createHabitSchema), HabitController.createHabit);
router.get('/:id', HabitController.getHabitById);
router.put('/:id', validate(updateHabitSchema), HabitController.updateHabit);
router.delete('/:id', HabitController.deleteHabit);
router.patch('/:id/archive', HabitController.toggleArchive);

// Check-ins and Logs
router.post('/:id/check', validate(checkInSchema), LogController.checkIn);
router.get('/:id/logs', LogController.getLogs);

module.exports = router;
