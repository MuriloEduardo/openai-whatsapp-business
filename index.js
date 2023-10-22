const { pubsub } = require("./utils/pubsub");
const { getOpenAIResponse } = require("./services/openai");
const { getExtractedInfos, sendMessageToWhatsApp } = require("./services/whatsapp-business");

const subscription = pubsub.subscription('whatsapp-business-messages-sub');

subscription.on('message', async (message) => {
    try {
        const data = JSON.parse(message.data.toString());
        const text = data.text;

        console.log('text teste teste 123456', text);

        const extractedInfos = await getExtractedInfos(text)

        console.log('extractedInfos', extractedInfos);

        const aiChoices = await getOpenAIResponse(text)

        for (const choice of aiChoices) {
            const aiResponse = choice.message.content

            const sended = await sendMessageToWhatsApp(aiResponse)

            console.log('sendMessageToWhatsApp', sended);
        }

        message.ack();
    } catch (error) {
        console.error('Error onmessage subscription', error);
    }
});
