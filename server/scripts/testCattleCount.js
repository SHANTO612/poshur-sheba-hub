const mongoose = require("mongoose")
const User = require("../models/User")
const Cattle = require("../models/Cattle")
const connectDB = require("../config/database")

const testCattleCount = async () => {
  try {
    await connectDB()

    console.log("🔍 Testing cattle count functionality...")

    // Get all farmers
    const farmers = await User.find({ userType: "farmer" })
    console.log(`Found ${farmers.length} farmers`)

    // Test cattle count for each farmer
    for (const farmer of farmers) {
      const cattleCount = await Cattle.countDocuments({ 
        seller: farmer._id,
        status: { $in: ["available", "reserved"] }
      })

      console.log(`👨‍🌾 ${farmer.name}: ${cattleCount} cattle listings`)
    }

    // Test the aggregation query
    console.log("\n📊 Testing aggregation query...")
    const farmersWithCount = await User.aggregate([
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
          livestock: { $concat: [{ $toString: "$cattleCount" }, " Cattle"] }
        }
      }
    ])

    console.log("✅ Aggregation results:")
    farmersWithCount.forEach(farmer => {
      console.log(`- ${farmer.name}: ${farmer.livestock}`)
    })

  } catch (error) {
    console.error("❌ Error testing cattle count:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from database")
  }
}

// Run the test
testCattleCount() 