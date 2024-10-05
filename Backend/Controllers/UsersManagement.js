const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../Models/User');

// Add user based on role
const addUserByRole = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, userType, dob, fatherName, address, city, email, password, trainer, timing, bloodGroup, plan, phone } = req.body;
        const currentUserType = req.user.userType;

        // Role-based restrictions
        if (currentUserType === 1) {
            if (![1, 2, 3, 4].includes(userType)) {
                return res.status(400).json({ message: 'Invalid user type for admin' });
            }
        } else if (currentUserType === 2) {
            if (![3, 4].includes(userType)) {
                return res.status(403).json({ message: 'Managers can only add trainers and users of type 3 or 4' });
            }
        } else if (currentUserType === 3) {
            if (userType !== 4) {
                return res.status(403).json({ message: 'Trainers can only add users of type 4' });
            }
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            userType,
            dob,
            phone,
            fatherName,
            address,
            city,
            email,
            password: hashedPassword,
            trainer,
            timing,
            bloodGroup,
            plan
        });

        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove user based on role
const removeUser = async (req, res) => {
    try {
        const { userID } = req.params;
        const currentUserType = req.user.userType;

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Role-based restrictions for removing users
        if (currentUserType === 1) {
            // Admin can remove any user
        } else if (currentUserType === 2) {
            // Manager can remove trainers and users
            if (![3, 4].includes(user.userType)) {
                return res.status(403).json({ message: 'Managers can only remove trainers or users' });
            }
        } else if (currentUserType === 3) {
            // Trainer can only remove users
            if (user.userType !== 4) {
                return res.status(403).json({ message: 'Trainers can only remove users' });
            }
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        await user.remove();
        res.status(200).json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Fetch users by type (common endpoint with role-based restrictions)
const getUsersByType = async (req, res) => {
    try {
        const { userType } = req.query;
        const currentUserType = req.user.userType;

        // Check if userType is valid
        if (![1, 2, 3, 4].includes(parseInt(userType))) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        // Apply role-based restrictions
        if (currentUserType === 1) {
            // Admin can fetch any user
        } else if (currentUserType === 2) {
            // Manager can fetch trainers and users only
            if (![3, 4].includes(parseInt(userType))) {
                return res.status(403).json({ message: 'Managers can only fetch trainers or users' });
            }
        } else if (currentUserType === 3) {
            // Trainer can only fetch users
            if (parseInt(userType) !== 4) {
                return res.status(403).json({ message: 'Trainers can only fetch users' });
            }
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (currentUserType === 3) {
            // Fetch users based on userType
            const users = await User.find({ userType, trainer: req.user.userId }).populate({
                path: 'Invoice',
            }).populate({
                path: 'plan',
            }).populate({
                path: 'trainer',
            });
            return res.status(200).json(users);
        }

        // Fetch users based on userType
        const users = await User.find({ userType }).populate({
            path: 'Invoice',
        }).populate({
            path: 'plan',
        }).populate({
            path: 'trainer',
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user based on role
const updateUser = async (req, res) => {
    try {
        const { userID } = req.params;
        const currentUserType = req.user.userType;
        const { name, dob, fatherName, address, city, email, password, trainer, timing, bloodGroup, plan, phone } = req.body;
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Role-based restrictions for updating users
        if (currentUserType === 1) {
            // Admin can update any user
        } else if (currentUserType === 2) {
            if (![3, 4].includes(user.userType)) {
                return res.status(403).json({ message: 'Managers can only update trainers and users' });
            }
        } else if (currentUserType === 3) {
            if (user.userType !== 4) {
                return res.status(403).json({ message: 'Trainers can only update users' });
            }
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Hash password if provided
        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update user details
        user.name = name || user.name;
        user.dob = dob || user.dob;
        user.fatherName = fatherName || user.fatherName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.email = email || user.email;
        user.password = hashedPassword;
        user.trainer = trainer || user.trainer;
        user.timing = timing || user.timing;
        user.bloodGroup = bloodGroup || user.bloodGroup;
        user.plan = plan || user.plan;
        user.phone = phone || user.phone;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Middleware to verify if the user is an admin
const authorizeAdmin = (req, res, next) => {
    if (req.user.userType === 1) {
        return next();
    }
    return res.status(403).json({ message: 'Admin access required' });
};

module.exports = { addUserByRole, removeUser, getUsersByType, updateUser, authorizeAdmin };
