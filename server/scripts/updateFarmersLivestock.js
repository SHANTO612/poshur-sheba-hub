const mongoose = require("mongoose")
const User = require("../models/User")
const connectDB = require("../config/database")

const updateFarmersLivestock = async () => {
  try {
    await connectDB()

    console.log("🔄 Updating farmers with livestock information...")

    // Find all farmers without livestock field or with empty livestock
    const farmersToUpdate = await User.find({
      userType: "farmer",
      $or: [
        { livestock: { $exists: false } },
        { livestock: null },
        { livestock: "" }
      ]
    })

    console.log(`Found ${farmersToUpdate.length} farmers to update`)

    if (farmersToUpdate.length === 0) {
      console.log("✅ All farmers already have livestock information")
      return
    }

    // Update each farmer with default livestock
    const updatePromises = farmersToUpdate.map(async (farmer) => {
      const livestockTypes = [
        "Cattle, Poultry",
        "Dairy Cattle, Goats",
        "Beef Cattle, Sheep",
        "Mixed Livestock",
        "Dairy Farming",
        "Poultry Farming"
      ]
      
      // Randomly assign a livestock type or use a default
      const randomLivestock = livestockTypes[Math.floor(Math.random() * livestockTypes.length)]
      
      return User.findByIdAndUpdate(
        farmer._id,
        { livestock: randomLivestock },
        { new: true }
      )
    })

    const updatedFarmers = await Promise.all(updatePromises)

    console.log(`✅ Updated ${updatedFarmers.length} farmers with livestock information`)
    
    // Log the updated farmers
    updatedFarmers.forEach(farmer => {
      console.log(`- ${farmer.name}: ${farmer.livestock}`)
    })

  } catch (error) {
    console.error("❌ Error updating farmers:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from database")
  }
}

// Run the script
updateFarmersLivestock() 