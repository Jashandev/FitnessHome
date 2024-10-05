const User = require('../Models/User');
const Plan = require('../Models/plan');
const Invoice = require('../Models/Invoice');

// Assign a plan to a user and generate an invoice
exports.assignPlan = async (req, res) => {
  try {
    const { userId, planId, discount } = req.body;

    // Fetch the user and plan
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    if (!user || !plan) {
      return res.status(404).json({ message: 'User or Plan not found' });
    }

    // Assign or update the user's plan
    user.plan = {
      planName: plan.planName,
      planPrice: plan.planPrice,
      planDuration: plan.planDuration,
      planExpiry: new Date(new Date().setMonth(new Date().getMonth() + plan.planDuration)),
    };

    // Save user with updated plan
    await user.save();

    // Calculate the final amount with discount
    const finalAmount = plan.planPrice - (discount || 0);

    // Generate the invoice
    const newInvoice = new Invoice({
      user: user._id,
      amount: plan.planPrice,
      discount: discount || 0,
      finalAmount,
      status: 'unpaid',
      description: `Plan assigned: ${plan.planName}`,
    });

    // Save the invoice
    await newInvoice.save();

    res.status(200).json({ message: 'Plan assigned and invoice generated successfully', invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning plan', error: error.message });
  }
};

// Upgrade a user's plan
exports.upgradePlan = async (req, res) => {
  try {
    const { userId, planId, difference } = req.body;

    // Fetch the user and plan
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    if (!user || !plan) {
      return res.status(404).json({ message: 'User or Plan not found' });
    }

    // Update the user's plan
    user.plan.planName = plan.planName;
    user.plan.planPrice = plan.planPrice;
    user.plan.planDuration = plan.planDuration;
    user.plan.planExpiry = new Date(new Date().setMonth(new Date().getMonth() + plan.planDuration));

    // Save user with updated plan
    await user.save();

    // Calculate the invoice for the difference
    const finalAmount = difference;

    // Generate the invoice for the plan upgrade
    const newInvoice = new Invoice({
      user: user._id,
      amount: plan.planPrice,
      discount: 0,
      finalAmount,
      status: 'unpaid',
      description: `Plan upgraded to: ${plan.planName}`,
    });

    // Save the invoice
    await newInvoice.save();

    res.status(200).json({ message: 'Plan upgraded and invoice generated successfully', invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Error upgrading plan', error: error.message });
  }
};

// Generate an invoice for products/services
exports.generateInvoice = async (req, res) => {
  try {
    const { items, discount, totalAmount } = req.body;

    // Generate the invoice
    const newInvoice = new Invoice({
      items,
      discount: discount || 0,
      totalAmount,
      status: 'unpaid',
      description: `Invoice generated for products/services`,
    });

    // Save the invoice
    await newInvoice.save();

    res.status(200).json({ message: 'Invoice generated successfully', invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Error generating invoice', error: error.message });
  }
};
