var express = require('express');
var router = express.Router();
const { initFlex } = require("../flex/");

/* POST users listing. */
router.post('/', function(req, res, next) {
    const { accountSid, authToken } = req.body;

    console.log('Starting Flex deployment...');
    try{
        initFlex({ accountSid, authToken });

        const response = {
            "response": "Deployment started successfully"
    }

    res.status(201).send(JSON.stringify(response));

    }

    catch(err){
        res.status(500).send(JSON.stringify(err));
    }

    
});

module.exports = router;
