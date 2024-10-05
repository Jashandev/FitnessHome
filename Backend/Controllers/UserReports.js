const User = require('../Models/User');
const Invoice = require('../Models/Invoice');
const Attendance = require('../Models/Attendance');
const { default: mongoose } = require('mongoose');

// Get users not attending gym since registering or for a certain period (only userType 4)
const getInactiveUsers = async (req, res) => {
  try {
    const thresholdDate = new Date(new Date().setDate(new Date().getDate() - 7)); // Users who haven't attended in the last 7 days
    const userId = req.user.userId; // Assuming req.user contains the logged-in user's information

    // If the logged-in user is a trainer, filter by the users assigned to this trainer
    const trainerFilter = req.user.userType === 3 ? { trainer: new mongoose.Types.ObjectId(userId), userType: 4 } : { userType: 4 };

    const inactiveUsers = await User.aggregate([
      {
        $match: trainerFilter // Filter for userType 4 and trainer if applicable
      },
      {
        $lookup: {
          from: 'attendances', // Attendance collection
          localField: '_id',
          foreignField: 'user',
          as: 'attendanceRecords'
        }
      },
      {
        $addFields: {
          lastAttendance: { $max: '$attendanceRecords.date' } // Find the last attendance date for each user
        }
      },
      {
        $match: {
          $or: [
            { attendanceRecords: { $size: 0 } }, // Users with no attendance records
            { lastAttendance: { $lt: thresholdDate } } // Last attendance before the threshold date
          ]
        }
      },
      {
        $lookup: {
          from: 'plans', // Plan collection
          localField: 'plan',
          foreignField: '_id',
          as: 'plan' // Alias for the plan details (will replace the plan field with the actual plan object)
        }
      },
      {
        $unwind: {
          path: '$plan', // Unwind the plan array, making it a single object
          preserveNullAndEmptyArrays: true // This allows users without plans to be included in the result
        }
      }
    ]);

    res.status(200).json(inactiveUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get users whose plans will expire in the next 7 days (only userType 4)
const getExpiringPlans = async (req, res) => {
  try {
    const currentDate = new Date();
    const userId = req.user.userId;

    // If the logged-in user is a trainer, filter by the users assigned to this trainer
    const trainerFilter = req.user.userType === 3 ? { trainer: new mongoose.Types.ObjectId(userId) } : {};

    const expiringPlans = await User.find({
      userType: 4,
      ...trainerFilter
    }).populate({
      path: 'Invoice',
      match: { dueDate: { $lte: currentDate } }, // Find invoices with due dates that have passed
    }).populate({
      path: 'plan',
    });

    // Filter out users without matching invoices
    const filteredUsers = expiringPlans.filter(user => user.Invoice);

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get users with payment due in the next 7 days (only userType 4)
const getUsersWithPaymentsDue = async (req, res) => {
  try {
    const currentDate = new Date();
    const next7Days = new Date(new Date().setDate(new Date().getDate() + 7));
    const userId = req.user.userId;

    // If the logged-in user is a trainer, filter by the users assigned to this trainer
    const trainerFilter = req.user.userType === 3 ? { trainer: new mongoose.Types.ObjectId(userId) } : {};

    const duePayments = await User.find({
      userType: 4,
      ...trainerFilter
    }).populate({
      path: 'Invoice',
      match: { dueDate: { $gte: currentDate, $lte: next7Days } }, // Find invoices with due dates within the next 7 days
    }).populate({
      path: 'plan',
    });

    // Filter out users without matching invoices
    const filteredUsers = duePayments.filter(user => user.Invoice);

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInactiveUsers,
  getExpiringPlans,
  getUsersWithPaymentsDue
};
