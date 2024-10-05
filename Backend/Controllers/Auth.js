const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require('express-validator');
const Mail = require('../Services/Mail');
const pug = require('pug');
const path = require('path');

// User registration validation middleware
const validateRegister = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
	check("phone").isLength({ min: 10, max: 10 }).isNumeric().isMobilePhone().withMessage("Invaild Phone number"),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    //   check('dob').isISO8601().toDate().withMessage('Invalid date of birth'),
    // Add more validations as needed
];

// User Login validation middleware
const validateLogin = [
    check('email').isEmail().withMessage('Valid email is required'),
	check("phone").isLength({ min: 10, max: 10 }).isNumeric().isMobilePhone().withMessage("Invaild Phone number"),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

];

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).populate({
            path: 'Invoice',
        }).populate({
            path: 'plan',
        }).populate({
            path: 'trainer',
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Wrong password' });

        const token = jwt.sign({ userId: user._id, userType: user.userType }, JWT_SECRET, { expiresIn: '10h' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register user
const registerUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, userType, dob, fatherName, city, email, password, trainer, timing, bloodGroup, plan } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user object with required fields
        const newUser = new User({
            name,
            userType,
            email,
            password: hashedPassword
        });

        // Add optional fields only if they exist in req.body
        if (dob) newUser.dob = dob;
        if (fatherName) newUser.fatherName = fatherName;
        if (city) newUser.city = city;
        if (trainer) newUser.trainer = trainer;
        if (timing) newUser.timing = timing;
        if (bloodGroup) newUser.bloodGroup = bloodGroup;
        if (plan) newUser.plan = plan;


        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const authication = async (req, res) => {
    try {
        const userid = req.user.userId;
        const user = await User.findOne({ _id: userid }).select("-password").populate({
            path: 'Invoice',
        }).populate({
            path: 'plan',
        }).populate({
            path: 'trainer',
        });

        res.json({ "error": false, user })

    } catch (error) {
        return res.status(500).json({ "error": error.message, "msg": "Intarnal server error" });
    }
};

// Forgot password route
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate reset token
        const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Set the token and expiration date in the user object
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Render invoice template using Pug (or any template engine)
        const Password_reset_html = pug.renderFile(path.join(__dirname, '../Services/Mail_Tamplates/Password_reset.pug'), {
            reset_link: `http://localhost:3000/reset/${resetToken}`,
        });

        const mail_data = {
            to: user.email,
            from: "secure.services@samarpitam.com",
            head: "Fitness Home",
            subject: `Welcome to fitness home`,
            html: Password_reset_html,
        };

        let mailinfo = await Mail(mail_data);

        res.status(200).json({ message: 'Reset password link sent to email', mailinfo });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset password route
const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    try {
        // Verify the reset token
        const decoded = jwt.verify(resetToken, JWT_SECRET);

        // Find the user by the reset token and ensure the token is not expired
        const user = await User.findOne({
            _id: decoded.userId,
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is still valid (not expired)
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and remove the reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset password with old password
const resetPasswordWithOldPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId; // Assuming the user's ID is stored in the request after token verification

    try {
        // Find the user by ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the old password matches
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, registerUser, authication, validateRegister, validateLogin, forgotPassword, resetPassword, resetPasswordWithOldPassword };