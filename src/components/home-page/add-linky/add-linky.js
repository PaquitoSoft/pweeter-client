import React from 'react';
import gql from 'graphql-tag';
import graphql from 'react-apollo/graphql';
import { func } from 'prop-types';
import TagsInput from 'react-tagsinput';

import Notification from '../../shared/notification/notification';
import TagsSuggestions from './tags-suggestions';

import 'react-tagsinput/react-tagsinput.css';
import './add-linky.css';

class AddLinky extends React.Component {

	constructor() {
		super();

		this.state = {
			isFolded: true,
			isCreatingLinky: false,
			currentErrorMessage: undefined,
			tags: []
		};

		this.selectedSuggestions = [];

		this.suggestedTagsRender = this.suggestedTagsRender.bind(this);
	}

	documentKeydownHandler = e => {
		if (e.keyCode === 27) {
			this.linkUrl.value = '';
			this.setState({ isFolded: true, tags: []  });
		}
	}

	componentDidMount() {
		document.addEventListener('keydown', this.documentKeydownHandler);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.documentKeydownHandler);
	}

	addLinkHandler = async (e) => {
		e.preventDefault();
		// TODO Validate URL and tags are provided
		this.setState({ isCreatingLinky: true });
		this.props.createLinkMutation({
			variables: {
				url: this.linkUrl.value,
				tags: [] // TODO: send the suggesstions
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
			<TagsSuggestions onTagSelected={suggestion => {
				if (!this.selectedSuggestions.some(_suggestion => _suggestion.id === suggestion.id)) {
					this.selectedSuggestions.push(suggestion);
					addTag(suggestion.name);
				}
			}} />
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
				</div>
				{
					currentErrorMessage &&
					<Notification closeHandler={event => {
						// If I don't use the timeout, the document handler click will fire
						// after the notification is removed from the document thus, it will
						// think the click was outside the add-linky container and will fold
						// the container
						// setTimeout(() => {
						// 	this.setState({ currentErrorMessage: undefined });
						// }, 4);
						this.setState({ currentErrorMessage: undefined });
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
