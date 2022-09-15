const { deployConversationTransferPlugin } =  require("./scripts/conversation-transfer");
const twilio = require("twilio");
const { TwilioServerlessApiClient } = require("@twilio-labs/serverless-api");



const initFlex = async (config) => {

    const client = twilio(config.accountSid,config.authToken);

    const serverlessClient = new TwilioServerlessApiClient({
        username: config.accountSid,
        password: config.authToken
      });

    /*DEPLOY CONVERSATION TRANSFER PLUGIN */
    await deployConversationTransferPlugin(client, serverlessClient, config);

}

module.exports = {initFlex}