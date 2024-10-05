const User = require('../Models/User'); // Assuming you have a User model

// Assign a trainer to a user
const assignTrainerToUser = async (req, res) => {
  try {
    const { userId, trainerId } = req.body;

    // Check if both the user and trainer exist
    const user = await User.findById(userId);
    const trainer = await User.findById(trainerId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!trainer || trainer.userType !== 3) { // Ensure the trainer is of userType 3 (Trainer)
      return res.status(404).json({ message: 'Trainer not found or invalid trainer type' });
    }

    // Assign the trainer to the user
    user.trainer = trainerId;
    await user.save();

    res.status(200).json({ message: 'Trainer assigned successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update trainer for a user
const updateTrainerForUser = async (req, res) => {
  try {
    const { userId, newTrainerId } = req.body;

    // Check if both the user and new trainer exist
    const user = await User.findById(userId);
    const newTrainer = await User.findById(newTrainerId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!newTrainer || newTrainer.userType !== 3) { // Ensure the new trainer is of userType 3 (Trainer)
      return res.status(404).json({ message: 'New trainer not found or invalid trainer type' });
    }

    // Update the user's trainer
    user.trainer = newTrainerId;
    await user.save();

    res.status(200).json({ message: 'Trainer updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { assignTrainerToUser, updateTrainerForUser };
