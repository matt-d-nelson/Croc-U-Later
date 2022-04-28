const express = require('express');
const router = express.Router();

let result = {};

router.get('/calculate', (req, res) => {
    console.log('calculate GET');
    res.send(result);
})

module.exports = router;