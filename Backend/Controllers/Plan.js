const { default: mongoose } = require('mongoose');
const express = require('express');
const { check, validationResult } = require('express-validator');
const Plan = require('../Models/plan'); // Make sure this imports correctly
const User = require('../Models/User'); // Make sure this imports correctly

// Plan validation middleware
const validatePlan = [
  check('planName').notEmpty().withMessage('Plan name is required'),
  check('planPrice').isFloat({ gt: 0 }).withMessage('Plan price must be a positive number'),
  check('planDuration').isInt({ gt: 0 }).withMessage('Plan duration must be a positive integer'),
  check('planDescription').notEmpty().withMessage('Plan description is required'),
];

// Get all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find(); // Fetch all plans from the database
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new plan
const addPlan = async (req, res) => {
  // Validation error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (![1, 2].includes(req.user.userType)) return res.status(403).json({ message: 'Access denied' });

  try {
    const { planName, planPrice, planDuration, planDescription, planValidTill } = req.body;
    const newPlan = new Plan({ planName, planPrice, planDuration, planDescription, planValidTill });
    await newPlan.save();
    res.status(201).json({ message: 'Plan added successfully', newPlan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a plan
const removePlan = async (req, res) => {
  if (![1, 2].includes(req.user.userType)) return res.status(403).json({ message: 'Access denied' });

  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Plan deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a plan
const updatePlan = async (req, res) => {
  if (![1, 2].includes(req.user.userType)) return res.status(403).json({ message: 'Access denied' });

  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/// Fetch users by email, only allowing access to admins, managers, or trainers
const fetchUsersByEmail = async (req, res) => {
  try {
    const email = req.params.email; // Using query parameters instead of params
    const loggedInUser = req.user;

    let users;

    // If email is provided, find users by email (case-insensitive)
    if (email !== 'null') {
      const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`^${escapedEmail}$`, 'i'); // Exact email match, case-insensitive
      
      // Search by email and userType 4
       users = await User.find({ email: regex, userType: 4 }).select('-password').populate({
        path: 'Invoice', // Populate the invoice reference
      })
      .populate({
        path: 'plan', // Populate the plan reference
      });
      
      
    } else {
      // If email is null or empty, return all users with userType 4
      users = await User.find({ userType: 4 }).select('-password').populate({
        path: 'Invoice', // Populate the invoice reference
      })
      .populate({
        path: 'plan', // Populate the plan reference
      });
    }
    
    if (!users || users.length === 0) {
      users = await User.find({ userType: 4 }).select('-password').populate({
        path: 'Invoice', // Populate the invoice reference
      })
      .populate({
        path: 'plan', // Populate the plan reference
      });
      return res.status(200).json(users); // Return empty array if no users found
    }

    // If the logged-in user is an admin (userType 1) or manager (userType 2), allow access to all found users
    if (loggedInUser.userType === 1 || loggedInUser.userType === 2) {
      return res.status(200).json(users);
    }

    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




module.exports = { addPlan, removePlan, updatePlan, validatePlan, getAllPlans, fetchUsersByEmail };
