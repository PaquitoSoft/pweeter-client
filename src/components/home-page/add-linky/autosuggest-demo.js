import React from 'react';
import Autosuggest from 'react-autosuggest';

import './autosuggest-demo.css';

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
	{ name: 'C', year: 1972 },
	{ name: 'Elm', year: 2012 },
	{ name: 'Javascript', year: 1995 },
	{ name: 'Java', year: 1990 },
	{ name: 'Ruby', year: 1990 },
	{ name: 'Python', year: 1990 },
	{ name: 'Rust', year: 1990 },
	{ name: 'C#', year: 1990 }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
function getSuggestions(value) {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;

	return inputLength === 0 ? [] : languages.filter(lang => {
		return lang.name.toLocaleLowerCase().slice(0, inputLength) === inputValue;
	});
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = suggestion => (
	<div>
		{suggestion.name}
	</div>
);

class AutosuggestDemo extends React.Component {
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
	}

	onChange(value, { newValue }) {
		this.setState({ value: newValue });
	}

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	onSuggestionsFetchRequested({ value, reason }) {

		/*
			value - the current value of the input
			reason - string describing why onSuggestionsFetchRequested was called. The possible values are:
				'input-changed' - user typed something
				'input-focused' - input was focused
				'escape-pressed' - user pressed Escape to clear the input (and suggestions are shown for empty input)
				'suggestions-revealed' - user pressed Up or Down to reveal suggestions
				'suggestion-selected' - user selected a suggestion when alwaysRenderSuggestions={true}
		*/
		this.setState({
			suggestions: getSuggestions(value)
		});
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
			onChange: this.onChange.bind(this)
		};

		return (
			<Autosuggest
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
				onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
				getSuggestionValue={getSuggestionValue}
				renderSuggestion={renderSuggestion}
				inputProps={inputProps}
				onSuggestionSelected={(event, { suggestion }) => {
					onTagSelected(suggestion.name);
					this.setState({ value: '' });
				}}
			/>
		);
	}

}

export default AutosuggestDemo;
