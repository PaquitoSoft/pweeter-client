import React from 'react';
import {
	BrowserRouter
} from 'react-router-dom'

import Route from '../components/shared/route/route';
import HomePage from './home-page/home-page';
import LoginPage from './login-page/login-page';

import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import './app.css';

function App() {
	return (
		<div className="app">
			<header>
				<div className="columns">
					<div className="column is-8 is-offset-2">
						<a href="/">
							<h1 className="title">
								Linky
							</h1>
						</a>
						<p className="subtitle">
							Share interest technical content with your collegues
						</p>
					</div>
				</div>
			</header>

			<BrowserRouter>
				<div className="main-content">
					<Route exact path="/" component={HomePage} />
					<Route path="/login" component={LoginPage} isPublicRoute={true} />
					<Route path="/login-callback" component={LoginPage} isPublicRoute={true} />
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
