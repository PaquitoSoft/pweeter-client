import React from 'react';
import {
	Router
} from 'react-router-dom'
import { object } from 'prop-types';

import Route from '../components/shared/route/route';
import LayoutHeader from './shared/layout-header/layout-header';
import HomePage from './home-page/home-page';
import LoginPage from './login-page/login-page';

import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import './app.css';

function App({ history }) {
	return (
		<div className="app">
			<LayoutHeader />

			<Router history={history}>
				<div className="main-content">
					<Route exact path="/" component={HomePage} />
					<Route path="/login" component={LoginPage} isPublicRoute={true} />
					<Route path="/login-callback" component={LoginPage} isPublicRoute={true} />
				</div>
			</Router>
		</div>
	);
}

App.propTypes = {
	history: object
};

export default App;
