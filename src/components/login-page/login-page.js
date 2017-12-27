import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { func, shape, string } from 'prop-types';

import { GITHUB_CLIENT_ID } from '../../config/app-config';
import { storeAuth } from '../../service/authentication';

import './login-page.css';

function LoginPage({ location, loginMutation, history }) {
	const queryParams = new URLSearchParams(location.search);

	if (queryParams.has('code')) {
		// Fire login mutation and loading button
		const code = queryParams.get('code');
		const state = queryParams.get('state');

		loginMutation({
			variables: { code, state }
		})
		.then(result => {
			storeAuth(result.data.login);
			history.push('/');
		})
		.catch(error => {
			// TODO Show error to user and redirect to login
			console.log('Login error:', error);
		});

		return (
			<section className="section login-page">
				<button
					href="#"
					className="button is-primary is-large is-outlined is-loading login-button">
				</button>
			</section>
		);
	}

	return (
		<section className="section login-page">
			<a
				href={`https://github.com/login/oauth/authorize?scope=user:email&state=${Date.now()}&client_id=${GITHUB_CLIENT_ID}`}
				className="button is-primary is-large is-outlined login-button">
				<span>Login with GitHub</span>
				<span className="icon is-large">
					<i className="fa fa-github"></i>
				</span>
			</a>
		</section>
	);
}

LoginPage.propTypes = {
	location: shape({
		search: string
	}),
	loginMutation: func,
	history: shape({
		push: func
	})
};

const LOGIN_MUTATION = gql`
	mutation LoginMutation($code: String!, $state: String!) {
		login(
			providerType: "github",
			token: $code,
			hash: $state
		) {
			email
			name
			token
		}
	}
`;

export default graphql(LOGIN_MUTATION, { name: 'loginMutation'})(LoginPage);
