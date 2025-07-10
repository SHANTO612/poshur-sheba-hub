const mongoose = require("mongoose")
const User = require("../models/User")
const Cattle = require("../models/Cattle")
const Product = require("../models/Product")
const News = require("../models/News")
const Rating = require("../models/Rating")
const connectDB = require("../config/database")

const createTestData = async () => {
  try {
    await connectDB()

    console.log("🗑️ Creating test data for admin testing...")

    // Create test users
    const testUsers = await User.create([
      {
        name: "Test Farmer",
        email: "farmer@test.com",
        phone: "+8801711111111",
        userType: "farmer",
        password: "password123",
        farmName: "Test Farm",
        location: "Dhaka",
        speciality: "Dairy Farming",
        experience: "5 years",
        description: "Test farmer for admin testing",
        rating: 4.5,
        totalSales: 10,
        isVerified: true,
      },
      {
        name: "Test Seller",
        email: "seller@test.com",
        phone: "+8801722222222",
        userType: "seller",
        password: "password123",
        shopName: "Test Shop",
        location: "Chittagong",
        businessType: "Meat Shop",
        rating: 4.2,
        totalSales: 15,
        isVerified: true,
      },
      {
        name: "Test Veterinarian",
        email: "vet@test.com",
        phone: "+8801733333333",
        userType: "veterinarian",
        password: "password123",
        clinicName: "Test Clinic",
        location: "Sylhet",
        specialization: "Animal Health",
        experience: "8 years",
        licenseNumber: "VET-TEST-001",
        availability: "Mon-Fri, 9AM-6PM",
        rating: 4.8,
        isVerified: true,
      },
    ])

    console.log("👥 Created test users")

    // Create test cattle
    const testCattle = await Cattle.create([
      {
        name: "Test Bull",
        breed: "Brahman",
        weight: "400 kg",
        age: "3 years",
        price: "৳80,000",
        priceNumeric: 80000,
        type: "Bull",
        description: "Test cattle for admin testing",
        location: "Dhaka",
        contact: "+8801711111111",
        seller: testUsers[0]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "test_bull_1",
          },
        ],
        gender: "male",
        vaccinated: true,
        healthStatus: "excellent",
      },
      {
        name: "Test Cow",
        breed: "Holstein",
        weight: "350 kg",
        age: "4 years",
        price: "৳60,000",
        priceNumeric: 60000,
        type: "Cow",
        description: "Test cattle for admin testing",
        location: "Chittagong",
        contact: "+8801722222222",
        seller: testUsers[0]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "test_cow_1",
          },
        ],
        gender: "female",
        vaccinated: true,
        healthStatus: "excellent",
      },
    ])

    console.log("🐄 Created test cattle")

    // Create test products
    const testProducts = await Product.create([
      {
        name: "Test Beef",
        description: "Test beef product for admin testing",
        price: "৳600/kg",
        priceNumeric: 600,
        category: "beef",
        type: "meat",
        unit: "kg",
        stock: 50,
        halal: true,
        available: true,
        weight: "1kg per pack",
        origin: "Test Farm",
        seller: testUsers[1]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "test_beef_1",
          },
        ],
      },
      {
        name: "Test Milk",
        description: "Test milk product for admin testing",
        price: "৳60/liter",
        priceNumeric: 60,
        category: "milk",
        type: "dairy",
        unit: "liter",
        stock: 100,
        halal: true,
        available: true,
        weight: "1 liter per bottle",
        origin: "Test Dairy Farm",
        seller: testUsers[1]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "test_milk_1",
          },
        ],
      },
    ])

    console.log("🥩 Created test products")

    // Create test news
    const testNews = await News.create([
      {
        title: "Test News Article 1",
        summary: "This is a test news article for admin testing",
        content: "This is test content for admin testing purposes. You can delete this article.",
        category: "Test",
        author: "Test Author",
        tags: ["test", "admin", "cattle"],
        featured: false,
      },
      {
        title: "Test News Article 2",
        summary: "Another test news article for admin testing",
        content: "This is another test content for admin testing purposes. You can delete this article too.",
        category: "Test",
        author: "Test Author 2",
        tags: ["test", "admin", "dairy"],
        featured: false,
      },
    ])

    console.log("📰 Created test news")

    // Create test ratings
    const testRatings = await Rating.create([
      {
        farmer: testUsers[0]._id,
        veterinarian: testUsers[2]._id,
        rating: 4,
        comment: "Test rating for admin testing",
      },
      {
        farmer: testUsers[0]._id,
        veterinarian: testUsers[2]._id,
        rating: 5,
        comment: "Another test rating for admin testing",
      },
    ])

    console.log("⭐ Created test ratings")
    console.log("✅ Test data created successfully!")
    console.log("📝 You can now login as admin and test the delete functionality!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating test data:", error)
    process.exit(1)
  }
}

createTestData() 