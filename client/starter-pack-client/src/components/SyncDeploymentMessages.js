import { useContext, useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid';
import { SyncClient } from 'twilio-sync'; 

import { SyncContext } from "../pages/FlexStarterPackPage";
import { retrieveToken } from "../helpers/ServerHelper";

import { Box } from '@twilio-paste/core/box';
import { Spinner } from '@twilio-paste/core/spinner';
import { CheckboxCheckIcon } from '@twilio-paste/icons/esm/CheckboxCheckIcon'
import { ErrorIcon } from "@twilio-paste/icons/esm/ErrorIcon";
import { Text } from '@twilio-paste/text';
import { Flex } from '@twilio-paste/core/flex';


export const SyncDeploymentMessages = () => {
    const syncContext = useContext(SyncContext);

    const [status, setStatus] = useState('Connecting...');
    const [errorMessage, setErrorMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [identity, setIdentity] = useState('');
    const [client, setClient] = useState();


    useEffect(() => {
        console.log('Retrieving token...');
        /* TODO - Persist identity */
        const uuid = uuidv4()
        setIdentity(uuid);
        retrieveToken(uuid, syncContext)
            .then(accessToken => {
                if (accessToken) {
                    if (client) {
                        // update the sync client with a new access token
                        refreshSyncClient(accessToken);
                    } else {
                        // create a new sync client
                        createSyncClient(accessToken);
                    }
                } else {
                this.setState({'errorMessage':'No access token found in result'});
                }

            })
        
        
    },[]);

    useEffect(() => {
        if(client){
            loadFormData();
        }
    }, [client, syncContext.syncData.documentName]);

    useEffect(() => {
        console.log(messages);

    }, [messages]);

    const createSyncClient = (token) => {
        const syncClient = new SyncClient(token, { logLevel: 'info' });
        syncClient.on('connectionStateChanged', function(state) {
            if (state === 'connected') {
                setClient(syncClient);
                setStatus('connected');
            } else {
                setStatus ('error');
                setErrorMessage(`Error: expected connected status but got ${state}`);
            }
        });
        syncClient.on('tokenAboutToExpire', function() {
          retrieveToken(identity);
        });
        syncClient.on('tokenExpired', function() {
          retrieveToken(identity);
        });
      }

    const refreshSyncClient = (token) => {
        client.updateToken(token);
      }

    const loadFormData = async () => {
    
        client.document(syncContext.syncData.documentName)
            .then(doc => {
                console.log(doc.data);
                setMessages(doc.data.messages);
                doc.on('updated', (data) => {
                    console.log('Sync Updated Data', data);
                    setMessages(data.data.messages);
                });
        
        });
    }

    const loadMessages = () => {
        return (
            messages.map(message => {
                return (
                    <Flex>
                        <Box>
                            {message.status === 'active'
                                ? <Spinner color={'blue'} decorative={true} title="Active Task" />
                                : message.status === 'done'
                                    ? <CheckboxCheckIcon color={'green'} decorative={true} title="Success" size={'sizeIcon40'} />
                                    : <ErrorIcon color={'red'} decorative={true} title="Error" size={'sizeIcon40'} />
                                }
                        </Box>
                        <Box backgroundColor={message.status === 'error' && 'pink'} >
                            <Text fontSize={'fontSize20'} >{message.action}</Text>
                            {message.status === 'error'
                                && <Text fontSize={'fontSize20'} fontWeight={'fontWeightSemibold'} >{message.message}</Text> }
                        </Box>          
                    </Flex> 
                )
            })
        )
    }

    return loadMessages();
}