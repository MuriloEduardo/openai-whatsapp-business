const { OPENAI_API_URL } = require("./utils/env");

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

module.exports = {
    getOpenAIResponse,
}