const User = require("../models/User")
const { deleteImage, extractPublicId } = require("../config/cloudinary")

const register = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      userType, 
      password, 
      confirmPassword,
      // Farmer specific fields
      farmName,
      location,
      speciality,
      experience,
      description,
      // Veterinarian specific fields
      clinicName,
      specialization,
      licenseNumber,
      availability,
      // Seller specific fields
      shopName,
      businessType,
      // Buyer specific fields
      address
    } = req.body

    // Validation
    if (!name || !email || !phone || !userType || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All required fields are missing",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Prepare user data based on userType
    const userData = {
      name,
      email,
      phone,
      userType,
      password,
    }

    // Add role-specific fields
    if (userType === 'farmer') {
      if (farmName) userData.farmName = farmName
      if (location) userData.location = location
      if (speciality) userData.speciality = speciality
      if (experience) userData.experience = experience
      if (description) userData.description = description
    } else if (userType === 'veterinarian') {
      if (clinicName) userData.clinicName = clinicName
      if (location) userData.location = location
      if (specialization) userData.specialization = specialization
      if (licenseNumber) userData.licenseNumber = licenseNumber
      if (availability) userData.availability = availability
    } else if (userType === 'seller') {
      if (shopName) userData.shopName = shopName
      if (location) userData.location = location
      if (businessType) userData.businessType = businessType
    } else if (userType === 'buyer') {
      if (address) userData.address = address
    }

    // Create user
    const user = await User.create(userData)

    // Generate token
    const token = user.generateToken()

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Find user and include password
    const user = await User.findOne({ email, isActive: true }).select("+password")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Validate password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Update last login
    await user.updateLastLogin()

    // Generate token
    const token = user.generateToken()

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          avatar: user.avatar,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const { 
      name, 
      phone, 
      // Farmer specific fields
      farmName, 
      location, 
      speciality, 
      experience, 
      description,
      // Veterinarian specific fields
      clinicName,
      specialization,
      licenseNumber,
      availability,
      // Seller specific fields
      shopName,
      businessType,
      // Buyer specific fields
      address
    } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (farmName) updateData.farmName = farmName
    if (location) updateData.location = location
    if (speciality) updateData.speciality = speciality
    if (experience) updateData.experience = experience
    if (description) updateData.description = description
    if (clinicName) updateData.clinicName = clinicName
    if (specialization) updateData.specialization = specialization
    if (licenseNumber) updateData.licenseNumber = licenseNumber
    if (availability) updateData.availability = availability
    if (shopName) updateData.shopName = shopName
    if (businessType) updateData.businessType = businessType
    if (address) updateData.address = address

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      })
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      })
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Validate current password
    const isValidPassword = await user.comparePassword(currentPassword)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    next(error)
  }
}

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Delete old avatar if exists
    if (user.avatar) {
      try {
        const publicId = extractPublicId(user.avatar)
        await deleteImage(publicId)
      } catch (error) {
        console.error("Error deleting old avatar:", error)
      }
    }

    // Update user avatar
    user.avatar = req.file.path
    await user.save()

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        avatar: user.avatar,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
}
