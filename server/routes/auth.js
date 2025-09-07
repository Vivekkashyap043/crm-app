const express = require('express');
const router = express.Router();



const { validateBody, schemas } = require('../middleware/validate');
const { register, login } = require('../controllers/authController');


router.post('/register', validateBody(schemas.register), register);
router.post('/login', validateBody(schemas.login), login);

module.exports = router;
