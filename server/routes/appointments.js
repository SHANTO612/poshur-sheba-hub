const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middlewares/auth');

// Book a new appointment (any authenticated user can book)
router.post('/book', authenticateToken, appointmentController.bookAppointment);

// Get appointments for the logged-in veterinarian
router.get('/veterinarian', authenticateToken, appointmentController.getVeterinarianAppointments);

// Get appointments booked by the logged-in user
router.get('/user', authenticateToken, appointmentController.getUserAppointments);

// Update appointment status (veterinarian only)
router.put('/:appointmentId/status', authenticateToken, appointmentController.updateAppointmentStatus);

// Get appointment statistics for veterinarian dashboard
router.get('/stats', authenticateToken, appointmentController.getAppointmentStats);

module.exports = router; 