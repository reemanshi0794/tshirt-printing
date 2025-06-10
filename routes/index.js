const express = require('express');
const { processDesignPrompt } = require('../controllers/stagesController');

const router = express.Router();

router.post('/generate-design', processDesignPrompt);

module.exports = router;
