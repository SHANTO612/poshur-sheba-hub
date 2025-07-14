# 🌥️ Cloudinary Setup Guide

## Step 1: Get Cloudinary Credentials

1. **Go to Cloudinary:** https://cloudinary.com/
2. **Sign up/Login** to your account
3. **Go to Dashboard** → You'll see your credentials:
   - **Cloud Name** (e.g., `myapp123`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnop`)

## Step 2: Create .env File

Create a file called `.env` in the `server/` folder with this content:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/cattlebes

# JWT
JWT_SECRET=cattlebes_super_secret_key_2024
JWT_EXPIRES_IN=7d

# Cloudinary (Replace with your real credentials)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Email (Optional - for contact form)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password

# Server
PORT=5000
```

## Step 3: Replace Placeholder Values

Replace these values with your actual Cloudinary credentials:

```bash
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Restart Server

After setting up the .env file:

```bash
cd server
npm run dev
```

You should see: `📁 Using Cloudinary storage for image uploads`

## Step 5: Test Image Upload

1. Login as a farmer
2. Go to dashboard
3. Add cattle with images
4. Images will now be uploaded to Cloudinary!

## 🔍 Verify It's Working

When you add cattle with images, you should see:
- Images uploaded to your Cloudinary account
- Image URLs like: `https://res.cloudinary.com/your-cloud-name/image/upload/...`
- No more "Invalid api_key" errors

## 🚨 Important Notes

- **Keep your API secret private** - never commit it to git
- **Add .env to .gitignore** to keep credentials secure
- **Cloudinary has a free tier** with generous limits
- **Images are automatically optimized** by Cloudinary

## 🆘 Troubleshooting

If you still get errors:
1. Check your credentials are correct
2. Make sure .env file is in the server folder
3. Restart the server after changing .env
4. Check Cloudinary dashboard for uploads 