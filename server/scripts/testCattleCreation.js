const mongoose = require('mongoose');
const User = require('../models/User');
const Cattle = require('../models/Cattle');
require('dotenv').config();

const testCattleCreation = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/cattlebes";
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create a test farmer
    const testFarmer = await User.create({
      name: 'Test Farmer',
      email: 'testfarmer@example.com',
      phone: '+8801711111111',
      userType: 'farmer',
      password: 'password123',
      farmName: 'Test Farm',
      location: 'Dhaka',
      speciality: 'Dairy Farming',
      experience: '5 years'
    });

    console.log('✅ Test farmer created:', testFarmer._id);

    // Create test cattle
    const testCattle = await Cattle.create({
      name: 'Test Bull',
      breed: 'Brahman',
      weight: '400 kg',
      age: '3 years',
      price: '৳80,000',
      priceNumeric: 80000,
      type: 'Bull',
      description: 'Test cattle for verification',
      location: 'Dhaka',
      contact: '+8801711111111',
      seller: testFarmer._id,
      images: [
        {
          url: "/placeholder.svg?height=300&width=400",
          publicId: "test_bull_1",
        },
      ],
    });

    console.log('✅ Test cattle created:', testCattle._id);

    // Verify the cattle was created
    const createdCattle = await Cattle.findById(testCattle._id).populate('seller');
    console.log('✅ Cattle verification:', {
      id: createdCattle._id,
      name: createdCattle.name,
      seller: createdCattle.seller.name,
      price: createdCattle.price
    });

    // Test getting farmer's cattle
    const farmerCattle = await Cattle.find({ seller: testFarmer._id });
    console.log('✅ Farmer cattle count:', farmerCattle.length);

    // Clean up
    await Cattle.findByIdAndDelete(testCattle._id);
    await User.findByIdAndDelete(testFarmer._id);
    console.log('✅ Test data cleaned up');

    console.log('🎉 All tests passed! Cattle creation is working properly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
};

testCattleCreation(); 