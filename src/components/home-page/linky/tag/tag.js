import React from 'react';
import { shape, string, func } from 'prop-types';

function Tag({ tag, onClick }) {
	return (
		<div
			className="level-item"
			onClick={(event) => {
				event.preventDefault();
				onClick(tag);
			}}
		>
			<span className="tag is-light">{tag.name}</span>
		</div>
	);
}

Tag.propTypes = {
	tag: shape({
		name: string.isRequired
	}),
	onClick: func.isRequired
};

export default Tag;
