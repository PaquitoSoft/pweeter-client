/* global process */
let GITHUB_CLIENT_ID = '';
let SERVER_API_URL = '';

if (process.env.NODE_ENV === 'production') {
	GITHUB_CLIENT_ID = '306127e21bd0484a80c7';
	SERVER_API_URL = 'https://hidden-hollows-80141.herokuapp.com/graphql';
} else {
	GITHUB_CLIENT_ID = '7b27c811f4a00a863f4c';
	SERVER_API_URL = 'http://localhost:3003/graphql';
}

export {
	GITHUB_CLIENT_ID,
	SERVER_API_URL
}
