require('dotenv').config();
const connectToMongo = require('./Database');
const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors')
const { createServer } = require('node:http');
const app = express()
const port = process.env.PORT
const server = createServer(app);
const userRoutes = require('./Routes/Routes')

connectToMongo();

app.use(cors())
app.use(bodyParser.json())
app.use(express.json());

// Use your routes (adjust the base path as necessary)
app.use('/api', userRoutes);


app.get('/', (req, res) => {
	res.send('Hello welcome!')
})

server.listen(port, () => {
	console.log(`Example app listening http://localhost:${port}`)
})