import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { bool, array, func } from 'prop-types';

function LinksQuery({ children, isLoading, links, loadMoreLinks }) {
	if (isLoading) {
		return (
			<section className="section centered-container">
				<a
					href="#"
					className="button is-primary is-large is-outlined is-inverted is-loading">
				</a>
			</section>
		)
	} else {
		return children({ links, loadMoreLinks });
	}
}

LinksQuery.propTypes = {
	children: func,
	isLoading: bool,
	links: array,
	loadMoreLinks: func
};

const SEARCH_LINKS_QUERY = gql`
	query SearchLinksQuery($first: Int!, $count: Int!) {
		searchLinks(criteria: {
			first: $first,
			count: $count
		}) {
			url
			id
			createdAt
			votes {
				name
			}
			tags {
				id
				name
			}
			owner {
				name
			}
			comments {
				text
				createdAt
				id
				user {
					id
					name
				}
			}
		}
	}
`;

export default graphql(
	SEARCH_LINKS_QUERY,
	{
		name: 'searchLinksQuery',
		options: ({ queryResultsSize }) => {
			return {
				variables: {
					first: 0,
					count: queryResultsSize
				}
			};
		},
		props: _props => {
			// console.log('LinksQuery::props#', JSON.stringify(_props));
			function loadMoreLinks(first, count) {
				return _props.searchLinksQuery.fetchMore({
					// query: SEARCH_LINKS_QUERY, // No need to set if it's the same as the original query
					variables: { first, count },
					updateQuery: (prevLinksResult, { fetchMoreResult }) => {
						if (!fetchMoreResult) return prevLinksResult; // eslint-disable-line
						return {
							...prevLinksResult,
							searchLinks: [...prevLinksResult.searchLinks, ...fetchMoreResult.searchLinks]
						};
					}
				});
			}

			return {
				..._props.ownProps,
				loadMoreLinks,
				isLoading: _props.searchLinksQuery.loading,
				links: _props.searchLinksQuery.searchLinks
			}
		}
	}
)(LinksQuery);