const util = require('util');
const path = require('path');

const { createMessage, logError, updateStatus } = require('../helpers/message-helper');

const deployFlexLocalizationPlugin =  async (client, serverlessClient, config) => {
    let messageIndex = 0;

    try {
        messageIndex = await createMessage(client,config,'Start Flex Localization Deployment');
        
        await updateStatus(client, config, messageIndex, 'done');

        /** FLEX LOCALIZATION SERVERLESS */

        const env = {
            ENABLED: true
        };

        const cwd = path.join(process.cwd(),'./server/flex/flex-plugins/plugin-flex-localization/default');
        const pkgJson = require(`${cwd}/package.json`);
        let serviceName = 'flex-localization';

        messageIndex = await createMessage(client,config,'Deploy Serverless Components');

        const services = await client.serverless.services.list();

        const existingService = services.find((service) => service.uniqueName === serviceName);

        if(existingService){
           console.log('Service already exists. Creating new one');
           serviceName += `-${Math.floor(Math.random()*10000)}`
           console.log(serviceName);

           //TODO return message 
        }

        const service = await serverlessClient.deployLocalProject({
            cwd,
            pkgJson,
            env,
            serviceName,
            functionsEnv: "dev",
            functionsFolderName: "functions"
            });

        const { domain } = service;
            
        await updateStatus(client, config, messageIndex, 'done');

        /* FLEX LOCALIZATION PLUGIN */
        messageIndex = await createMessage(client,config,'Deploy Flex Plugin');

        const execFile = util.promisify(require('child_process').execFile);

        const pluginCwd = path.join(process.cwd(),'./server/flex/flex-plugins/plugin-flex-localization/flex-2.0');

        const pluginEnv = {
            ...process.env,
            TWILIO_ACCOUNT_SID: config.accountSid,
            TWILIO_AUTH_TOKEN: config.authToken,
            FLEX_APP_FUNCTIONS_BASE: `https://${domain}`

        };

        const result = await execFile('npm', [
            'install',
        ], {
            cwd: pluginCwd,
            shell: true,
            stdio: 'inherit',
            env: pluginEnv
        });

        console.log(result.stdout);

        const devInstallResult = await execFile('npm', [
            'install',
            '@twilio/flex-ui@2.0.0-beta.1'
        ], {
            cwd: pluginCwd,
            shell: true,
            stdio: 'inherit',
            env: pluginEnv
        });


        console.log(devInstallResult.stdout);

        console.log('Starting Plugin Deployment...');
        
        const pluginResult = await execFile('twilio', [
            'flex:plugins:deploy',
            `--changelog="Starter Pack deployment"`,
            `--major`,
            `-l debug`
        ], {
            cwd: pluginCwd,
            shell: true,
            stdio: 'inherit',
            env: pluginEnv
        });

        await updateStatus(client, config, messageIndex, 'done');

    }

    catch(err){
        console.log(err);
        logError(client, config, messageIndex, err);
        return;
    }
}

module.exports = {deployFlexLocalizationPlugin}