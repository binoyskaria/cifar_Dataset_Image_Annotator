
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware'); 
const {storeCifarImage} = require("./cifarImageRoute/storeCifarImage");
const{fetchCifarImage} = require("./cifarImageRoute/fetchCifarImage");


router.post("/cifarImage/storeCifarImage",isAdmin,storeCifarImage);

router.post("/cifarImage/fetchCifarImage",isAdmin,fetchCifarImage);

module.exports = router;