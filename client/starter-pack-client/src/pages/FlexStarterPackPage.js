import { useState } from 'react';

import {Input} from '@twilio-paste/core/input';
import {Label} from '@twilio-paste/core/label';
import {HelpText} from '@twilio-paste/core/help-text';
import {Box} from '@twilio-paste/core/box';
import {Button} from '@twilio-paste/core/button';

import { startDeployment } from '../helpers/ServerHelper';


export const FlexStarterPackPage = () => {
    const [formData, setFormData] = useState({accountSid: '', authToken: ''});

    const handleSubmit = () => {
        startDeployment(formData);
    }

    return(
        <Box>
            <Box>
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
            <Box>
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
            <Box>
            <Button variant="primary" size="small" onClick={handleSubmit}>
                Deploy to Flex
            </Button>   
            </Box>
        </Box>
        
    )
}