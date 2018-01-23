import React from 'react';
import { func, object } from 'prop-types';
import { withApollo } from 'react-apollo/withApollo';
import gql from 'graphql-tag';
import Autosuggest from 'react-autosuggest';

import './tags-suggestions.css';


const TAGS_SEARCH_QUERY = gql`
	query TagsSearchQuery($filter: String!) {
		searchTags(filter: $filter) {
			id
			name
		}
	}
`;

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = suggestion => (
	<div>
		{suggestion.name}
	</div>
);

class TagsSuggestions extends React.Component {
	constructor() {
		super();

		// Autosuggest is a controlled component.
		// This means that you need to provide an input value
		// and an onChange handler that updates this value (see below).
		// Suggestions also need to be provided to the Autosuggest,
		// and they are initially empty because the Autosuggest is closed.
		this.state = {
			value: '',
			suggestions: []
		};

		this.onChange = this.onChange.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
	}

	onChange(event) {
		this.setState({ value: event.target.value });
		this.props.onChange(event.target.value);
	}

	getCurrentValue() {
		return this.state.value;
	}

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	onSuggestionsFetchRequested({ value/* , reason */}) {

		/*
			value - the current value of the input
			reason - string describing why onSuggestionsFetchRequested was called. The possible values are:
				'input-changed' - user typed something
				'input-focused' - input was focused
				'escape-pressed' - user pressed Escape to clear the input (and suggestions are shown for empty input)
				'suggestions-revealed' - user pressed Up or Down to reveal suggestions
				'suggestion-selected' - user selected a suggestion when alwaysRenderSuggestions={true}
		*/

		if (value && value.length > 1) {
			this.props.client.query({
				query: TAGS_SEARCH_QUERY,
				variables: { filter: value },
				// TODO Carlos: When creating a new linky with new tags, it's not easy at all
				// to update local cache for new tags queries cached with no result
				// so I ended up ignoring cache for this query
				fetchPolicy: 'network-only'
			})
			.then(response => {
				console.log('These are the tags founded:', response.data.searchTags);
				this.setState({
					suggestions: response.data.searchTags
				})
			})
			.catch(error => {
				console.error('Error searching for tags:', error);
			});
		}
	}

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested() {
		this.setState({ suggestions: [] });
	}

	render() {
		const { onTagSelected = () => (false) } = this.props;
		const { value, suggestions } = this.state;

		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			placeholder: 'Set some tags',
			value,
			onChange: this.onChange
		};

		return (
			<Autosuggest
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				getSuggestionValue={getSuggestionValue}
				renderSuggestion={renderSuggestion}
				inputProps={inputProps}
				onSuggestionSelected={(event, { suggestion }) => {
					console.log('Suggestion selected:', suggestion);
					onTagSelected(suggestion);
					this.setState({ value: '' });
				}}
			/>
		);
	}

}


TagsSuggestions.propTypes = {
	onChange: func.isRequired,
	onTagSelected: func.isRequired,
	client: object.isRequired
};

export default withApollo(TagsSuggestions);
