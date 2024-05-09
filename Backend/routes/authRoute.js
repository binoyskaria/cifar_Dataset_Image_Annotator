
const express = require('express');
const router = express.Router();


const {handleLogin} =  require('./loginRegisterRoute/login');
const {handleRegister} = require('./loginRegisterRoute/register');

router.post('/login', handleLogin);
router.post('/register', handleRegister);


module.exports = router;