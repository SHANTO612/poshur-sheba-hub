const mongoose = require("mongoose")
const User = require("../models/User")
const Cattle = require("../models/Cattle")
const Product = require("../models/Product")
const News = require("../models/News")
const connectDB = require("../config/database")

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Cattle.deleteMany({})
    await Product.deleteMany({})
    await News.deleteMany({})

    console.log("🗑️ Cleared existing data")

    // Create sample users
    const users = await User.create([
      {
        name: "Md. Karim Ahmed",
        email: "karim@greenvalley.com",
        phone: "+8801712345678",
        userType: "farmer",
        password: "password123",
        farmName: "Green Valley Farm",
        location: "Savar, Dhaka",
        speciality: "Dairy Farming",
        experience: "15 years",
        description: "Experienced dairy farmer with focus on sustainable farming practices",
        rating: 4.8,
        totalSales: 45,
        isVerified: true,
      },
      {
        name: "Fatima Begum",
        email: "fatima@sunrisedairy.com",
        phone: "+8801812345678",
        userType: "farmer",
        password: "password123",
        farmName: "Sunrise Dairy",
        location: "Chittagong",
        speciality: "Milk Production",
        experience: "12 years",
        description: "Specialized in high-quality milk production with modern techniques",
        rating: 4.6,
        totalSales: 32,
        isVerified: true,
      },
      {
        name: "Rahman Ali",
        email: "rahman@heritage.com",
        phone: "+8801912345678",
        userType: "farmer",
        password: "password123",
        farmName: "Heritage Livestock",
        location: "Sylhet",
        speciality: "Cattle Breeding",
        experience: "20 years",
        description: "Expert in cattle breeding with 20+ years of experience",
        rating: 4.9,
        totalSales: 67,
        isVerified: true,
      },
      // Veterinarians
      {
        name: "Dr. Mohammad Hasan",
        email: "hasan@vetclinic.com",
        phone: "+8801711111111",
        userType: "veterinarian",
        password: "password123",
        clinicName: "Dhaka Veterinary Clinic",
        location: "Dhaka",
        specialization: "Large Animal Medicine",
        experience: "15 years",
        licenseNumber: "VET-001",
        availability: "Mon-Sat, 9AM-6PM",
        rating: 4.8,
        isVerified: true,
      },
      {
        name: "Dr. Fatema Ahmed",
        email: "fatema@vetclinic.com",
        phone: "+8801811111111",
        userType: "veterinarian",
        password: "password123",
        clinicName: "Chittagong Animal Hospital",
        location: "Chittagong",
        specialization: "Dairy Cattle Health",
        experience: "12 years",
        licenseNumber: "VET-002",
        availability: "Mon-Fri, 8AM-5PM",
        rating: 4.9,
        isVerified: true,
      },
      {
        name: "Dr. Abdul Rahman",
        email: "rahman@vetclinic.com",
        phone: "+8801911111111",
        userType: "veterinarian",
        password: "password123",
        clinicName: "Sylhet Veterinary Center",
        location: "Sylhet",
        specialization: "Animal Surgery",
        experience: "18 years",
        licenseNumber: "VET-003",
        availability: "Mon-Sat, 10AM-7PM",
        rating: 4.9,
        isVerified: true,
      },
      // Sellers
      {
        name: "Nasir Uddin",
        email: "nasir@meatshop.com",
        phone: "+8801722222222",
        userType: "seller",
        password: "password123",
        shopName: "Fresh Meat Shop",
        location: "Dhaka",
        businessType: "Meat Shop",
        rating: 4.5,
        totalSales: 28,
        isVerified: true,
      },
      {
        name: "Rashida Khatun",
        email: "rashida@dairy.com",
        phone: "+8801822222222",
        userType: "seller",
        password: "password123",
        shopName: "Organic Dairy Products",
        location: "Chittagong",
        businessType: "Dairy Products",
        rating: 4.8,
        totalSales: 23,
        isVerified: true,
      },
    ])

    console.log("👥 Created sample users")

    // Create sample cattle
    const cattle = await Cattle.create([
      {
        name: "Premium Bull",
        breed: "Brahman",
        weight: "450 kg",
        age: "3 years",
        price: "৳85,000",
        priceNumeric: 85000,
        type: "Bull",
        description: "Healthy and strong bull, perfect for breeding",
        location: "Dhaka",
        contact: "+8801712345678",
        seller: users[0]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_bull_1",
          },
        ],
        gender: "male",
        vaccinated: true,
        healthStatus: "excellent",
      },
      {
        name: "Dairy Cow",
        breed: "Holstein",
        weight: "380 kg",
        age: "4 years",
        price: "৳65,000",
        priceNumeric: 65000,
        type: "Cow",
        description: "High milk producing cow, excellent for dairy farming",
        location: "Chittagong",
        contact: "+8801812345678",
        seller: users[1]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_cow_1",
          },
        ],
        gender: "female",
        vaccinated: true,
        healthStatus: "excellent",
      },
      {
        name: "Young Calf",
        breed: "Local",
        weight: "120 kg",
        age: "8 months",
        price: "৳25,000",
        priceNumeric: 25000,
        type: "Calf",
        description: "Healthy young calf with good growth potential",
        location: "Sylhet",
        contact: "+8801912345678",
        seller: users[2]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_calf_1",
          },
        ],
        gender: "male",
        vaccinated: false,
        healthStatus: "good",
      },
    ])

    console.log("🐄 Created sample cattle")

    // Create sample products
    const products = await Product.create([
      {
        name: "Premium Beef",
        description: "Fresh premium quality beef from local farms, perfect for steaks and roasts",
        price: "৳650/kg",
        priceNumeric: 650,
        category: "beef",
        type: "meat",
        unit: "kg",
        stock: 100,
        halal: true,
        available: true,
        weight: "1kg per pack",
        origin: "Local Farm",
        seller: users[3]._id, // Nasir Uddin
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_beef_1",
          },
        ],
      },
      {
        name: "Mutton (Goat)",
        description: "Fresh mutton from healthy goats, tender and flavorful",
        price: "৳850/kg",
        priceNumeric: 850,
        category: "mutton",
        type: "meat",
        unit: "kg",
        stock: 50,
        halal: true,
        available: true,
        weight: "1kg per pack",
        origin: "Local Farm",
        seller: users[3]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_mutton_1",
          },
        ],
      },
      {
        name: "Chicken (Broiler)",
        description: "Farm fresh broiler chicken, perfect for curries and grilling",
        price: "৳180/kg",
        priceNumeric: 180,
        category: "chicken",
        type: "meat",
        unit: "kg",
        stock: 200,
        halal: true,
        available: true,
        weight: "1kg per pack",
        origin: "Local Farm",
        seller: users[4]._id, // Rashida Khatun
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_chicken_1",
          },
        ],
      },
      {
        name: "Beef Liver",
        description: "Fresh beef liver, rich in nutrients and perfect for traditional dishes",
        price: "৳400/kg",
        priceNumeric: 400,
        category: "organ",
        type: "organ",
        unit: "kg",
        stock: 30,
        halal: true,
        available: true,
        weight: "500g per pack",
        origin: "Local Farm",
        seller: users[3]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_liver_1",
          },
        ],
      },
      {
        name: "Beef Bones",
        description: "Fresh beef bones for curry and soup, adds rich flavor",
        price: "৳250/kg",
        priceNumeric: 250,
        category: "bone",
        type: "bone",
        unit: "kg",
        stock: 75,
        halal: true,
        available: true,
        weight: "1kg per pack",
        origin: "Local Farm",
        seller: users[3]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_bones_1",
          },
        ],
      },
      {
        name: "Buffalo Meat",
        description: "High quality buffalo meat, lean and nutritious",
        price: "৳550/kg",
        priceNumeric: 550,
        category: "buffalo",
        type: "meat",
        unit: "kg",
        stock: 25,
        halal: true,
        available: false,
        weight: "1kg per pack",
        origin: "Local Farm",
        seller: users[4]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_buffalo_1",
          },
        ],
      },
    ])

    console.log("🥩 Created sample products")

    // Create sample dairy products
    const dairyProducts = await Product.create([
      {
        name: "Fresh Milk",
        description: "Pure fresh milk from local dairy farms, rich in nutrients and perfect for daily consumption",
        price: "৳65/liter",
        priceNumeric: 65,
        category: "milk",
        type: "dairy",
        unit: "liter",
        stock: 200,
        halal: true,
        available: true,
        weight: "1 liter per bottle",
        origin: "Local Dairy Farm",
        seller: users[4]._id, // Rashida Khatun
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_milk_1",
          },
        ],
      },
      {
        name: "Homemade Yogurt",
        description: "Creamy homemade yogurt with natural taste, perfect for breakfast and cooking",
        price: "৳45/cup",
        priceNumeric: 45,
        category: "yogurt",
        type: "dairy",
        unit: "cup",
        stock: 150,
        halal: true,
        available: true,
        weight: "200g per cup",
        origin: "Local Dairy Farm",
        seller: users[4]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_yogurt_1",
          },
        ],
      },
      {
        name: "Pure Ghee",
        description: "Traditional clarified butter made from cow milk, perfect for cooking and traditional dishes",
        price: "৳850/kg",
        priceNumeric: 850,
        category: "ghee",
        type: "dairy",
        unit: "kg",
        stock: 50,
        halal: true,
        available: true,
        weight: "500g per pack",
        origin: "Local Dairy Farm",
        seller: users[4]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_ghee_1",
          },
        ],
      },
      {
        name: "Cottage Cheese",
        description: "Fresh cottage cheese rich in protein, perfect for salads and cooking",
        price: "৳280/kg",
        priceNumeric: 280,
        category: "cheese",
        type: "dairy",
        unit: "kg",
        stock: 75,
        halal: true,
        available: true,
        weight: "250g per pack",
        origin: "Local Dairy Farm",
        seller: users[3]._id, // Nasir Uddin
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_cheese_1",
          },
        ],
      },
      {
        name: "Fresh Butter",
        description: "Creamy fresh butter made from pure cream, perfect for cooking and baking",
        price: "৳450/kg",
        priceNumeric: 450,
        category: "butter",
        type: "dairy",
        unit: "kg",
        stock: 60,
        halal: true,
        available: true,
        weight: "200g per pack",
        origin: "Local Dairy Farm",
        seller: users[3]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_butter_1",
          },
        ],
      },
      {
        name: "Fresh Cream",
        description: "Fresh dairy cream for cooking and desserts, rich and creamy texture",
        price: "৳120/cup",
        priceNumeric: 120,
        category: "cream",
        type: "dairy",
        unit: "cup",
        stock: 100,
        halal: true,
        available: true,
        weight: "150ml per cup",
        origin: "Local Dairy Farm",
        seller: users[4]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_cream_1",
          },
        ],
      },
    ])

    console.log("🥛 Created sample dairy products")

    // Create sample feed products
    const feedProducts = await Product.create([
      {
        name: "Cattle Feed Mix",
        description: "Complete nutrition feed for dairy cattle with balanced protein and minerals",
        price: "৳45/kg",
        priceNumeric: 45,
        category: "feed",
        type: "feed",
        unit: "kg",
        stock: 500,
        halal: true,
        available: true,
        weight: "50kg bag",
        origin: "Local Feed Mill",
        seller: users[3]._id, // Nasir Uddin
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_feed_1",
          },
        ],
      },
      {
        name: "Mineral Supplement",
        description: "Essential minerals and vitamins for livestock health and productivity",
        price: "৳120/kg",
        priceNumeric: 120,
        category: "supplement",
        type: "feed",
        unit: "kg",
        stock: 200,
        halal: true,
        available: true,
        weight: "25kg bag",
        origin: "Local Feed Mill",
        seller: users[4]._id, // Rashida Khatun
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_supplement_1",
          },
        ],
      },
      {
        name: "Green Fodder Seeds",
        description: "High quality fodder seeds for cultivation, perfect for sustainable farming",
        price: "৳350/kg",
        priceNumeric: 350,
        category: "seed",
        type: "feed",
        unit: "kg",
        stock: 100,
        halal: true,
        available: true,
        weight: "5kg pack",
        origin: "Local Seed Company",
        seller: users[3]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_seeds_1",
          },
        ],
      },
      {
        name: "Protein Rich Feed",
        description: "High protein feed mix for growing cattle and dairy cows",
        price: "৳75/kg",
        priceNumeric: 75,
        category: "feed",
        type: "feed",
        unit: "kg",
        stock: 300,
        halal: true,
        available: true,
        weight: "40kg bag",
        origin: "Local Feed Mill",
        seller: users[4]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_protein_feed_1",
          },
        ],
      },
    ])

    console.log("🌾 Created sample feed products")

    // Create sample equipment products
    const equipmentProducts = await Product.create([
      {
        name: "Milking Machine",
        description: "Electric milking machine for efficient milking, suitable for small to medium farms",
        price: "৳25,000",
        priceNumeric: 25000,
        category: "machine",
        type: "equipment",
        unit: "piece",
        stock: 10,
        halal: true,
        available: true,
        weight: "15kg per unit",
        origin: "Local Equipment Supplier",
        seller: users[3]._id, // Nasir Uddin
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_milking_machine_1",
          },
        ],
      },
      {
        name: "Water Trough",
        description: "Durable plastic water trough for livestock, easy to clean and maintain",
        price: "৳3,500",
        priceNumeric: 3500,
        category: "tool",
        type: "equipment",
        unit: "piece",
        stock: 25,
        halal: true,
        available: true,
        weight: "8kg per unit",
        origin: "Local Equipment Supplier",
        seller: users[4]._id, // Rashida Khatun
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_water_trough_1",
          },
        ],
      },
      {
        name: "Feed Mixer",
        description: "Manual feed mixing machine for preparing balanced feed for livestock",
        price: "৳15,000",
        priceNumeric: 15000,
        category: "machine",
        type: "equipment",
        unit: "piece",
        stock: 15,
        halal: true,
        available: true,
        weight: "25kg per unit",
        origin: "Local Equipment Supplier",
        seller: users[3]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_feed_mixer_1",
          },
        ],
      },
      {
        name: "Cattle Brush",
        description: "Quality brush for cattle grooming and cleaning, improves animal comfort",
        price: "৳800",
        priceNumeric: 800,
        category: "tool",
        type: "equipment",
        unit: "piece",
        stock: 50,
        halal: true,
        available: true,
        weight: "1kg per unit",
        origin: "Local Equipment Supplier",
        seller: users[4]._id,
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            publicId: "placeholder_brush_1",
          },
        ],
      },
    ])

    console.log("🔧 Created sample equipment products")

    // Create sample news
    await News.create([
      {
        title: "New Vaccination Program Launched for Cattle",
        summary: "Government announces comprehensive vaccination drive to protect livestock from seasonal diseases.",
        content:
          "The Department of Livestock Services has launched a new vaccination program targeting seasonal diseases affecting cattle across Bangladesh. This comprehensive initiative aims to protect livestock from common ailments and improve overall herd health.",
        category: "Health",
        author: "Dr. Ahmed Hassan",
        tags: ["vaccination", "health", "government", "livestock"],
        featured: true,
      },
      {
        title: "Dairy Farmers Report Record Milk Production",
        summary: "Local dairy farmers in Savar region achieve highest milk production rates in recent years.",
        content:
          "Dairy farmers in the Savar region have reported record-breaking milk production rates, with average daily output increasing by 25% compared to last year.",
        category: "Production",
        author: "Fatima Rahman",
        tags: ["dairy", "production", "savar", "milk"],
      },
      {
        title: "Modern Feed Technology Improves Livestock Health",
        summary: "Introduction of scientifically formulated feeds shows positive impact on animal health.",
        content:
          "Recent studies show that modern, scientifically formulated feeds have significantly improved livestock health and productivity.",
        category: "Technology",
        author: "Dr. Karim Uddin",
        tags: ["technology", "feed", "health", "nutrition"],
      },
    ])

    console.log("📰 Created sample news")
    console.log("✅ Database seeded successfully!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedData()
