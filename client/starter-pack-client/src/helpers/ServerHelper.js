import axios from 'axios';

export const startDeployment = async (data) => {
   return await axios.post('/deploy', data);
}

export const retrieveToken = async (identity, context) => {
    console.log(identity);
    const data = {
        config: {
            accountSid: context.formData.accountSid,
            apiKeySid: context.formData.apiKeySid,
            apiKeySecret: context.formData.apiKeySecret,
            syncServiceSid: context.syncData.syncServiceSid
        },
        identity
    }
    const result = await axios.post('/token', data);

    return result.data.token;
    
}