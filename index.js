const express = require('express')
const { PORT } = require("./utils/env")
const { getOpenAIResponse } = require("./services/openai")
const { getExtractedInfos, sendMessageToWhatsApp } = require("./services/whatsapp-business")

const app = express()

app.use(express.json())

const processWhatsAppBusinessMessages = async (data) => {
    const { text, from, to } = await getExtractedInfos(data)

    if (!text || !text.length) {
        console.error('No text to processWhatsAppBusinessMessages')
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
        const data = req.body

        console.log('receive-push', data);

        await processWhatsAppBusinessMessages(data)

        res.sendStatus(200)
    } catch (error) {
        console.error('receive-push error', error)

        res.sendStatus(500)
    }
})

app.listen(PORT, () => console.log(`Running in ${PORT}`))