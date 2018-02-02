import React, { Fragment } from 'react';
import { bool, array, func } from 'prop-types';

import AddLinky from './add-linky/add-linky';
import Linky from './linky/linky';
import LinksQuery, { SEARCH_LINKS_QUERY } from './links-query';

import './home-page.css';

const RESULTS_QUERY_COUNT = 5;

class HomePage extends React.Component {

	constructor() {
		super();
		this.state = {
			currentPage: 1
		};
	}

	updateLinkiesCache = (store, linky, isRemoveAction) => {
		const queryInfo = {
			query: SEARCH_LINKS_QUERY,
			variables: {
				first: 0,
				count: this.state.currentPage * RESULTS_QUERY_COUNT
			}
		};
		const data = store.readQuery(queryInfo);

		const linkyIndex = data.searchLinks.findIndex(link => link.id === linky.id);

		if (linkyIndex !== -1) {
			if (isRemoveAction) {
				data.searchLinks = data.searchLinks.filter(_linky => _linky.id !== linky.id);
			} else {
				data.searchLinks.splice(linkyIndex, 1, linky);
			}
		} else {
			data.searchLinks.unshift(linky);
		}

		store.writeQuery({
			...queryInfo,
			data
		});
	}

	renderLinkies(linkies = []) {
		return linkies.map(linky =>
			(<Linky
				key={linky.id}
				linky={linky}
				onLinkyModified={this.updateLinkiesCache} />
			)
		);
	}

	render() {
		return (
			<section className="section home-page">
				<div className="columns">
					<div className="column is-8 is-offset-2">
						<LinksQuery queryResultsSize={RESULTS_QUERY_COUNT}>
							{({ links/* , loadMoreLinks */ }) => {
								return (
									<Fragment>
										<AddLinky
											key="form"
											onLinkyAdded={this.updateLinkiesCache}
										/>
										<section key="list" className="pweets-list-container">
											<ol>
												{this.renderLinkies(links)}
											</ol>
										</section>
									</Fragment>
								);
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
