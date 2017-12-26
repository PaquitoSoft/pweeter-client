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
			}
		});

		console.log('This is the new comment:', newComment);
		// console.log(event.target);
		// console.log(this.commentText.value);
		this.commentText.value = '';
	}

	renderComments(comments) {
		return comments.map((comment, index) => {
			return (<Comment key={index} comment={comment} />);
		});
	}

	render() {
		return (
			<section className="comments-section">
				{this.renderComments(this.props.comments)}

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
	addCommentMutation: func
};

const ADD_COMMENT_MUTATION = gql`
	mutation AddCommentMutation($linkId: ID!, $comment: String!) {
		addLinkComment(
			linkId: $linkId,
			comment: $comment
		) {
			user {
				name
			}
			createdAt
			text
		}
	}
`;

export default graphql(ADD_COMMENT_MUTATION, { name: 'addCommentMutation' })(CommentsList);
// export default Comments;
