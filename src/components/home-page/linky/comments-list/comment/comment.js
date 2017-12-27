import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { shape, string, func } from 'prop-types';
import { getAuth } from '../../../../../service/authentication';

import DateTime from '../../../../shared/date-time/date-time';

import './comment.css';

function removeComment(linkyId, commentId, mutation, updateCache) { // eslint-disable-line
	mutation({
		variables: {
			linkId: linkyId,
			commentId
		},
		update: (store) => {
			updateCache(store, commentId);
		}
	});
}

function Comment({ linkyId, comment, removeCommentMutation, removeCommentHandler }) {
	const isRemoveAllowed = comment.user.id === getAuth().id;

	return (
		<article className="comment media">
			{
				isRemoveAllowed &&
				(
					<span
						className="icon remove-comment"
						onClick={() => {
							removeComment(
								linkyId,
								comment.id,
								removeCommentMutation,
								removeCommentHandler
							);
						}
					}>
						<i className="fa fa-trash-o"></i>
					</span>
				)
			}
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
	linkyId: string.isRequired,
	comment: shape({
		user: shape({
			name: string.isRequired
		}),
		createdAt: string.isRequired, // TODO: This must be a Date
		text: string.isRequired
	}),
	removeCommentMutation: func.isRequired,
	removeCommentHandler: func.isRequired
}

const REMOVE_COMMENT_MUTATION = gql`
	mutation RemoveCommentMutation($linkId: ID!, $commentId: ID!) {
		removeLinkComment(linkId: $linkId, commentId: $commentId)
	}
`;

export default graphql(REMOVE_COMMENT_MUTATION, { name: 'removeCommentMutation' })(Comment);
