const express = require('express')
const request = require('request')
const path = require('path')
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')

const app = express()

var client_id = process.env.CLIENT_ID
var client_secret = process.env.CLIENT_SECRET
var redirect_uri = process.env.REDIRECT_URI
const client_uri = `http://localhost:${process.env.NODE_ENV == "production" ? process.env.PORT : process.env.CLIENT_PORT}#`

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/../client/build')))
	.use(cors())
	.use(cookieParser())

var generateRandomString = function(length) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

var stateKey = 'spotify_auth_state'

app.get('/login', function(req, res) {

    var state = generateRandomString(16)
    res.cookie(stateKey, state)

	var scope = 'user-read-private user-read-email user-library-read'
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		}))
})

app.get('/callback', function(req, res) {

	var code = req.query.code || null
	var state = req.query.state || null
	var storedState = req.cookies ? req.cookies[stateKey] : null

	if (state === null || state !== storedState) {
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
			}))
	} else {
		res.clearCookie(stateKey)
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
			},
			json: true
		}

		request.post(authOptions, function(error, response, body) {
			if (!error && response.statusCode === 200) {

				var access_token = body.access_token,
					refresh_token = body.refresh_token

				var options = {
					url: 'https://api.spotify.com/v1/me',
					headers: { 'Authorization': 'Bearer ' + access_token  },
					json: true
				}

				// use the access token to access the Spotify Web API
				request.get(options, function(error, response, body) {
					console.log(body)
				})

				res.redirect(client_uri +
					querystring.stringify({
						access_token: access_token,
						refresh_token: refresh_token
					}))
			} else {
				res.redirect('/#' +
					querystring.stringify({
						error: 'invalid_token'
					}))
			}
		})
	}
})

app.get('/refresh_token', function(req, res) {

	// requesting access token from refresh token
	var refresh_token = req.query.refresh_token
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))  },
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	}

	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token
			res.send({
				'access_token': access_token
			})
		}
	})
})

app.get('*', (req, res) => {
  if (process.env.NODE_ENV == "production")
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
  else
    res.redirect(client_uri)
});


const port = process.env.PORT
app.listen(port)

console.log(`Server listening on ${port}`)
