require("dotenv").config()
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer")

// Configure Cloudinary with fallback values for development
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "demo_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "demo_secret",
})

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cattlebes", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
  },
})

// Check if we have real Cloudinary credentials
const hasRealCredentials = process.env.CLOUDINARY_API_KEY && 
                         process.env.CLOUDINARY_API_KEY !== "demo_key" &&
                         process.env.CLOUDINARY_CLOUD_NAME &&
                         process.env.CLOUDINARY_CLOUD_NAME !== "demo";

// Use different storage based on credentials
const finalStorage = hasRealCredentials ? storage : multer.memoryStorage();

// Log which storage we're using
if (hasRealCredentials) {
  console.log('📁 Using Cloudinary storage for image uploads');
} else {
  console.log('📁 Using memory storage for image uploads (demo mode)');
}

// Configure multer with appropriate storage
const upload = multer({
  storage: finalStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    // Only try to delete if we have real Cloudinary credentials
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== "demo_key") {
      const result = await cloudinary.uploader.destroy(publicId)
      return result
    } else {
      console.log("Skipping Cloudinary delete - using demo credentials")
      return { result: "ok" }
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    // Don't throw error, just log it
    return { result: "error", message: error.message }
  }
}

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  const parts = url.split("/")
  const filename = parts[parts.length - 1]
  return filename.split(".")[0]
}

module.exports = {
  cloudinary,
  upload,
  deleteImage,
  extractPublicId,
}
