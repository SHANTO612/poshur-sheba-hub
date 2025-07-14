# 🚀 Quick Cloudinary Setup (5 minutes)

## Step 1: Create Free Cloudinary Account

1. **Go to:** https://cloudinary.com/
2. **Click "Sign Up For Free"**
3. **Fill in your details:**
   - Email: your email
   - Password: choose a password
   - Name: your name
4. **Click "Create Account"**

## Step 2: Get Your Credentials

After signing up, you'll be taken to your dashboard. Look for:

```
Cloud name: [your-cloud-name]
API Key: [your-api-key] 
API Secret: [your-api-secret]
```

**Copy these 3 values!**

## Step 3: Create .env File

1. **Go to your project folder:** `D:\poshur-sheba-hub\server\`
2. **Create a new file called:** `.env`
3. **Copy this content into the file:**

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/cattlebes

# JWT
JWT_SECRET=cattlebes_super_secret_key_2024
JWT_EXPIRES_IN=7d

# Cloudinary (Replace with your actual values from Step 2)
CLOUDINARY_CLOUD_NAME=your_cloud_name_from_step_2
CLOUDINARY_API_KEY=your_api_key_from_step_2
CLOUDINARY_API_SECRET=your_api_secret_from_step_2

# Server
PORT=5000
```

4. **Replace the 3 Cloudinary values** with your actual credentials from Step 2

## Step 4: Test It

Run this command to test if it's working:

```bash
cd server
node scripts/testCloudinary.js
```

If you see ✅ messages, it's working!

## Step 5: Restart Server

```bash
npm run dev
```

You should see: `📁 Using Cloudinary storage for image uploads`

## Step 6: Test Image Upload

1. Go to your app: http://localhost:8085/
2. Login as farmer
3. Go to dashboard
4. Add cattle with images
5. Images will upload to Cloudinary! 🎉

## 🆘 Need Help?

If you get stuck, just tell me:
- What step you're on
- Any error messages you see
- I'll help you fix it!

## 💡 Pro Tips

- **Free tier includes:** 25 GB storage, 25 GB bandwidth/month
- **Images are automatically optimized**
- **Works worldwide with CDN**
- **No credit card required for free account** 