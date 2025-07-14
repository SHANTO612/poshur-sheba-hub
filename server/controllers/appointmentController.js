const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Book a new appointment
const bookAppointment = async (req, res) => {
  try {
    const {
      veterinarianId,
      veterinarianName,
      patientName,
      patientPhone,
      animalType,
      animalAge,
      problem,
      preferredDate,
      preferredTime,
      urgency,
      additionalNotes
    } = req.body;

    // Validate required fields
    if (!veterinarianId || !patientName || !patientPhone || !animalType || !problem || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if veterinarian exists
    const veterinarian = await User.findById(veterinarianId);
    if (!veterinarian || veterinarian.userType !== 'veterinarian') {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found'
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      veterinarianId,
      veterinarianName,
      patientName,
      patientPhone,
      animalType,
      animalAge: animalAge || '',
      problem,
      preferredDate: new Date(preferredDate),
      preferredTime,
      urgency: urgency || 'normal',
      additionalNotes: additionalNotes || '',
      bookedBy: req.user._id,
      bookedByName: req.user.name
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
};

// Get appointments for a veterinarian
const getVeterinarianAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    const veterinarianId = req.user._id;

    let query = { veterinarianId };

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.preferredDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const appointments = await Appointment.find(query)
      .sort({ preferredDate: 1, preferredTime: 1 })
      .populate('bookedBy', 'name email phone');

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Get appointments booked by a user
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointments = await Appointment.find({ bookedBy: userId })
      .sort({ preferredDate: -1, createdAt: -1 })
      .populate('veterinarianId', 'name clinicName phone');

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Update appointment status (confirm, complete, cancel)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes, cancellationReason } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user is the veterinarian for this appointment
    if (appointment.veterinarianId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Update status and related fields
    appointment.status = status;
    appointment.notes = notes || appointment.notes;

    if (status === 'confirmed') {
      appointment.confirmedAt = new Date();
    } else if (status === 'completed') {
      appointment.completedAt = new Date();
    } else if (status === 'cancelled') {
      appointment.cancelledAt = new Date();
      appointment.cancellationReason = cancellationReason;
    }

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message
    });
  }
};

// Get appointment statistics for veterinarian dashboard
const getAppointmentStats = async (req, res) => {
  try {
    const veterinarianId = req.user._id;
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const [todayAppointments, weekAppointments, totalPatients, pendingAppointments] = await Promise.all([
      Appointment.countDocuments({
        veterinarianId,
        preferredDate: { $gte: startOfToday, $lt: endOfToday },
        status: { $in: ['pending', 'confirmed'] }
      }),
      Appointment.countDocuments({
        veterinarianId,
        preferredDate: { $gte: startOfWeek, $lt: endOfWeek },
        status: { $in: ['pending', 'confirmed'] }
      }),
      Appointment.distinct('patientName', { veterinarianId }),
      Appointment.countDocuments({
        veterinarianId,
        status: 'pending'
      })
    ]);

    res.json({
      success: true,
      data: {
        todayAppointments,
        weekAppointments,
        totalPatients: totalPatients.length,
        pendingAppointments
      }
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment statistics',
      error: error.message
    });
  }
};

module.exports = {
  bookAppointment,
  getVeterinarianAppointments,
  getUserAppointments,
  updateAppointmentStatus,
  getAppointmentStats
}; 