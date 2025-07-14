const User = require("../models/User")
const Cattle = require("../models/Cattle")

const getAllFarmers = async (req, res) => {
  try {
    // Use aggregation to get farmers with their cattle counts in a single query
    const farmersWithCattleCount = await User.aggregate([
      {
        $match: {
          userType: "farmer",
          isActive: true
        }
      },
      {
        $lookup: {
          from: "cattle",
          let: { farmerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$seller", "$$farmerId"] },
                    { $in: ["$status", ["available", "reserved"]] }
                  ]
                }
              }
            }
          ],
          as: "cattle"
        }
      },
      {
        $addFields: {
          cattleCount: { $size: "$cattle" }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          farmName: 1,
          location: 1,
          speciality: 1,
          experience: 1,
          description: 1,
          livestock: { $concat: [{ $toString: "$cattleCount" }, " Cattle"] },
          cattleCount: 1,
          rating: 1,
          totalSales: 1,
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])

    res.json({
      success: true,
      data: farmersWithCattleCount,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getFarmerById = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id)
      .select("name email phone farmName location speciality experience description livestock rating totalSales createdAt")

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      })
    }

    if (farmer.userType !== "farmer") {
      return res.status(404).json({
        success: false,
        message: "User is not a farmer",
      })
    }

    // Get cattle count for this farmer
    const cattleCount = await Cattle.countDocuments({ 
      seller: farmer._id,
      status: { $in: ["available", "reserved"] }
    })

    const formattedFarmer = {
      _id: farmer._id,
      name: farmer.name,
      email: farmer.email,
      phone: farmer.phone,
      farmName: farmer.farmName,
      location: farmer.location,
      speciality: farmer.speciality,
      experience: farmer.experience,
      description: farmer.description,
      livestock: `${cattleCount} Cattle`,
      cattleCount: cattleCount,
      rating: farmer.rating,
      totalSales: farmer.totalSales,
      createdAt: farmer.createdAt
    }

    res.json({
      success: true,
      data: formattedFarmer,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
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
  getAllFarmers,
  getFarmerById,
}
