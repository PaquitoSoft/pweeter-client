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
			tags: [],
			currentTagValue: ''
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

	isNewDataValid() {
		return this.linkUrl.value.startsWith('http');
	}

	addLinkHandler = async (e) => {
		e.preventDefault();

		this.setState({ isCreatingLinky: true });

		const tags = [
			...this.selectedSuggestions
				.map(tag => ({
					id: tag.id,
					name: tag.name
				})),
			...this.state.currentTagValue
				.split(' ')
				.filter(text => text.length > 0)
				.map(tagName => ({ name: tagName }))
		];

		console.log('These are the tags we will send to server:', tags);

		if (!this.isNewDataValid()) {
			this.setState({ isCreatingLinky: false });
			return false;
		}

		this.props.createLinkMutation({
			variables: {
				url: this.linkUrl.value,
				tags
			},
			update: (store, { data: { createLink } }) => {
				// TODO: If we look for a non existing tag when creating a linky
				// and then creating it in the process of the new linky creation,
				// if we search for it again (wo/ reloading the page), it is not found.
				// It seems Apollo is caching the query with no results so we need to
				// refresh that query cache too
				this.props.onLinkyAdded(store, createLink);
				this.linkUrl.value = '';
				this.selectedSuggestions = [];
				this.setState({ isFolded: true, isCreatingLinky: false, tags: [], currentTagValue: '' });
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
				isCreatingLinky: false,
				tags: []
			});
		});
	}

	suggestedTagsRender({ addTag }) {
		return (
			<TagsSuggestions
				onChange={tagValue => this.setState({ currentTagValue: tagValue || '' })}
				onTagSelected={suggestion => {
					if (!this.selectedSuggestions.some(_suggestion => _suggestion.id === suggestion.id)) {
						this.selectedSuggestions.push(suggestion);
						addTag(suggestion.name);
					}
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
				{
					!isFolded &&
					<div className="field">
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
				}
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
				{
					!isFolded &&
					<div className="add-linky-actions">
						<button {...buttonProps}>Share it!</button>
					</div>
				}
			</section>
		);
	}
}

AddLinky.propTypes = {
	onLinkyAdded: func.isRequired,
	createLinkMutation: func.isRequired
};

const CREATE_LINK_MUTATION = gql`
	mutation CreateLinkMutation($url: String!, $tags: [LinkTag]) {
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
