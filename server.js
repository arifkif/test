require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/refresh', (req, res) => {
	const refreshToken = req.body.refreshToken;
	const spotifyApi = new SpotifyWebApi({
		// redirectUri  : 'process.env.PORT || 5000',
		redirectUri  : 'https://dts-final-152235865101294.herokuapp.com/',
		// redirectUri  : 'http://localhost:5000',
		clientId     : '95a091675bf34d27b6d8d20146abc393',
		clientSecret : '571822d5202b47c79a8a906e04e5ddc9',
		refreshToken
	});
	spotifyApi
		.refreshAccessToken()
		.then((data) => {
			res.json({
				accessToken : data.body.accessToken,
				expiresIn   : data.body.expiresIn
			});
		})
		.catch(() => {
			res.sendStatus(400);
		});
});

app.post('/login', function(req, res) {
	const code = req.body.code;
	const spotifyApi = new SpotifyWebApi({
		// redirectUri  : 'process.env.PORT || 5000',
		// redirectUri  : 'http://localhost:5000',
		redirectUri  : 'https://dts-final-152235865101294.herokuapp.com/',
		clientId     : '95a091675bf34d27b6d8d20146abc393',
		clientSecret : '571822d5202b47c79a8a906e04e5ddc9'
	});

	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			res.json({
				accessToken  : data.body.access_token,
				refreshToken : data.body.refresh_token,
				expiresIn    : data.body.expires_in
			});
		})
		.catch((err) => {
			res.sendStatus(400);
		});
});

app.get('/lyrics', async (req, res) => {
	const lyrics = (await lyricsFinder(req.query.artist, req.query.track)) || 'No Lyrics Found';
	res.json({ lyrics });
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

// app.listen(3001);
app.listen(PORT, console.log(`Server is starting at ${PORT}`));
