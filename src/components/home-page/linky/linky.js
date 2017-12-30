import React from 'react';
import gql from 'graphql-tag';
import graphql from 'react-apollo/graphql';
import { shape, arrayOf, string, array, object, func } from 'prop-types';
import { getAuth } from '../../../service/authentication';

import Tag from './tag/tag';
import CommentsList from './comments-list/comments-list';
import DateTime from '../../shared/date-time/date-time';

import './linky.css';

function renderTags(tags) {
	return tags.map(tag => {
		return (<Tag key={tag.id} tag={tag} onClick={() => (void 0)} />);
	});
}

class Linky extends React.Component {

	constructor() {
		super();

		this.state = {
			showComments: false
		};
	}

	onCommentAdded = (store, comment) => {
		const { linky } = this.props;
		const _linky = {
			...linky,
			comments: linky.comments.concat(comment)
		}
		this.props.onLinkyModified(store, _linky);
	}

	removeCommentHandler = (store, commentId) => {
		const _linky = {...this.props.linky};
		const commentIndex = (_linky.comments || []).findIndex(_comment => _comment.id === commentId);

		if (commentIndex !== -1) {
			_linky.comments = [..._linky.comments.slice(0, commentIndex), ..._linky.comments.slice(commentIndex + 1)];
		}

		this.props.onLinkyModified(store, _linky);
	}

	likeCommentHandler = (event) => {
		event.preventDefault();
		const { linky } = this.props;
		const userInfo = getAuth();
		const alreadyVoted = !!linky.votes.find(({ id }) => id === userInfo.id);

		// TODO Only use server validation???
		if (linky.owner.id === userInfo.id) {
			// TODO Show error to users
			console.error('User cannot vote for one of its links');
		} else if (alreadyVoted) {
			// TODO Show error to users
			console.error('User cannot vote for this linky as he already voted for it');
		} else {
			this.props.likeLinkyMutation({
				variables: { linkId: linky.id },
				update: (store, { data: { addLinkVote } }) => {
					this.props.onLinkyModified(
						store,
						{
							...linky,
							votes: linky.votes.concat(addLinkVote)
						}
					);
				}
			});
		}
	}

	render() {
		const { linky } = this.props;

		return (
			<li className="linky">
				<div className="box">
					<article className="media">
						<div className="media-left">
							<figure className="image is-64x64">
								<img
									src={linky.imageUrl || '/images/linky-default-image.jpg'}
									alt={linky.text}
								/>
							</figure>
						</div>
						<div className="media-content">
							<div className="content">
								<p className="linky-header">
									Published by&nbsp;
									<strong>{linky.owner.name}</strong>
									&nbsp;on:&nbsp;
									<small className="created-date"><DateTime date={linky.createdAt} /></small>
									<span className="is-pulled-right">
										{
											!!linky.votes.length &&
											(<span>{linky.votes.length}&nbsp;{`like${linky.votes.length > 1 ? 's' : ''}`}</span>)
										}
										<span className="icon like-linky" onClick={this.likeCommentHandler}>
											<i className="fa fa-thumbs-o-up"></i>
										</span>
									</span>
								</p>
								<a href={linky.url} className="url" target="_blank">{linky.title || linky.url}</a>
								{
									linky.description &&
									<p className="linky-description">{linky.description}</p>
								}
							</div>
							<div className="level is-mobile">
								<div className="level-left">
									{renderTags(linky.tags)}
								</div>
								<div className="level-right">
									<a
										href="#"
										className="is-primary"
										onClick={(event) => {
											event.preventDefault();
											this.setState(({ showComments }) => {
												return { showComments: !showComments }
											});
										}}
									>
										{
											!!linky.comments.length && linky.comments.length
										}
										&nbsp;{`Comment${linky.comments.length > 1 ? 's' : ''}`}
									</a>
								</div>
							</div>

							{
								this.state.showComments &&
								<CommentsList
									linky={linky}
									comments={linky.comments}
									onCommentAdded={this.onCommentAdded}
									removeCommentHandler={this.removeCommentHandler}
								/>
							}
						</div>
					</article>
				</div>
			</li>
		);
	}
}

Linky.propTypes = {
	linky: shape({
		user: shape({
			id: string.isRequired,
			name: string.isRequired
		}),
		url: string.isRequired,
		title: string,
		description: string,
		imageUrl: string,
		votes: array,
		text: string,
		tags: arrayOf(object),
		comments: arrayOf(object)
	}),
	onLinkyModified: func.isRequired
};

const LIKE_LINKY_MUTATION = gql`
	mutation LikeLinkMutation($linkId: ID!) {
		addLinkVote(linkId: $linkId) {
			id
		}
	}
`;

export default graphql(LIKE_LINKY_MUTATION, { name: 'likeLinkyMutation' })(Linky);
