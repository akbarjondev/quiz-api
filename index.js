const cors = require('cors')
const { lookup } = require('geoip-lite');
const sha1 = require('sha1')
const express = require('express')
const { fetch } = require('./src/db/db')

//test
const nodefetch = require('node-fetch')

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }))

// write history
app.use(async (req, res, next) => {

	const obj = req.method === 'GET' ? `${req.url};;${req.method}` : `${req.url};;${req.method};;${JSON.stringify(req.body)}`

	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

	const geoIP = JSON.stringify(lookup(ip))

	await fetch(`
		insert into 
			api_history(api_history_text, api_history_ip, api_history_geoip)
		values($1, $2, $3)
	`, obj, ip, geoIP)

	next()
})

// history users response to the server
app.get('/history/:secret', async (req, res) => {
	
	const { secret } = req.params

	if(scret = 'Glazer11235Team') {
		
		try {
			
			const historyRes = await fetch('select * from api_history')

			res.send({
				status: 200,
				message: 'fetch all history',
				data: historyRes
			})

		} catch(e) {
			console.log(e)

			res.send({
				status: 200,
				message: e.message
			})
		}

	}

})

// create question
app.post('/questions', async (req, res) => {

	const { question, answers, true_answer } = req.body

	try {
		// insert question
		const SQL_QUESTION = `
			insert into questions(question_text, question_true)
			values($1, $2)
			returning question_id
			;
		`

		const insertQuestion = await fetch(SQL_QUESTION, question, true_answer)

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
			message: 'question added',
			data: insertQuestion
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

		if(editQuestion.length > 0) {

			res.send({
				status: 200,
				message: 'question edited',
				data: editQuestion
			}).end()

		} else {

			res.send({
				status: 404,
				message: 'question not found :('
			}).end()

		}

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

	const selectQuestons = `
		select 
			q.question_id as id,
			q.question_text as question,
			array_agg(a.answer_text) as answers
		from 
			questions as q
		left join
			answers as a on q.question_id = a.question_id
		where
			question_active = 1
		group by
			question, id
		;
	`

	const onlyQuestions = await fetch(selectQuestons)

	res.send(onlyQuestions).end()
})

// deprecated
app.post('/check', async (req, res) => {

	const { question_id } = req.body

	const answerRes = await data.find(q => q.id === question_id)

	res.send(answerRes).end()
})

// check is Answer true or false 
app.post('/answer', async (req, res) => {

	const { answer, question_id } = req.body

	const answerRes = await fetch(`
		select
			question_id
		from
			questions
		where
			question_true = $1 and question_id = $2
	`, answer, question_id)

	let result = false, status = 400

	if(answerRes.length > 0) {
		result = true
		status = 200
	}

	res.send({
		status: status,
		message: result
	}).end()
})

app.listen(PORT, () => console.log(`ready at http://localhost:${PORT}`))
