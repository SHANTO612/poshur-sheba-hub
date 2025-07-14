const User = require("../models/User")

const getAllVeterinarians = async (req, res) => {
  try {
    console.log("Fetching veterinarians...");
    
    const veterinarians = await User.find({ userType: "veterinarian" })
      .select("name email phone clinicName location specialization licenseNumber availability createdAt")
      .sort({ rating: -1, createdAt: -1 })

    console.log(`Found ${veterinarians.length} veterinarians`);

    const formattedVeterinarians = veterinarians.map(vet => ({
      _id: vet._id,
      name: vet.name,
      email: vet.email,
      phone: vet.phone,
      clinicName: vet.clinicName,
      location: vet.location,
      specialization: vet.specialization,
      licenseNumber: vet.licenseNumber,
      availability: vet.availability,
      createdAt: vet.createdAt
    }))

    console.log("Sending response:", { success: true, data: formattedVeterinarians });

    res.json({
      success: true,
      data: formattedVeterinarians,
    })
  } catch (error) {
    console.error("Error in getAllVeterinarians:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getVeterinarianById = async (req, res) => {
  try {
    const veterinarian = await User.findById(req.params.id)
      .select("name email phone clinicName location specialization licenseNumber availability createdAt")

    if (!veterinarian) {
      return res.status(404).json({
        success: false,
        message: "Veterinarian not found",
      })
    }

    if (veterinarian.userType !== "veterinarian") {
      return res.status(404).json({
        success: false,
        message: "User is not a veterinarian",
      })
    }

    const formattedVeterinarian = {
      _id: veterinarian._id,
      name: veterinarian.name,
      email: veterinarian.email,
      phone: veterinarian.phone,
      clinicName: veterinarian.clinicName,
      location: veterinarian.location,
      specialization: veterinarian.specialization,
      licenseNumber: veterinarian.licenseNumber,
      availability: veterinarian.availability,
      createdAt: veterinarian.createdAt
    }

    res.json({
      success: true,
      data: formattedVeterinarian,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Veterinarian not found",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

module.exports = {
  getAllVeterinarians,
  getVeterinarianById,
} 