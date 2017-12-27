import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { SERVER_API_URL } from './config/app-config';
import { getAuth } from './service/authentication';
import App from './components/app';

import registerServiceWorker from './registerServiceWorker';

const httpLink = new HttpLink({
	uri: SERVER_API_URL
	// fetch: (uri, options) => {
	// 	options.headers = {
	// 		...options.haders,
	// 		Authorization: `bearer ${getAuth.token}`
	// 	}
	// 	return fetch(uri, options);
	// }
});

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache()
});

const Main = (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);

ReactDOM.render(Main, document.getElementById('root'));

registerServiceWorker();
