var express = require('express');
var router = express.Router();
const { initFlex } = require("../flex/");

/* POST users listing. */
router.post('/', async function(req, res, next) {

    const { accountSid, apiKeySid, apiKeySecret, authToken } = req.body.formData;
    const { plugins } = req.body;

    console.log('Starting Flex deployment...');
    try{
        
        const {documentName, syncServiceSid} = await initFlex({ accountSid, apiKeySid, apiKeySecret, authToken, plugins });

        if(documentName && syncServiceSid){
            const response = {
                status: "Deployment started successfully",
                documentName,
                syncServiceSid
    
            }
    
            res.status(201).send(JSON.stringify(response));

        }

       else {
            const response = {
                status:'authentication error'

            }
            res.status(500).send(JSON.stringify(response));
       }

    }

    catch(err){
        console.log(err.message);

        const response = {
            status:err.message

        }
        res.status(500).send(JSON.stringify(response));
    }

    
});

module.exports = router;
