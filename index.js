const express = require('express')
const { data } = require('./src/data')

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())

app.get('/questions', async (req, res) => {
	const onlyQuestions = await data.map(d => {
		return {
			id: d.id,
			question: d.question,
			answer: d.answer
		}
	})

	res.send(onlyQuestions).end()
})

app.post('/check', async (req, res) => {

	const { question_id } = req.body

	const answerRes = await data.find(q => q.id === question_id)

	res.send(answerRes).end()
})

app.listen(PORT, () => console.log(`ready at http://localhost:${PORT}`))
