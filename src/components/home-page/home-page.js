import React from 'react';

import AddPweet from './add-pweet/add-pweet';
import Pweet from './pweet/pweet';

import './home-page.css';

const fakePweets = [{
	id: '100',
	user: {
		id: 'jrkewjhfjkhsdkjhflkshfakl',
		name: '@HappyUser'
	},
	createDate: '26/10/2017 (12:35)',
	likes: 12,
	text: 'Here is the text for the share link',
	tags: [
		{ id: 0, name: 'front-end' },
		{ id: 1, name: 'reactjs' },
		{ id: 2, name: 'tutorial' }
	],
	comments: [
		{ username: '@PaquitoSoft', createDate: '26/10/2017 (17:05)', text: 'This is a cool comment' },
		{ username: '@RolloTomassi', createDate: '26/10/2017 (18:13)', text: 'Not so bad comment' }
	]
}];

class HomePage extends React.Component {

	renderPweets(pweets) {
		return pweets.map(pweet => (<Pweet key={pweet.id} pweet={pweet} />));
	}

	render() {
		return (
			<section className="section home-page">
				<div className="columns">
					<div className="column is-8 is-offset-2">

						<AddPweet />

						<section className="pweets-list-container">
							<ol>
								{this.renderPweets(fakePweets)}
							</ol>
						</section>

					</div>
				</div>
			</section>
		);
	}
}

export default HomePage;
