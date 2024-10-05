const plan = require("../Models/plan");
const User = require("../Models/User");
const Invoice = require("../Models/Invoice");

const authorizeAdminManagerTrainer = (req, res, next) => {
	const userType = req.user.userType;
	if (userType === 1 || userType === 2 || userType === 3) {
		next();
	} else {
		return res.status(403).json({ message: "Access denied" });
	}
};

const authorizeAdminManager = (req, res, next) => {
	const userType = req.user.userType;
	if (userType === 1 || userType === 2) {
		next();
	} else {
		return res.status(403).json({ message: "Access denied" });
	}
};


const assignOrChangePlan = async (req, res) => {
	try {
		const { userId, planId, discount } = req.body;

		// Only managers, admins, and trainers can assign or change plans
		const userType = req.user.userType;
		if (userType !== 1 && userType !== 2 && userType !== 3) {
			return res.status(403).json({ message: "Access denied" });
		}

		// Fetch the user and plan
		const user = await User.findById(userId);
		const planres = await plan.findById(planId);

		if (!user || !plan) {
			return res.status(404).json({ message: 'User or Plan not found' });
		}



		// Calculate the final amount with discount
		const finalAmount = planres.planPrice - discount;

		// Calculate due date by adding the plan duration in months to the current date
		const dueDate = new Date();
		dueDate.setMonth(dueDate.getMonth() + planres.planDuration);

		// Generate the invoice
		const newInvoice = {
			user: user._id,
			plan: planres._id,
			amount: planres.planPrice,
			dueDate: dueDate,
			discount,
			finalAmount,
			status: 'paid',
			description: `Plan assigned: ${planres.planName} to ${user.name} for ${planres.planDuration} Months`
		};

		const invres = await Invoice.create(newInvoice);

		// Assign or update the user's plan
		user.plan = planres._id;
		user.Invoice = invres._id;

		// Save user with updated plan
		await user.save();

		res.status(200).json({ message: 'Plan assigned/changed successfully', invoice: newInvoice });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};


const updatePlan = async (req, res) => {
	try {
		const { userId, planId, discount } = req.body;

		// Only managers, admins, and trainers can update plans
		const userType = req.user.userType;
		if (userType !== 1 && userType !== 2 && userType !== 3) {
			return res.status(403).json({ message: "Access denied" });
		}

		const user = await User.findById(userId);
		const plan = await Plan.findById(planId);

		if (!user || !plan) {
			return res.status(404).json({ message: 'User or Plan not found' });
		}

		// Update the plan with new details
		user.plan.planName = plan.planName;
		user.plan.planPrice = plan.planPrice;
		user.plan.planDuration = plan.planDuration;
		user.plan.planExpiry = new Date(new Date().setMonth(new Date().getMonth() + plan.planDuration));

		await user.save();

		// Recalculate the final amount with discount
		const finalAmount = plan.planPrice - discount;

		// Update the invoice with new plan details
		const invoice = await Invoice.findOne({ user: userId });
		invoice.amount = plan.planPrice;
		invoice.discount = discount;
		invoice.finalAmount = finalAmount;
		await invoice.save();

		res.status(200).json({ message: 'Plan updated successfully', invoice });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateInvoice = async (req, res) => {
	try {
		const { invoiceId, discount, status, planId } = req.body;

		// Only managers, admins, and trainers can update invoices
		const userType = req.user.userType;
		if (userType !== 1 && userType !== 2 && userType !== 3) {
			return res.status(403).json({ message: "Access denied" });
		}

		// Fetch the invoice by ID
		const invoice = await Invoice.findById(invoiceId);
		if (!invoice) {
			return res.status(404).json({ message: 'Invoice not found' });
		}

		// If there's a plan update, fetch the new plan
		if (planId) {
			const plan = await Plan.findById(planId);
			if (!plan) {
				return res.status(404).json({ message: 'Plan not found' });
			}

			// Update invoice amount with new plan's price
			invoice.amount = plan.planPrice;

			// If there's a discount, apply it
			invoice.discount = discount || invoice.discount;
			invoice.finalAmount = invoice.amount - invoice.discount;

			// Optionally update the description (e.g., for a new plan)
			invoice.description = `Updated to plan: ${plan.planName}`;
		}

		// Update payment status if provided
		if (status) {
			invoice.status = status;
		}

		// Save the updated invoice
		await invoice.save();

		res.status(200).json({ message: 'Invoice updated successfully', invoice });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};



module.exports = { assignOrChangePlan, updatePlan, authorizeAdminManagerTrainer, updateInvoice, authorizeAdminManager };
