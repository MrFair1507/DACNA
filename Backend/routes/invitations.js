const router = require('express').Router();
const authenticate = require('../middlewares/authMiddleware');
const invitationController = require('../controllers/InvitationController');

router.post('/send', authenticate, invitationController.sendInvitationByEmail);
