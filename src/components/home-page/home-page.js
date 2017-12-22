import React from 'react';

import AddLinky from './add-linky/add-linky';
import Linky from './linky/linky';

import './home-page.css';

const fakeLinkies = [{
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

	renderLinkies(linkies) {
		return linkies.map(linky => (<Linky key={linky.id} linky={linky} />));
	}

	render() {
		return (
			<section className="section home-page">
				<div className="columns">
					<div className="column is-8 is-offset-2">

						<AddLinky />

						<section className="pweets-list-container">
							<ol>
								{this.renderLinkies(fakeLinkies)}
							</ol>
						</section>

					</div>
				</div>
			</section>
		);
	}
}

export default HomePage;
