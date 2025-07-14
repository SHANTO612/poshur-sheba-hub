const fs = require('fs');
const path = require('path');

console.log('🌥️ Cloudinary Setup Helper\n');

console.log('📋 Please provide your Cloudinary credentials:');
console.log('(You can get these from https://cloudinary.com/ after signing up)\n');

// This is a helper script - you'll need to manually create the .env file
console.log('🔧 To set up Cloudinary, please:');
console.log('');
console.log('1. Go to https://cloudinary.com/ and sign up for free');
console.log('2. Copy your credentials from the dashboard');
console.log('3. Create a file called ".env" in the server folder');
console.log('4. Add this content to the .env file:');
console.log('');
console.log('==========================================');
console.log('# Database');
console.log('MONGODB_URI=mongodb://localhost:27017/cattlebes');
console.log('');
console.log('# JWT');
console.log('JWT_SECRET=cattlebes_super_secret_key_2024');
console.log('JWT_EXPIRES_IN=7d');
console.log('');
console.log('# Cloudinary (Replace with your actual values)');
console.log(CLOUDINARY_CLOUD_NAME=dtlolzg1n);
console.log(CLOUDINARY_API_KEY=126922844867472);
console.log(CLOUDINARY_API_SECRET=vTvS8IYHV09aPpnIP_CXkvFsAF0);
console.log('');
console.log('# Server');
console.log('PORT=5000');
console.log('==========================================');
console.log('');
console.log('5. Replace the 3 Cloudinary values with your real credentials');
console.log('6. Run: node scripts/testCloudinary.js');
console.log('7. If successful, restart your server: npm run dev');
console.log('');
console.log('🎉 Then you can upload images to Cloudinary!'); 