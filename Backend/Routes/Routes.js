const express = require('express');
const verifyToken = require('../Middleware/fetchtoken');
const router = express.Router();
const { registerUser, loginUser, authication, validateRegister, forgotPassword, resetPassword, resetPasswordWithOldPassword, validateLogin } = require('../Controllers/Auth');
const { addPlan, removePlan, updatePlan, validatePlan, getAllPlans, fetchUsersByEmail } = require('../Controllers/Plan');
const { markAttendance, viewAttendance } = require('../Controllers/Attendance');
const { authorizeAdminManagerTrainer, assignOrChangePlan, updateInvoice, authorizeAdminManager } = require('../Controllers/UserPlans');
const { getInactiveUsers, getExpiringPlans, getUsersWithPaymentsDue } = require('../Controllers/UserReports');
const { assignTrainerToUser, updateTrainerForUser } = require('../Controllers/Usertrainer.js');  // Added addTrainer
const { addExpense, getAllExpenses } = require('../Controllers/Expenses');
const { addUserByRole, removeUser, getUsersByType, updateUser } = require('../Controllers/UsersManagement');
const { invoicesbyuser, getallinvoices, getinvoicesbyid, createInvoice } = require('../Controllers/invoice.js');

// User routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/authication', verifyToken, authication);

// Add user (restricted based on role)
router.post('/addUser', verifyToken, validateRegister, addUserByRole);

// Remove user (restricted based on role)
router.delete('/removeUser/:userID', verifyToken, removeUser);

// Fetch users by type (any authorized user can fetch)
router.get('/getUsersByType', verifyToken, getUsersByType);

// Update user (restricted based on role)
router.put('/updateUser/:userID', verifyToken, updateUser);

// Plan routes
router.post('/plan', verifyToken, validatePlan, addPlan);
router.delete('/plan/:id', verifyToken, removePlan);
router.put('/plan/:id', verifyToken, updatePlan);
router.get('/getallplan', verifyToken, getAllPlans);
router.get('/users/search/:email', verifyToken, authorizeAdminManager, fetchUsersByEmail);

// Attendance routes
router.post('/attendance', verifyToken, markAttendance);
router.get('/attendance/:id', verifyToken, viewAttendance);

// User Plan routes
router.post('/Userplan/assign', verifyToken, authorizeAdminManagerTrainer, assignOrChangePlan);
router.put('/Userplan/update', verifyToken, authorizeAdminManagerTrainer, updatePlan);
router.put('/invoice/update', verifyToken, authorizeAdminManagerTrainer, updateInvoice);

router.get('/getinvoicesbyid/:id', verifyToken, authorizeAdminManagerTrainer, getinvoicesbyid);
router.get('/invoicesbyuser/:userId', verifyToken, authorizeAdminManagerTrainer, invoicesbyuser);
router.get('/getallinvoices', verifyToken, authorizeAdminManager, getallinvoices);

// Reports
router.get('/inactive-users', verifyToken, authorizeAdminManagerTrainer, getInactiveUsers);
router.get('/expiring-plans', verifyToken, authorizeAdminManagerTrainer, getExpiringPlans);
router.get('/users-payments-due', verifyToken, authorizeAdminManagerTrainer, getUsersWithPaymentsDue);

// Route to create new invoice
router.post('/createinvoice', verifyToken, createInvoice);

// Trainer routes
router.put('/assign-trainer', verifyToken, authorizeAdminManager, assignTrainerToUser);

// Route to update a user's trainer
router.put('/updateTrainer', verifyToken, authorizeAdminManager, updateTrainerForUser);

// Expense routes
router.post('/addexpense', verifyToken, authorizeAdminManager, addExpense);
router.get('/getallexpense', verifyToken, authorizeAdminManager, getAllExpenses);

// Password management routes
router.post('/ForgotPassword', forgotPassword);
router.post('/resetPassword/:resetToken', resetPassword);
router.post('/resetPasswordWithOldPassword', verifyToken, resetPasswordWithOldPassword);

module.exports = router;
