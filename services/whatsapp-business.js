const { WHATSAPP_BUSINESS_API_URL } = require("./utils/env");

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

module.exports = {
    getExtractedInfos,
    sendMessageToWhatsApp,
}