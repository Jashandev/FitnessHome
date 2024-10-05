const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();

const dbConnectionString = process.env.DB_CONNECTION_STRING;

async function connectToMongo() {
  try {
    await mongoose.connect( dbConnectionString ).then(()=>{console.log("connect to mongodb sucessfull" )})
  } catch (error) {
    console.log("Failed to connect")
  } 
}

module.exports = connectToMongo;