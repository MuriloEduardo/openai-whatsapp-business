const { pubsub } = require("./utils/pubsub");
const { getOpenAIResponse } = require("./services/openai");
const { getExtractedInfos, sendMessageToWhatsApp } = require("./services/whatsapp-business");

const subscription = pubsub.subscription('whatsapp-business-messages-sub');

subscription.on('message', async (message) => {
    try {
        const data = JSON.parse(message.data.toString());

        const { text, from, to } = await getExtractedInfos(data)

        if (!text || !text.length) {
            console.error('No text found');
            message.ack();
            return
        }

        const aiChoices = await getOpenAIResponse(text)

        for (const choice of aiChoices) {
            const aiResponse = choice.message.content

            await sendMessageToWhatsApp(aiResponse, from, to)
        }

        message.ack();
    } catch (error) {
        console.error('whatsapp-business-messages-sub error', error);

        message.nack();
    }
});
