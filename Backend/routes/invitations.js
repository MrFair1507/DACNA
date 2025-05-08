const router = require('express').Router();
const authenticate = require('../middlewares/authMiddleware');
const invitationController = require('../controllers/invitationController');

router.post('/send', authenticate, invitationController.sendInvitationByEmail);
