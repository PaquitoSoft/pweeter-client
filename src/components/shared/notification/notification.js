import React from 'react';
import { node, func } from 'prop-types';

function Notification({ children, closeHandler }) {
	return (
		<article className="message is-danger">
			<div className="message-header">
				<p>Ouch!</p>
				<button className="delete" aria-label="delete" onClick={closeHandler}></button>
			</div>
			<div className="message-body">
				{children}
			</div>
		</article>
	);
}

Notification.propTypes = {
	children: node,
	closeHandler: func
};

export default Notification;
