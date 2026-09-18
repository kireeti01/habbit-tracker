const express = require('express');
const StatsController = require('../controllers/statsController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/overview', StatsController.getOverview);
router.get('/heatmap/:habitId', StatsController.getHeatmap);
router.get('/weekly', StatsController.getWeekly);

module.exports = router;
