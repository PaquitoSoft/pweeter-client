import React from 'react';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom'

import HomePage from './home-page/home-page';

import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import './app.css';

function App() {
	return (
		<div className="app">
			<header>
				<div className="container">
					<h1 className="title">
						Linky
					</h1>
					<p className="subtitle">
						Share interest technical content with your collegues
					</p>
				</div>
			</header>

			<div className="main-content">
				<Router>
					<Route exact path="/" component={HomePage} />
				</Router>
			</div>
		</div>
	);
}

export default App;
