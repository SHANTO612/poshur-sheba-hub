const mongoose = require("mongoose")
const User = require("../models/User")
const Cattle = require("../models/Cattle")
const connectDB = require("../config/database")

const debugCattleCount = async () => {
  try {
    await connectDB()

    console.log("🔍 Debugging cattle count issue...")

    // Get all farmers
    const farmers = await User.find({ userType: "farmer" })
    console.log(`Found ${farmers.length} farmers`)

    // Get all cattle
    const allCattle = await Cattle.find({})
    console.log(`Found ${allCattle.length} total cattle listings`)

    // Check each farmer's cattle
    for (const farmer of farmers) {
      console.log(`\n👨‍🌾 Farmer: ${farmer.name} (ID: ${farmer._id})`)
      
      // Get all cattle for this farmer
      const farmerCattle = await Cattle.find({ seller: farmer._id })
      console.log(`  Total cattle: ${farmerCattle.length}`)
      
      // Get available/reserved cattle
      const availableCattle = await Cattle.find({ 
        seller: farmer._id,
        status: { $in: ["available", "reserved"] }
      })
      console.log(`  Available/Reserved cattle: ${availableCattle.length}`)
      
      // Show details of each cattle
      if (farmerCattle.length > 0) {
        console.log("  Cattle details:")
        farmerCattle.forEach(cattle => {
          console.log(`    - ${cattle.name} (${cattle.breed}) - Status: ${cattle.status}`)
        })
      }
    }

    // Test the aggregation query
    console.log("\n📊 Testing aggregation query...")
    const aggregationResult = await User.aggregate([
      {
        $match: {
          userType: "farmer",
          isActive: true
        }
      },
      {
        $lookup: {
          from: "cattle",
          localField: "_id",
          foreignField: "seller",
          as: "cattle"
        }
      },
      {
        $addFields: {
          cattleCount: {
            $size: {
              $filter: {
                input: "$cattle",
                as: "cattle",
                cond: {
                  $in: ["$$cattle.status", ["available", "reserved"]]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          cattleCount: 1,
          totalCattle: { $size: "$cattle" },
          livestock: { $concat: [{ $toString: "$cattleCount" }, " Cattle"] }
        }
      }
    ])

    console.log("✅ Aggregation results:")
    aggregationResult.forEach(farmer => {
      console.log(`- ${farmer.name}: ${farmer.livestock} (Total: ${farmer.totalCattle})`)
    })

    // Check if there are any cattle without proper seller field
    const orphanedCattle = await Cattle.find({ seller: { $exists: false } })
    console.log(`\n⚠️ Cattle without seller field: ${orphanedCattle.length}`)
    
    if (orphanedCattle.length > 0) {
      console.log("Orphaned cattle:")
      orphanedCattle.forEach(cattle => {
        console.log(`  - ${cattle.name} (ID: ${cattle._id})`)
      })
    }

  } catch (error) {
    console.error("❌ Error debugging cattle count:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from database")
  }
}

// Run the debug
debugCattleCount() 