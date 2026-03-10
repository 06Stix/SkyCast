const express = require('express')
const app = express()

const API_KEY = 'af5d462b9f26ca498f2f09ba18bc5173' 

app.use(express.static('.'))

app.get('/weather', async function(req, res) {
  const city = req.query.city
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  const response = await fetch(url)
  const data = await response.json()
  res.json(data)
})

app.get('/forecast', async function(req, res) {
  const city = req.query.city
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  const response = await fetch(url)
  const data = await response.json()
  res.json(data)
})

app.listen(3000, function() {
  console.log('Skycast server running on http://localhost:3000')
})