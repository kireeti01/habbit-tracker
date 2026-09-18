const express = require('express');
const UserController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  updateProfileSchema,
  updatePasswordSchema,
} = require('../validations/userValidation');

const router = express.Router();

router.use(authenticate);

router.put('/profile', validate(updateProfileSchema), UserController.updateProfile);
router.put('/password', validate(updatePasswordSchema), UserController.updatePassword);
router.get('/export', UserController.exportData);

module.exports = router;
