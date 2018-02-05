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

// Create history here so we can interact with it from apollo links
// https://github.com/ReactTraining/react-router/issues/4895
const browserHistory = createHistory();

const cache = new InMemoryCache();

const authLink = setContext((__, { headers }) => {
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

	return null;
});

const client = new ApolloClient({
	link: ApolloLink.from([errorHandlerLink, authLink, httpLink]),
	cache
});

const Main = (
	<ApolloProvider client={client}>
		<App history={browserHistory} />
	</ApolloProvider>
);

ReactDOM.render(Main, document.getElementById('root'));

registerServiceWorker();
