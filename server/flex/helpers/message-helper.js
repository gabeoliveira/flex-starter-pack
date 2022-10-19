const createMessage = async (client, config, action) => {
    const documentData = await client.sync.v1.services(config.syncServiceSid)
              .documents(config.documentSid)
              .fetch()
              .then(document => document.data)
              .catch(err => console.error(err));

    const messageIndex = documentData.messages.push({action, status: 'active'}) - 1;

    await client.sync.v1.services(config.syncServiceSid)
              .documents(config.documentSid)
              .update({data: documentData})
              .then(document => console.log(document.data))
              .catch(err => console.error(err));

    return messageIndex;

}

const logError = async(client, config, messageIndex, error) => {
    const documentData = await client.sync.v1.services(config.syncServiceSid)
              .documents(config.documentSid)
              .fetch()
              .then(document => document.data)
              .catch(err => console.error(err));

    documentData.messages[messageIndex].status = 'error';
    documentData.messages[messageIndex].message = error.toString();

    await client.sync.v1.services(config.syncServiceSid)
          .documents(config.documentSid)
          .update({data: documentData})
          .then(document => console.log(document.data))
          .catch(err => console.error(err));
          
}

const updateStatus = async(client, config, messageIndex, status) => {
    const documentData = await client.sync.v1.services(config.syncServiceSid)
              .documents(config.documentSid)
              .fetch()
              .then(document => document.data)
              .catch(err => console.error(err));

    console.log(messageIndex);

    documentData.messages[messageIndex].status = status;

    await client.sync.v1.services(config.syncServiceSid)
        .documents(config.documentSid)
        .update({data: documentData})
        .then(document => console.log(document.data))
        .catch(err => console.error(err));
}

module.exports = {
    createMessage,
    logError,
    updateStatus
}