const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
	database: process.env.DATABASE,
	user: process.env.USER,
	password: process.env.PASSWORD,
	port: 5432,
	host: 'localhost'
})

const fetch = async (SQL, ...params) => {

	const client = await pool.connect()
	console.log('db connected')

	try {
		
		const data = await client.query(SQL, params)

		return data.rows

	} catch(e) {
		console.log(e)
		console.log('Error MSG: ' + e.message)
	} finally {
		client.release()
		console.log('db disconnect...')
	}

}

module.exports = {
	fetch,
}
