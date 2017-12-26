import React from 'react';
import { bool, array, func } from 'prop-types';

import AddLinky from './add-linky/add-linky';
import Linky from './linky/linky';
import LinksQuery from './links-query';

import './home-page.css';

const RESULTS_QUERY_COUNT = 5;

class HomePage extends React.Component {

	renderLinkies(linkies) {
		return linkies.map(linky => (<Linky key={linky.id} linky={linky} />));
	}

	renderLoading() {
		return (
			<section className="section home-page">
				<div className="centered-container">
					<a
						href="#"
						className="button is-primary is-large is-outlined is-inverted is-loading">
					</a>
				</div>
			</section>
		);
	}

	renderMainContent(links) {
		return [
			(<AddLinky key="form" />),
			(
				<section key="list" className="pweets-list-container">
					<ol>
						{this.renderLinkies(links)}
					</ol>
				</section>
			)
		];
	}

	render() {
		return (
			<section className="section home-page">
				<div className="columns">
					<div className="column is-8 is-offset-2">
						<LinksQuery queryResultsSize={RESULTS_QUERY_COUNT}>
							{({ links/* , loadMoreLinks */ }) => {
								return this.renderMainContent(links);
							}}
						</LinksQuery>
					</div>
				</div>
			</section>
		);
	}
}

HomePage.propTypes = {
	isLoading: bool,
	links: array,
	loadMoreLinks: func
};

export default HomePage;
