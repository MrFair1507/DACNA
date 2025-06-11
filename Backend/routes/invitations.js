// routes/invitations.js
const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/send', authenticate, invitationController.sendInvitationByEmail);
router.post('/accept', invitationController.acceptInvitation);
router.get('/:projectId', authenticate, invitationController.getProjectInvitations);
router.delete('/:invitationId', authenticate, invitationController.cancelInvitation);

module.exports = router;
