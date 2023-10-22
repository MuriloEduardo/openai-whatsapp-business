const { WHATSAPP_BUSINESS_API_URL } = require("../utils/env");

const sendMessageToWhatsApp = async (text, from, to) => {
    try {
        await fetch(`${WHATSAPP_BUSINESS_API_URL}/whatsapp-business/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from, to, text })
        });
    } catch (error) {
        console.error(error);
    }
}

const getExtractedInfos = async (content) => {
    try {
        const response = await fetch(`${WHATSAPP_BUSINESS_API_URL}/whatsapp-business/extract-infos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content),
        })

        const infos = await response.json()

        return infos
    } catch (error) {
        console.error('getExtractedInfos error', error)
    }
}

module.exports = {
    getExtractedInfos,
    sendMessageToWhatsApp,
}