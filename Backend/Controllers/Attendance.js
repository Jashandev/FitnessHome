const Attendance = require('../Models/Attendance');
const User = require('../Models/User');

// Mark attendance endpoint
const markAttendance = async (req, res) => {
    // Extract required information
    const { status, userId } = req.body;  // `userId` from the request body if marking for someone else
    const tokenUserId = req.user.userId;  // Extracted userId from the token for the logged-in user

    try {
        // Check if the logged-in user is marking their own attendance
        if (tokenUserId === userId || !userId) {
            // Mark attendance for themselves
            const attendance = new Attendance({
                user: tokenUserId,
                date: new Date(),
                status
            });
            await attendance.save();
            return res.status(201).json({ message: 'Attendance marked successfully for yourself.' });
        }

        // If user is marking attendance for someone else, verify userType and permissions
        if ([1, 2, 3].includes(req.user.userType)) {
            // If the user is a trainer, ensure they're marking attendance only for their assigned users
            if (req.user.userType === 3) {
                const user = await User.findById(userId);
                if (!user || String(user.trainer) !== String(req.user.userId)) {
                    console.log(user.trainer ,  req.user._id);

                    return res.status(403).json({ message: 'Trainers can only mark attendance for their users.' });
                }
            }

            // Mark attendance for another user (admin, manager, or trainer)
            const attendance = new Attendance({
                user: userId,
                date: new Date(),
                status
            });
            await attendance.save();
            return res.status(201).json({ message: 'Attendance marked successfully for another user.' });
        } else {
            return res.status(403).json({ message: 'Access denied. Only admin, manager, or trainer can mark attendance for others.' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// View own attendance
const viewAttendance = async (req, res) => {
	try {
		const attendance = await Attendance.find({ user: req.params.id });
		res.status(200).json(attendance);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { markAttendance, viewAttendance };
