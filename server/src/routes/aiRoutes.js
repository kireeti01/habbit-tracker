const express = require('express');
const AIController = require('../controllers/aiController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  suggestHabitsRequestSchema,
  motivationRequestSchema,
  chatRequestSchema,
} = require('../validations/aiValidation');

const router = express.Router();

// Guard all AI routes
router.use(authenticate);
router.use(aiLimiter);

router.post('/suggest-habits', validate(suggestHabitsRequestSchema), AIController.suggestHabits);
router.get('/weekly-insight', AIController.getWeeklyInsight);
router.post('/motivation', validate(motivationRequestSchema), AIController.getMotivation);
router.post('/chat', validate(chatRequestSchema), AIController.chat);

module.exports = router;
