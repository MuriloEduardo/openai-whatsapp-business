const pubsub = require("./utils/pubsub");

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
        const whatsappResponse = await fetch('https://api.whatsapp.com/send', {
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

subscription.on('message', async (message) => {
    try {
        const data = JSON.parse(message.data.toString());
        const text = data.text;

        console.log('text teste teste 123456', text);

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
