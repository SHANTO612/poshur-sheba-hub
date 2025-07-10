# CattleBes API Server v3.0

A comprehensive Node.js Express server for the CattleBes cattle trading platform with MongoDB database and Cloudinary image upload.

## 🚀 New Features v3.0

- **MongoDB Integration** - Complete database with Mongoose ODM
- **Cloudinary Image Upload** - Professional image management
- **Enhanced Models** - Proper database schemas with validation
- **Image Management** - Upload, update, and delete images
- **Database Seeding** - Sample data for development
- **Advanced Search** - Full-text search capabilities
- **Improved Performance** - Database indexing and optimization

## 📁 Project Structure

\`\`\`
cattlebes-server/
├── server.js                 # Main entry point
├── config/
│   ├── database.js           # MongoDB connection
│   ├── jwt.js                # JWT configuration
│   └── cloudinary.js        # Cloudinary setup
├── models/
│   ├── User.js              # User schema
│   ├── Cattle.js            # Cattle schema
│   └── News.js              # News schema
├── controllers/             # Business logic
├── middlewares/             # Custom middleware
├── routes/                  # API routes
├── scripts/
│   └── seedDatabase.js      # Database seeding
└── package.json
\`\`\`

## 🔐 Authentication Endpoints

### Register User
\`\`\`bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+880 1711-123456",
  "userType": "farmer",
  "password": "password123",
  "confirmPassword": "password123"
}
\`\`\`

### Login User
\`\`\`bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

### Get Profile (Protected)
\`\`\`bash
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
\`\`\`

### Update Profile (Protected)
\`\`\`bash
PUT /api/auth/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+880 1711-654321",
  "farmName": "Green Valley Farm",
  "location": "Dhaka",
  "speciality": "Dairy Farming",
  "experience": "10 years",
  "description": "Experienced farmer..."
}
\`\`\`

### Change Password (Protected)
\`\`\`bash
POST /api/auth/change-password
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmNewPassword": "newpassword123"
}
\`\`\`

## 🐄 API Endpoints

### Cattle Management
- `GET /api/cattle` - Get all cattle (public)
- `GET /api/cattle/:id` - Get specific cattle (public)
- `POST /api/cattle` - Create cattle listing (protected)
- `PUT /api/cattle/:id` - Update cattle listing (protected, owner only)
- `DELETE /api/cattle/:id` - Delete cattle listing (protected, owner only)
- `GET /api/cattle/my/listings` - Get my cattle listings (protected)
- `GET /api/cattle?location=Dhaka&type=Cow&minPrice=50000&maxPrice=100000&sortBy=price_asc&page=1&limit=10` - Advanced filtering (public)
- `GET /api/cattle?search=Holstein dairy cow` - Full-text search (public)

### Farmer Profiles
- `GET /api/farmers` - Get all farmers (public)
- `GET /api/farmers/:id` - Get farmer details (public)

### News & Updates
- `GET /api/news` - Get news with pagination (public)
- `GET /api/news/:id` - Get specific news article (public)

### Statistics
- `GET /api/stats` - Get platform statistics (public)
- `GET /api/stats/search?q=query` - Search across platform (public)

## 🛠️ Installation & Setup

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in .env file

3. **Set up Cloudinary:**
   - Create account at cloudinary.com
   - Get your credentials from dashboard
   - Update Cloudinary variables in .env file

4. **Seed the database:**
\`\`\`bash
npm run seed
\`\`\`

5. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

## 📸 Image Upload Endpoints

### Upload Cattle Images
\`\`\`bash
POST /api/cattle
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Form data:
name: "Premium Bull"
breed: "Brahman"
weight: "450 kg"
age: "3 years"
price: "৳85,000"
priceNumeric: 85000
type: "Bull"
description: "Healthy bull"
location: "Dhaka"
contact: "+880 1711-123456"
images: [file1.jpg, file2.jpg] # Up to 5 images
\`\`\`

### Upload User Avatar
\`\`\`bash
POST /api/auth/upload-avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Form data:
avatar: profile.jpg
\`\`\`

## 🔧 Environment Variables

Create a \`.env\` file in the root directory:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/cattlebes

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=3001
NODE_ENV=development
\`\`\`

## 🛡️ Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication tokens
- **Input Validation** - Email, phone, password validation
- **CORS Protection** - Configured for specific origins
- **Error Handling** - Comprehensive error responses
- **Route Protection** - Middleware-based authentication
- **File Upload Validation** - Secure image uploads
- **Error Message Sanitization** - Prevents sensitive information exposure

## 📊 Database Models

### User Model Features
- Password hashing with bcrypt
- Email and phone validation
- User type enum (farmer, buyer, veterinarian, seller)
- Profile fields (farmName, location, speciality, etc.)
- Rating and sales tracking
- Avatar image support

### Cattle Model Features
- Image array with Cloudinary URLs
- Full-text search indexing
- Price range filtering
- Status tracking (available, sold, reserved)
- View counting
- Owner verification
- Additional fields (gender, vaccination, health status)

### News Model Features
- Category-based organization
- Tag system
- View tracking
- Featured articles
- Full-text search

## 🔍 Search & Filter Features

### Advanced Search
- Full-text search across cattle, farmers, and news
- Category-based filtering
- Price range filtering
- Location-based filtering
- Sort by price, date, views, rating

### Database Indexing
- Optimized queries with proper indexing
- Text indexes for search functionality
- Compound indexes for complex queries

## 🖼️ Image Management

### Cloudinary Features
- Automatic image optimization
- Multiple format support (JPG, PNG, WebP)
- Image transformation (resize, crop, quality)
- Secure upload with validation
- Automatic cleanup on deletion

### Image Validation
- File type validation
- File size limits (5MB)
- Multiple image support (up to 5 per cattle)
- Error handling for failed uploads

## 📈 Performance Features

- Database connection pooling
- Proper error handling
- Request validation
- Image optimization
- Pagination for large datasets
- Efficient database queries

## 🚀 Production Deployment

### Environment Setup
\`\`\`bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cattlebes
\`\`\`

### Security Features
- CORS configuration
- Input validation
- Password hashing
- JWT token security
- File upload validation
- Error message sanitization

## 📱 Frontend Integration Example

\`\`\`javascript
// Login
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  
  const data = await response.json()
  
  if (data.success) {
    // Store token in localStorage or context
    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))
  }
  
  return data
}

// Make authenticated requests
const getProfile = async () => {
  const token = localStorage.getItem('token')
  
  const response = await fetch('http://localhost:3001/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  
  return await response.json()
}

// Upload cattle with images
const createCattle = async (cattleData, images) => {
  const formData = new FormData()
  
  // Add cattle data
  Object.keys(cattleData).forEach(key => {
    formData.append(key, cattleData[key])
  })
  
  // Add images
  images.forEach(image => {
    formData.append('images', image)
  })
  
  const response = await fetch('/api/cattle', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  
  return await response.json()
}
\`\`\`

The server is now production-ready with complete database integration and professional image management!

## 🚀 Quick Start

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Set up environment variables:**
Create a \`.env\` file with your configuration (see Environment Variables section below)

3. **Clear database (optional):**
\`\`\`bash
npm run seed
\`\`\`
This will clear all existing data and prepare the database for real data.

4. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

## 📝 Database Status

The database is currently **empty** and ready for real data. Users can:
- Register as farmers, sellers, veterinarians, or buyers
- Add cattle listings with images
- Add products (meat, dairy, feed, equipment)
- Add news articles
- Rate veterinarians (farmers only)

All dummy/sample data has been removed to make way for real user-generated content.

## Contact Form Email Setup

To enable the contact form to send emails, add the following to your `.env` file:

```
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASS=your_gmail_app_password
```

- GMAIL_USER: The Gmail address you want to send from (e.g., shantocse612@gmail.com)
- GMAIL_PASS: A Gmail App Password (not your regular password). Generate one from your Google Account > Security > App Passwords.

## 👑 Admin Setup

To create an admin user with full access to delete users, cattle, products, and other content:

```bash
npm run create-admin
```

This will create an admin user with:
- Email: admin@cattlebes.com
- Password: admin123456

**Important:** Change the password after first login for security.

### Admin Features:
- **User Management:** View all users and delete non-admin users
- **Content Management:** Delete cattle listings, products, news articles, and ratings
- **Dashboard:** View platform statistics and user breakdown
- **Security:** Admin users cannot delete other admin users

### Admin Access:
- Navigate to `/admin` in the frontend when logged in as admin
- All admin operations require authentication and admin role
- Admin routes are protected with middleware
