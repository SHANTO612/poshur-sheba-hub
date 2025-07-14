const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const testCloudinary = async () => {
  try {
    console.log('🧪 Testing Cloudinary Configuration...\n');
    
    // Check if credentials are set
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    console.log('📋 Credentials Check:');
    console.log(`Cloud Name: ${cloudName ? '✅ Set' : '❌ Missing'}`);
    console.log(`API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`API Secret: ${apiSecret ? '✅ Set' : '❌ Missing'}`);
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.log('\n❌ Missing Cloudinary credentials!');
      console.log('Please set up your .env file with real Cloudinary credentials.');
      return;
    }
    
    // Check if using demo credentials
    if (cloudName === 'demo' || apiKey === 'demo_key' || apiSecret === 'demo_secret') {
      console.log('\n⚠️  Using demo credentials - Cloudinary uploads will fail');
      console.log('Please use real Cloudinary credentials for image uploads.');
      return;
    }
    
    // Test Cloudinary configuration
    console.log('\n🔧 Testing Cloudinary connection...');
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    
    // Test with a simple API call
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('Response:', result);
    
    console.log('\n🎉 Cloudinary is properly configured!');
    console.log('You can now upload images to Cloudinary.');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Cloudinary credentials in .env file');
    console.log('2. Make sure you have a Cloudinary account');
    console.log('3. Verify your API key and secret are correct');
  }
};

testCloudinary(); 