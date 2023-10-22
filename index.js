const express = require('express')
const { PORT } = require("./utils/env")
const { getOpenAIResponse } = require("./services/openai")
const { getExtractedInfos, sendMessageToWhatsApp } = require("./services/whatsapp-business")

const app = express()

app.use(express.json())

const processWhatsAppBusinessMessages = async (message) => {
    const decodedValue = atob(message.data);
    const data = JSON.parse(decodedValue);

    const { text, from, to } = await getExtractedInfos(data)

    if (!text || !text.length) {
        console.error('No text to process')
        return
    }

    const aiChoices = await getOpenAIResponse(text)

    for (const choice of aiChoices) {
        const aiResponse = choice.message.content

        await sendMessageToWhatsApp(aiResponse, from, to)
    }
}

app.post('/receive-push', async (req, res) => {
    try {
        const { body } = req
        const { message } = body

        await processWhatsAppBusinessMessages(message)

        res.sendStatus(200)
    } catch (error) {
        console.error('Receive push error', error)
        res.sendStatus(500)
    }
})

app.listen(PORT, () => console.log(`Running in ${PORT}`))