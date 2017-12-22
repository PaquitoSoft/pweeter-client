import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import App from './components/app';
import registerServiceWorker from './registerServiceWorker';

const httpLink = new HttpLink({
	uri: 'http://localhost:3003'
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
