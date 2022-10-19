const util = require('util');
const path = require('path');

const { createMessage, logError, updateStatus } = require('../helpers/message-helper');

const deployParkAnInteracionPlugin =  async (client, serverlessClient, config) => {
    let messageIndex = 0;

    try {
        messageIndex = await createMessage(client,config,'Start Park an Interaction Deployment');
        
        await updateStatus(client, config, messageIndex, 'done');

        messageIndex = await createMessage(client,config,'Find Flex TaskRouter Workspace');
    
        const { sid:workspaceSid } = await client.taskrouter.v1.workspaces.list({limit: 20})
            .then(workspaces => workspaces.find(workspace => workspace.friendlyName === 'Flex Task Assignment'));


        await updateStatus(client, config, messageIndex, 'done');

        /** PARK AN INTERACTION SERVERLESS */

        let env = {
            WORKSPACE_SID: workspaceSid,
            TWILIO_NUMBER: config.plugins.find(plugin => plugin.code === 'park-an-interaction').env.find(envVar => envVar.name === 'TWILIO_NUMBER').value
        }   

        const cwd = path.join(process.cwd(),'./server/flex/flex-plugins/plugin-conversations-park-an-interaction/serverless-park-an-interaction');
        const pkgJson = require(`${cwd}/package.json`);
        let serviceName = 'serverless-park-an-interaction';

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
            env,
            pkgJson,
            serviceName,
            functionsEnv: "dev",
            functionsFolderName: "functions"
            });

        const { domain } = service;

        env = {
            ...env,
            CONVERSATIONS_WEBHOOK_URL: `https://${domain}/unpark-an-interaction`
        }

        await serverlessClient.deployLocalProject({
            cwd,
            env,
            serviceSid: service.serviceSid,
            pkgJson,
            serviceName,
            functionsEnv: "dev",
            functionsFolderName: "functions"
            });

            
        await updateStatus(client, config, messageIndex, 'done');

        /* CONVERSATION TRANSFER PLUGIN */
        messageIndex = await createMessage(client,config,'Deploy Flex Plugin');

        const execFile = util.promisify(require('child_process').execFile);

        const pluginCwd = path.join(process.cwd(),'./server/flex/flex-plugins/plugin-conversations-park-an-interaction/plugin-park-an-interaction');

        const pluginEnv = {
            ...process.env,
            TWILIO_ACCOUNT_SID: config.accountSid,
            TWILIO_AUTH_TOKEN: config.authToken,
            FLEX_APP_URL_PARK_AN_INTERACTION: `https://${domain}/park-an-interaction`

        };

        const result = await execFile('npm', [
            'install',
        ], {
            cwd: pluginCwd,
            shell: true,
            stdio: 'inherit',
            env: pluginEnv
        })
            .catch(err => console.log(err));

        console.log(result.stdout);

        const devInstallResult = await execFile('npm', [
            'install',
            '@twilio/flex-ui@2.0.0-beta.1'
        ], {
            cwd: pluginCwd,
            shell: true,
            stdio: 'inherit',
            env: pluginEnv
        })
            .catch(err => console.log(err));

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
        })
            .catch(err => console.log(err));

        await updateStatus(client, config, messageIndex, 'done');

    }

    catch(err){
        console.log(err);
        logError(client, config, messageIndex, err);
        return;
    }
}

module.exports = {deployParkAnInteracionPlugin}