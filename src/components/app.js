import React from 'react';

import HomePage from './home-page/home-page';

import 'bulma/css/bulma.css';
import './app.css';

function App() {
	return (
		<div className="app">
			<header>
				<div className="container">
					<h1 className="title">
						Pwitter
					</h1>
					<p className="subtitle">
						Share interest technical content with your collegues
					</p>
				</div>
			</header>

			<div className="main-content">
				<HomePage />
			</div>
		</div>
	);
}

export default App;
