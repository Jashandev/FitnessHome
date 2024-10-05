const RateLimit = require('express-rate-limit');

// Define the rate limit options
const limiter = RateLimit({
    windowMs: 2 * 60 * 1000, // 15 minutes
    max: 1, // limit each IP to 100 requests per windowMs
    message: 'Too many requests submission',
    headers: true,
});

module.exports = function(req, res, next) {
    limiter(req, res, next);
};
