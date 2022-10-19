var express = require('express');
var router = express.Router();

const Twilio = require('twilio');

const AccessToken = Twilio.jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;

/* POST users listing. */
router.post('/', async function(req, res, next) {

    try{
        const { config, identity } = req.body;

        console.log(identity);

        const token = new AccessToken(
            config.accountSid,
            config.apiKeySid,
            config.apiKeySecret
        );
        
        // Assign the provided identity
        token.identity = identity;
        
        // Point to a particular Sync service, or use the account default Service
        const syncGrant = new SyncGrant({
            serviceSid: config.syncServiceSid || 'default'
        });
        token.addGrant(syncGrant);

        const response = {
            identity: token.identity,
            token: token.toJwt()
        }

        res.status(200).send(JSON.stringify(response));
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
