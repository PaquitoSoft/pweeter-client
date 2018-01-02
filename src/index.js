import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import createHistory from 'history/createBrowserHistory'

import { SERVER_API_URL } from './config/app-config';
import { getAuth } from './service/authentication';
import App from './components/app';

import registerServiceWorker from './registerServiceWorker';

const browserHistory = createHistory();

const authLink = setContext((_, { headers }) => {
	const auth = getAuth();
	const _headers = { ...headers };

	if (auth && auth.token) {
		_headers.authorization = `Bearer ${auth.token}`;
	}

	return { headers: _headers };
});

const httpLink = new HttpLink({
	uri: SERVER_API_URL
});

const errorHandlerLink = onError(({ graphQLErrors, networkError }) => {
	const isAuthError = (graphQLErrors || [])
		.map(error => error.statusCode)
		.filter(statusCode => statusCode === 401)
		.length > 0;

	if (isAuthError) {
		return browserHistory.push('/login');
	}

	if (networkError) {
		// TODO Show generic error to user
		console.log(`[Network error]: ${networkError}`);
	}
});

const client = new ApolloClient({
	link: ApolloLink.from([errorHandlerLink, authLink, httpLink]),
	cache: new InMemoryCache()
});

const Main = (
	<ApolloProvider client={client}>
		<App history={browserHistory} />
	</ApolloProvider>
);

ReactDOM.render(Main, document.getElementById('root'));

registerServiceWorker();
