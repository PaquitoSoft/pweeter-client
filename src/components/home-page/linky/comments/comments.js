import React from 'react';

import Comment from './comment/comment';

import './comments.css';

class Comments extends React.Component {

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
						<div className="content">
							<div className="field">
								<div className="control">
									<textarea
										className="textarea"
										name="commentValue"
										placeholder="Write your comment"
										rows="2"
										onFocus={() => this.setState({ showButton: true })}
										onBlur={() => this.setState({ showButton: false })}
									/>
								</div>
							</div>
						</div>
						<div className="level is-mobile actions-container">
							<button className="button is-primary add-comment">Add</button>
						</div>
					</div>
				</article>
			</section>
		);
	}
}

export default Comments;
