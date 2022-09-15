const util = require('util');
const path = require('path');


const deployConversationTransferPlugin = async (client, serverlessClient, config) => {

    const { sid:workspaceSid } = await client.taskrouter.v1.workspaces.list({limit: 20})
        .then(workspaces => workspaces.find(workspace => workspace.friendlyName === 'Flex Task Assignment'))
        .catch(err => console.log(err));

    /** CONVERSATION TRANSFER SERVERLESS */
    const cwd = path.join(process.cwd(),'./server/flex/plugins/plugin-conversations-transfer-interaction/serverless-transfer-interaction');
    const pkgJson = require(`${cwd}/package.json`);
    let serviceName = 'serverless-transfer-interaction';


    const env = {
        WORKSPACE_SID: workspaceSid
    }    


    
    try{
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
            })
            .catch(err => console.log(err));
    

        /* CONVERSATION TRANSFER PLUGIN */
        const { domain } = service;

        const execFile = util.promisify(require('child_process').execFile);

        const pluginCwd = path.join(process.cwd(),'./server/flex/plugins/plugin-conversations-transfer-interaction/plugin-transfer-interaction');

        const pluginEnv = {
            ...process.env,
            TWILIO_ACCOUNT_SID: config.accountSid,
            TWILIO_AUTH_TOKEN: config.authToken,
            FLEX_APP_URL_TRANSFER_INTERACTION: `https://${domain}/transfer-interaction`

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

        console.log('Starting Plugin Deployment...');
        
        const pluginResult = await execFile('twilio', [
            'flex:plugins:deploy',
            `--changelog="Starter Pack deployment"`,
            `--major`
        ], {
            cwd: pluginCwd,
            shell: true,
            stdio: 'inherit',
            env: pluginEnv
        })
            .catch(err => console.log(err));

        console.log(pluginResult);


    }

    catch(err){
        console.log(err.messsage);
    }

    
}

module.exports = {deployConversationTransferPlugin}
