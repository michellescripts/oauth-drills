const express = require('express')
const request = require('request')
const app = express()
const port = 3000
const querystring = require('querystring')
require('dotenv').config()

app.use(express.static('public'))

app.get('/', (req, res, next) => {
  res.render('index')
})

app.get('/login', (req, res, next) => {
  let url = 'https://accounts.spotify.com/authorize?'
  let queryParams = querystring.stringify({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/redirect',
    state: 'abc123'
  })
  res.redirect(url + queryParams)
})

app.get('/redirect', (req, res, next) => {
  let {code} = req.query
  let base64 = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
  let options = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    form: {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/redirect'
    },
    headers: {Authorization: 'Basic ' + base64}
  }
  console.log('got auth code, getting token')
  request(options, (error, response, body) => {
    console.log(response.statusCode)
    if (!error && response.statusCode === 200) {
      console.log(body)
    }
  })
  res.send('redirect success')
})

app.listen(port, () => {
  console.log('listening here: ', port)
})
