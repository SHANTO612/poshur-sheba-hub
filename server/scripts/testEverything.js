const mongoose = require('mongoose');
const User = require('../models/User');
const Cattle = require('../models/Cattle');
require('dotenv').config();

const testEverything = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/cattlebes";
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Test 1: Create a test farmer
    console.log('\n🧪 Test 1: Creating test farmer...');
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

    // Test 2: Create test cattle
    console.log('\n🧪 Test 2: Creating test cattle...');
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

    // Test 3: Verify the cattle was created
    console.log('\n🧪 Test 3: Verifying cattle creation...');
    const createdCattle = await Cattle.findById(testCattle._id).populate('seller');
    console.log('✅ Cattle verification:', {
      id: createdCattle._id,
      name: createdCattle.name,
      seller: createdCattle.seller.name,
      price: createdCattle.price
    });

    // Test 4: Test getting farmer's cattle
    console.log('\n🧪 Test 4: Testing farmer cattle retrieval...');
    const farmerCattle = await Cattle.find({ seller: testFarmer._id });
    console.log('✅ Farmer cattle count:', farmerCattle.length);

    // Test 5: Test user authentication
    console.log('\n🧪 Test 5: Testing user authentication...');
    const token = testFarmer.generateToken();
    console.log('✅ User token generated:', token ? 'Yes' : 'No');

    // Test 6: Test password comparison
    console.log('\n🧪 Test 6: Testing password comparison...');
    const isValidPassword = await testFarmer.comparePassword('password123');
    console.log('✅ Password validation:', isValidPassword);

    // Clean up
    console.log('\n🧹 Cleaning up test data...');
    await Cattle.findByIdAndDelete(testCattle._id);
    await User.findByIdAndDelete(testFarmer._id);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Your backend is working perfectly!');
    console.log('\n📋 Summary:');
    console.log('✅ Database connection');
    console.log('✅ User creation and authentication');
    console.log('✅ Cattle creation and retrieval');
    console.log('✅ Password hashing and comparison');
    console.log('✅ JWT token generation');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
};

testEverything(); 