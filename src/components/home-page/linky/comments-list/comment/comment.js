import React from 'react';

import { shape, string } from 'prop-types';

import DateTime from '../../../../shared/date-time/date-time';

import './comment.css';

function Comment({ comment }) {
	return (
		<article className="comment media">
			<p>
				Comment by&nbsp;
				<strong>{comment.user.name}</strong>
				<small>&nbsp;(<DateTime date={comment.createdAt} />)</small>
				<br/>
				<span className="text">{comment.text}</span>
			</p>
		</article>
	);
}

Comment.propTypes = {
	comment: shape({
		user: shape({
			name: string.isRequired
		}),
		createdAt: string.isRequired, // TODO: This must be a Date
		text: string.isRequired
	})
}

export default Comment;
