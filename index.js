const pubsub = require("./utils/pubsub");
const { WHATSAPP_BUSINESS_API_URL, OPENAI_API_URL } = require("./utils/env");

const subscription = pubsub.subscription('whatsapp-business-messages-sub');

const getOpenAIResponse = async (message) => {
    try {
        const aiResponse = await fetch(`${OPENAI_API_URL}/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message }),
        })

        const aiResponseJson = await aiResponse.json()
        const aiChoices = aiResponseJson.choices

        return aiChoices
    } catch (error) {
        console.error('getOpenAIResponse error', error)
    }
}

const sendMessageToWhatsApp = async (message) => {
    try {
        const whatsappResponse = await fetch(WHATSAPP_BUSINESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: process.env.WHATSAPP_PHONE_NUMBER,
                text: message
            })
        });

        console.log(`Message sent: ${message}`, whatsappResponse);
    } catch (error) {
        console.error(error);
    }
}

const getExtractedInfos = async () => {
    try {
        const extractedInfos = await fetch(`${WHATSAPP_BUSINESS_API_URL}/extract-infos`)
        return extractedInfos
    } catch (error) {
        console.error('getExtractedInfos error', error)
    }
}

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
    } catch (error) {
        console.error('Error onmessage subscription', error);
    }

    message.ack();
});
