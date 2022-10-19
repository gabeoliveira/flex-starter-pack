import { useCallback, useEffect, useState } from "react";

import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';
import { Switch, SwitchContainer } from '@twilio-paste/core/switch';
import {Input} from '@twilio-paste/core/input';
import {Label} from '@twilio-paste/core/label';
import {HelpText} from '@twilio-paste/core/help-text';

import { usePlugins, PluginContext } from "../hooks/PluginsProvider";

export const PluginCard = (props) => {
    const {plugins, setPlugins} = usePlugins();
    const { pluginIndex } = props;

    const [enabled, setEnabled] = useState(plugins[pluginIndex].enabled);

    const handleSwitchChange = () => {
        plugins[pluginIndex].enabled = !enabled;
        console.log(!enabled);
        setEnabled(enabled => !enabled);
        setPlugins(plugins);
      };

    const handleEnvChange = (event) => {
        const envIndex = plugins[pluginIndex].env.findIndex(envVar => envVar.name === event.target.name);
        plugins[pluginIndex].env[envIndex].value = event.target.value;
        setPlugins(plugins);
    }

    useEffect(() => {
        console.log(plugins);
    }, [enabled,plugins])

    return(
        <Box boxShadow={'shadowBorderWeaker'} borderStyle={'initial'} padding={'space30'} width={'300px'} minHeight={'300px'} borderRadius={'borderRadius10'} margin={'space30'} borderWidth={'borderWidth20'}>
                <Heading as="h2" variant="heading30">{plugins[pluginIndex].name}</Heading>
                <Paragraph>
                    {plugins[pluginIndex].description}
                </Paragraph>
                <SwitchContainer id={`${plugins[pluginIndex].code}_switch`} label={enabled ? 'Deploy' : "Don't deploy"}>
                    <Switch on={enabled} onClick={handleSwitchChange}/>
                </SwitchContainer>
                {
                    plugins[pluginIndex].env && enabled &&
                    <Box margin={'space30'}>
                        <Label htmlFor={`${plugins[pluginIndex].env[0].name}_title`} required>{plugins[pluginIndex].env[0].name}</Label>
                        <Input
                            aria-describedby={`${plugins[pluginIndex].env[0].name}_help_text`}
                            id={`${plugins[pluginIndex].env[0].name}`}
                            name={`${plugins[pluginIndex].env[0].name}`}
                            type="text"
                            onChange={handleEnvChange}
                        />
                        <HelpText id={`${plugins[pluginIndex].env[0].name}_help_text`}>{plugins[pluginIndex].env[0].description}</HelpText>
                    </Box>
                }   

        </Box>
        
    )
}