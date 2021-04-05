const sha1 = require('sha1')
const express = require('express')
const { data } = require('./src/data')

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())

// create question
app.post('/questions', async (req, res) => {

	const { question, answers } = req.body

	try {
		// insert question
		const SQL_QUESTION = `
			insert into questions(question_text)
			values($1)
			returning question_id
			;
		`

		const insertQuestion = await fetch(SQL_QUESTION, question)

		const questionId = insertQuestion[0].question_id

		// insert answer
			const SQL_ANSWERS = `
			insert into answers(answer_text, question_id)
			values($1, $2);
		`

		answers.forEach( async (answer) => {

			const insertAnswers = await fetch(SQL_ANSWERS, answer, questionId)

		})	

		res.send({
			status: 200,
			message: 'question added'
		})

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

})

// edit question
app.put('/questions', async (req, res) => {

	const { question_id, status } = req.body

	try {
		
		const SQL_EDIT = `
			update 
				questions
			set
				question_active = $1
			where
				question_id = $2
			returning
				question_id
			;
		`

		const editQuestion = await fetch(SQL_EDIT, status, question_id)

		res.send({
			status: 200,
			message: 'question edited',
			data: editQuestion
		}).end()

	} catch(e) {
		console.log(e)
	
		res.send({
			status: 500,
			message: e.message
		}).end()
	}

})

// fetch all Questions without true answer
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

app.post('/answer', async (req, res) => {

	const { answer, question_id } = req.body

	const answerRes = await data.find(q => {
		if(q.id === question_id) {
			return q.true === answer ? true : false
		}
	})

	res.send({ response: answerRes ? true : false }).end()
})

app.listen(PORT, () => console.log(`ready at http://localhost:${PORT}`))
