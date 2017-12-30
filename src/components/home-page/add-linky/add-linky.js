import React from 'react';
import gql from 'graphql-tag';
import graphql from 'react-apollo/graphql';
import { object, func } from 'prop-types';

import Notification from '../../shared/notification/notification';

import './add-linky.css';

class AddLinky extends React.Component {

	constructor() {
		super();

		this.state = {
			isFolded: true,
			isCreatingLinky: false,
			currentErrorMessage: undefined
		};
	}

	documentClickHandler = e => {
		const isChild = [...document.querySelectorAll('.add-linky-container *')].includes(e.target);
		if (!isChild) {
			this.linkUrl.value = '';
			this.setState({ isFolded: true });
		}
	}

	documentKeydownHandler = e => {
		if (e.keyCode === 27) {
			this.linkUrl.value = '';
			this.setState({ isFolded: true });
		}
	}

	componentDidMount() {
		document.addEventListener('click', this.documentClickHandler);
		document.addEventListener('keydown', this.documentKeydownHandler);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.documentClickHandler);
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
						<input
							className="input is-small"
							name="linky-tags"
							placeholder="Set some tags"
							size="40"
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
