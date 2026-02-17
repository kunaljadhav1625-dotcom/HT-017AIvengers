const { check, validationResult } = require('express-validator');

exports.validateRegistration = [
    check('voterId')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Voter ID is required')
        .isLength({ min: 3 })
        .withMessage('Voter ID must be at least 3 characters long'),

    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is required'),

    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
