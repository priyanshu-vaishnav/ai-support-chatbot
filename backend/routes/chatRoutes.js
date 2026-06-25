const express = require('express');
const router = express.Router();
const { handleChat, getTickets, resolveTicket,sendReply,UserTickets } = require('../controllers/chatController');


router.post('/chat', handleChat);
router.get('/tickets', getTickets);
router.post('/usertickets',UserTickets)
router.patch('/tickets/:id/resolve', resolveTicket);
router.patch('/tickets/:id/reply', sendReply);

module.exports = router;