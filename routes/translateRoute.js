const express = require('express');
const router = express.Router();
const {translate} = require("../controller/translateController");

router.post('/', translate);

module.exports = router;
