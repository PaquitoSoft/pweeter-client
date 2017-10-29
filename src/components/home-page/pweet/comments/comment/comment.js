import React from 'react';
import { shape, string } from 'prop-types';

function Comment({ comment }) {
	return (
		<article className="media">
			<p>
				<strong>{comment.usernme}</strong>
				<small>{comment.createDate}</small>
				<br/>
				{comment.text}
			</p>
		</article>
	);
}

Comment.propTypes = {
	comment: shape({
		username: string.isRequired,
		createDate: string.isRequired, // TODO: This must be a Date
		text: string.isRequired
	})
}

export default Comment;
