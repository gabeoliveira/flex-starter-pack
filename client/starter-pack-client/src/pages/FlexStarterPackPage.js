import { createContext, useState, useEffect } from 'react';

import {Input} from '@twilio-paste/core/input';
import {Label} from '@twilio-paste/core/label';
import {HelpText} from '@twilio-paste/core/help-text';
import {Box} from '@twilio-paste/core/box';
import {Button} from '@twilio-paste/core/button';
import {Text} from '@twilio-paste/text';
import { Flex } from '@twilio-paste/core/flex';


import { startDeployment } from '../helpers/ServerHelper';
import { availablePlugins } from "../config/plugins";


import { SyncDeploymentMessages } from '../components/SyncDeploymentMessages';
import { PluginCard } from '../components/PluginCard';
import { PluginContext } from '../hooks/PluginsProvider';

export const SyncContext = createContext();


export const FlexStarterPackPage = () => {
    const [formData, setFormData] = useState({accountSid: '', authToken: '', apiKeySid: '', apiKeySecret: ''});
    const [isWaiting, setWaiting] = useState(false);
    const [isDone, setDone] = useState(false);
    const [requestStatus, setRequestStatus] = useState('');
    const [requestError, setRequestError] = useState(false);
    const [syncData, setSyncData] = useState({syncServiceSid: '', documentName: ''});
    const [plugins, setPlugins] = useState(availablePlugins.plugins);


    const handleSubmit = async () => {
        console.log(formData);
        setWaiting(true);
        startDeployment({formData, plugins})
            .then(resp => {
                console.log(resp);
                setRequestStatus(resp.data.status);
                setSyncData({...syncData, syncServiceSid: resp.data.syncServiceSid, documentName: resp.data.documentName});
                //setDone(true);
            })
            .catch(err => {
                console.log(err);
                setRequestStatus(err.response.data.status);
                setRequestError(true);
            })
            .finally(() => setWaiting(false));
    }

    return(
        <Flex>
             <Box margin={'space30'}>
                <Box boxShadow={'shadowBorderPrimary'} borderRadius={'borderRadius10'} padding={'space60'} borderWidth={'borderWidth20'}>
                    <Box margin={'space30'}>
                        <Label htmlFor="account_sid_title" required>Account SID</Label>
                        <Input
                            aria-describedby="twilio_account_sid_help_text"
                            id="twilio_account_sid"
                            name="twilio_account_sid"
                            type="text"
                            placeholder="ACxxx"
                            onChange={(e) => {
                                const updatedFormData = {...formData, accountSid: e.target.value};
                                setFormData(updatedFormData);
                            }}
                        />
                        <HelpText id="twilio_account_sid_help_text">Your Twilio Account SID.</HelpText>
                    </Box>
                    <Box margin={'space30'}>
                        <Label htmlFor="auth_token_title" required>Auth Token</Label>
                        <Input
                            aria-describedby="auth_token_help_text"
                            id="auth_token"
                            name="auth_token"
                            type="password"
                            onChange={(e) => {
                                const updatedFormData = {...formData, authToken: e.target.value};
                                setFormData(updatedFormData);
                            }}
                        />
                        <HelpText id="auth_token_help_text">Your Authentication Token.</HelpText>
                    </Box>
                    <Box margin={'space30'}>
                        <Label htmlFor="api_secret_sid_title" required>API Key SID</Label>
                        <Input
                            aria-describedby="api_secret_sid_help_text"
                            id="api_secret_sid"
                            name="api_secret_sid"
                            type="text"
                            onChange={(e) => {
                                const updatedFormData = {...formData, apiKeySid: e.target.value};
                                setFormData(updatedFormData);
                            }}
                        />
                        <HelpText id="api_secret_sid_help_text">For this deployment, an API Key is required. To create a new one, follow <a href="https://console.twilio.com/us1/account/keys-credentials/api-keys">these</a> instructions.</HelpText>
                    </Box>
                    <Box margin={'space30'}>
                        <Label htmlFor="api_key_secret_title" required>API Key Secret</Label>
                        <Input
                            aria-describedby="api_key_secret_help_text"
                            id="api_key_secret"
                            name="api_key_secret"
                            type="password"
                            onChange={(e) => {
                                const updatedFormData = {...formData, apiKeySecret: e.target.value};
                                setFormData(updatedFormData);
                            }}
                        />
                        <HelpText id="auth_token_help_text">Your API Key Secret.</HelpText>
                    </Box>
                    <Box margin={'space30'}>
                    <Button variant="primary" size="small" loading={isWaiting} disabled={isDone} onClick={handleSubmit}>
                        Deploy to Flex
                    </Button>   
                    </Box>
                    {
                        requestStatus &&
                        <Text color={requestError ? 'red' : 'black'} >{requestStatus}</Text>
                    }
                </Box>
                    {
                        syncData.documentName &&
                        <SyncContext.Provider value={{syncData, formData}}>
                            <Box boxShadow={'shadowBorderPrimary'} padding={'space60'} borderRadius={'borderRadius10'} borderWidth={'borderWidth20'} width={'100%'} marginTop={'space30'} >
                                <SyncDeploymentMessages />
                            </Box>
                        </SyncContext.Provider>
                    }
            </Box>
            <Box boxShadow={'shadowBorderPrimary'} padding={'space60'} borderRadius={'borderRadius10'} margin={'space30'} borderWidth={'borderWidth20'} width={'60%'}>
                <PluginContext.Provider value={{plugins, setPlugins}}>
                    <Flex wrap>
                        {
                            plugins.map(plugin => {
                                return <PluginCard key={`plugin_card_${plugin.code}`} pluginIndex={plugins.indexOf(plugin)} />
                            })
                        }
                    </Flex>
                </PluginContext.Provider>
                
            </Box>

        </Flex>
       
    )
}