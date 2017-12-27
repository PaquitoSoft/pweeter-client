import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { array, shape, string, func } from 'prop-types';

import Comment from './comment/comment';

import './comments-list.css';

class CommentsList extends React.Component {

	onSubmitComment = async (event) => {
		event.preventDefault();

		const newComment = await this.props.addCommentMutation({
			variables: {
				linkId: this.props.linky.id,
				comment: this.commentText.value
			},
			update: (store, { data: { addLinkComment } }) => {
				this.props.onCommentAdded(store, addLinkComment);
			}
		});

		this.commentText.value = '';
	}

	renderComments(linky, comments, removeCommentHandler) {
		return comments.map((comment, index) => {
			return (
				<Comment
					key={index}
					linkyId={linky.id}
					comment={comment}
					removeCommentHandler={removeCommentHandler}
				/>
			);
		});
	}

	render() {
		return (
			<section className="comments-section">
				{this.renderComments(this.props.linky, this.props.comments, this.props.removeCommentHandler)}

				<article className="media add-comment-container">
					<div className="media-content">
						<form onSubmit={this.onSubmitComment}>
							<div className="content">
								<div className="field">
									<div className="control">
										<textarea
											className="textarea"
											name="commentValue"
											placeholder="Write your comment"
											rows="2"
											ref={node => this.commentText = node}
										/>
									</div>
								</div>
							</div>
							<div className="level is-mobile actions-container">
								<button className="button is-primary add-comment">Add</button>
							</div>
						</form>
					</div>
				</article>
			</section>
		);
	}
}

CommentsList.propTypes = {
	linky: shape({
		id: string
	}),
	comments: array,
	addCommentMutation: func,
	onCommentAdded: func,
	removeCommentHandler: func
};

const ADD_COMMENT_MUTATION = gql`
	mutation AddCommentMutation($linkId: ID!, $comment: String!) {
		addLinkComment(
			linkId: $linkId,
			comment: $comment
		) {
			id
			user {
				id
				name
			}
			createdAt
			text
		}
	}
`;

export default graphql(ADD_COMMENT_MUTATION, { name: 'addCommentMutation' })(CommentsList);
