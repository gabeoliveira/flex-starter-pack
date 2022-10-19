
export const availablePlugins = {
    plugins: [
        {
            name: 'Conversation Transfer',
            code: 'conversation-transfer',
            description: 'This plugin adds a forward button in the chat in order to make a transfer either to an agent or a queue. It only has the capability of doing "cold" transfers.',
            enabled: false
        },
        {
            name: 'Park an Interaction',
            code: 'park-an-interaction',
            description: 'This plugin adds a pause button in the chat so the conversation history is not lost. Next time the customer writes a message, if the chat was paused, the history of the conversation will be present.',
            enabled: false,
            env: [
                {
                    name: 'TWILIO_NUMBER',
                    value: '',
                    description: 'Your Twilio Phone Number used for Flex. Add in E.164 format. Ex.: +551143214321'
                }
            ]
        },
        {
            name: 'Flex Localization',
            code: 'flex-localization',
            description: 'This plugin replaces all string prompts in the Flex UI with translations, localizing the UI to each logged-in user. This plugin also provides a Language Selection menu for the agents. Switching language reloads the appropriate language file and updates all the Flex Manager Template Strings.',
            enabled: false
        }
    ]
}