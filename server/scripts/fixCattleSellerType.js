const mongoose = require("mongoose");
const Cattle = require("../models/Cattle");
const connectDB = require("../config/database");

const fixCattleSellerType = async () => {
  try {
    console.log("🚀 Starting seller field type fix script...");
    await connectDB();
    console.log("🔍 Checking and fixing seller field types in cattle collection...");

    // Find all cattle where seller is not an ObjectId
    const cattleWithStringSeller = await Cattle.find({
      $expr: { $eq: [ { $type: "$seller" }, "string" ] }
    });

    console.log(`Found ${cattleWithStringSeller.length} cattle with string seller field.`);

    for (const cattle of cattleWithStringSeller) {
      const sellerId = cattle.seller;
      if (typeof sellerId === "string" && mongoose.Types.ObjectId.isValid(sellerId)) {
        cattle.seller = mongoose.Types.ObjectId(sellerId);
        await cattle.save();
        console.log(`✅ Fixed seller for cattle: ${cattle.name} (${cattle._id})`);
      } else {
        console.log(`⚠️ Skipped cattle: ${cattle.name} (${cattle._id}) - Invalid seller: ${sellerId}`);
      }
    }

    console.log("🎉 Seller field type fix completed.");
  } catch (error) {
    console.error("❌ Error fixing seller field types:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  }
};

fixCattleSellerType().catch((err) => {
  console.error("❌ Top-level error:", err);
}); 