require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const testVeterinarians = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cattlebes');
    console.log('Connected to MongoDB');

    // Test the veterinarian query
    const veterinarians = await User.find({ userType: "veterinarian", isActive: true })
      .select("name email phone clinicName location specialization licenseNumber availability createdAt")
      .sort({ rating: -1, createdAt: -1 });

    console.log(`Found ${veterinarians.length} veterinarians:`);
    veterinarians.forEach((vet, index) => {
      console.log(`${index + 1}. ${vet.name} - ${vet.email} - ${vet.clinicName || 'No clinic'}`);
    });

    // Test without isActive filter
    const allVets = await User.find({ userType: "veterinarian" });
    console.log(`\nTotal veterinarians (including inactive): ${allVets.length}`);

    // Check if any users exist at all
    const totalUsers = await User.countDocuments();
    console.log(`Total users in database: ${totalUsers}`);

    // Check user types
    const userTypes = await User.aggregate([
      { $group: { _id: "$userType", count: { $sum: 1 } } }
    ]);
    console.log('\nUser types in database:');
    userTypes.forEach(type => {
      console.log(`${type._id}: ${type.count}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

testVeterinarians(); 