const { deployConversationTransferPlugin } =  require("./scripts/conversation-transfer");
const { deployParkAnInteracionPlugin } = require('./scripts/park-an-interaction');
const { deployFlexLocalizationPlugin } = require('./scripts/flex-localization');

const twilio = require("twilio");
const { TwilioServerlessApiClient } = require("@twilio-labs/serverless-api");

const pluginScripts = {
  'conversation-transfer': deployConversationTransferPlugin,
  'park-an-interaction': deployParkAnInteracionPlugin,
  'flex-localization': deployFlexLocalizationPlugin,
  'default': (code) => console.error(`No deployment script for plugin ${code}`)
};

const initFlex = async (config) => {

      const client = twilio(config.apiKeySid, config.apiKeySecret, {accountSid:config.accountSid});

      const { plugins } = config;

      console.log(config);

      const serverlessClient = new TwilioServerlessApiClient({
          username: config.accountSid,
          password: config.authToken
        });

      const syncService = await client.sync.v1.services
        .list()
        .then(services => {
          return services.find(service => service.friendlyName === 'Flex Deployment Service')
            || client.sync.v1.services.create({friendlyName: 'Flex Deployment Service'})
                .then(service => service);
                
        });

      config.syncServiceSid = syncService.sid;

      const document = await client.sync.v1.services(config.syncServiceSid)
        .documents
        .create({uniqueName: `flex_starter_deployment_${Date.now().toString()}`, ttl: 3600, data: {messages: []}})
        .then(document => document);
        

      console.log(document);

      config.documentSid = document.sid;

      plugins
        .filter(plugin => plugin.enabled)
        .forEach(async (plugin) => { await pluginScripts[plugin.code](client, serverlessClient, config) });

      return {documentName:document.uniqueName, syncServiceSid: syncService.sid};
 

}

module.exports = {initFlex}