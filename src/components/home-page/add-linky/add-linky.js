import React from 'react';
import gql from 'graphql-tag';
import graphql from 'react-apollo/graphql';
import { func } from 'prop-types';
import TagsInput from 'react-tagsinput';
import Autosuggest from 'react-autosuggest';

import Notification from '../../shared/notification/notification';
import AutosuggestDemo from './autosuggest-demo';

import 'react-tagsinput/react-tagsinput.css';
import './add-linky.css';

class AddLinky extends React.Component {

	constructor() {
		super();

		this.state = {
			isFolded: true,
			isCreatingLinky: false,
			currentErrorMessage: undefined,
			tags: [],
			suggestions: [
				{ id: 1, name: 'front-end' },
				{ id: 2, name: 'back-end' },
				{ id: 3, name: 'tech' },
				{ id: 4, name: 'team-management' },
				{ id: 5, name: 'agile' }
			]
		};

		this.suggestedTagsRender = this.suggestedTagsRender.bind(this);
	}

	documentClickHandler = e => {
		const isChild = [...document.querySelectorAll('.add-linky-container *')].includes(e.target);
		if (!isChild) {
			this.linkUrl.value = '';
			this.setState({ isFolded: true, tags: [] });
		}
	}

	documentKeydownHandler = e => {
		if (e.keyCode === 27) {
			this.linkUrl.value = '';
			this.setState({ isFolded: true, tags: []  });
		}
	}

	componentDidMount() {
		// document.addEventListener('click', this.documentClickHandler);
		document.addEventListener('keydown', this.documentKeydownHandler);
	}

	componentWillUnmount() {
		// document.removeEventListener('click', this.documentClickHandler);
		document.removeEventListener('keydown', this.documentKeydownHandler);
	}

	addLinkHandler = async (e) => {
		e.preventDefault();
		this.setState({ isCreatingLinky: true });
		this.props.createLinkMutation({
			variables: {
				url: this.linkUrl.value,
				tags: [] // TODO
			},
			update: (store, { data: { createLink } }) => {
				this.props.onLinkyAdded(store, createLink);
				this.linkUrl.value = '';
				this.setState({ isFolded: true, isCreatingLinky: false });
			}
		})
		.catch(error => {
			console.error('CreateLinkMutation::catch#', error);
			let errorMessage = 'Something weird happened. Pelase, try again later.';
			if (error.graphQLErrors && error.graphQLErrors.length) {
				errorMessage = error.graphQLErrors[0].message;
			}
			this.setState({
				currentErrorMessage: errorMessage,
				isCreatingLinky: false
			});
		});
	}

	suggestedTagsRender({ addTag }) {
		return (
			<AutosuggestDemo onTagSelected={addTag} />
		);
	}

	_suggestedTagsRender({ addTag, ...props }) {
		const handleChange = (event, { newValue, method }) => {
			if (method === 'enter') {
				event.preventDefault();
			} else {
				props.onChange(event);
			}
		};

		const inputValue = (props.value && props.value.trim()) || '';
		const inputLength = inputValue.length;

		let suggestions = this.state.suggestions.filter(suggestion => {
			console.log(suggestion.name, '---', inputValue);

			console.log(suggestion.name.startsWith(inputValue));

			return suggestion.name.startsWith(inputValue);
		});

		return (
			<Autosuggest
				ref={props.ref}
				suggestions={suggestions}
				shouldRenderSuggestion={value => value && value.trim().length > 0}
				getSuggestionValue={suggestion => suggestion.value}
				renderSuggestion={suggestion => (<span>{suggestion.name}</span>)}
				inputProps={{ ...props, onChange: handleChange }}
				onSuggestionSelected={(event, { suggestion }) => {
					addTag(suggestion.name);
				}}
				onSuggestionsClearRequested={() => { console.log('onSuggestionsClearRequested'); }}
				onSuggestionsFetchRequested={({ value, reason }) => {
					/*
						value - the current value of the input
						reason - string describing why onSuggestionsFetchRequested was called. The possible values are:
							'input-changed' - user typed something
							'input-focused' - input was focused
							'escape-pressed' - user pressed Escape to clear the input (and suggestions are shown for empty input)
							'suggestions-revealed' - user pressed Up or Down to reveal suggestions
							'suggestion-selected' - user selected a suggestion when alwaysRenderSuggestions={true}
					*/
					console.log('onSuggestionsFetchRequested');
					return this.suggestions;
				}}
			/>
		);
	}

	render() {
		const { isFolded, isCreatingLinky, currentErrorMessage } = this.state;

		const buttonProps = {
			className: `button is-primary is-pulled-right add-linky ${isCreatingLinky ? 'is-loading' : ''}`,
			onClick: this.addLinkHandler
		};

		if (isCreatingLinky) {
			buttonProps.disabled = 'true';
		}

		return (
			<section className="add-linky-container is-clearfix">
				<div className="field">
					<div className="control">
						<input
							className="input"
							name="linky-value"
							placeholder="Share a link"
							ref={node => this.linkUrl = node}
							onFocus={() => this.setState({ isFolded: false })}
							onClick={() => this.setState({ isFolded: false })}
						/>
					</div>
				</div>
				<div className={`field ${isFolded ? 'hidden' : ''}`}>
					<div className="control">
						<TagsInput
							className="react-tagsinput tags-selector"
							inputProps={{ placeholder: 'Set some tags' }}
							value={this.state.tags}
							renderInput={this.suggestedTagsRender}
							onChange={(selectedTags) => {
								this.setState({ tags: selectedTags });
								console.log('Selected tags:', selectedTags);
							}}
						/>
					</div>
					{
						/*
							<div className="control">
								<AutosuggestDemo />
							</div>
						*/
					}
				</div>
				{
					currentErrorMessage &&
					<Notification closeHandler={event => {
						// If I don't use the timeout, the document handler click will fire
						// after the notification is removed from the document thus, it will
						// think the click was outside the add-linky container and will fold
						// the container
						setTimeout(() => {
							this.setState({ currentErrorMessage: undefined });
						}, 4);
					}}>
						{currentErrorMessage}
					</Notification>
				}
				<div className={`add-linky-actions ${isFolded ? 'hidden' : ''}`}>
					<button {...buttonProps}>Share it!</button>
				</div>
			</section>
		);
	}
}

AddLinky.propTypes = {
	onLinkyAdded: func.isRequired,
	createLinkMutation: func.isRequired
};

const CREATE_LINK_MUTATION = gql`
	mutation CreateLinkMutation($url: String!, $tags: [ID!]) {
		createLink(link: {
			url: $url,
			tags: $tags
		}) {
			id
			url
			title
			description
			imageUrl
			createdAt
			votes {
				id
			}
			tags {
				id
				name
			}
			owner {
				id
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

export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(AddLinky);
