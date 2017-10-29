import React from 'react';
import { shape, arrayOf, string, number, object } from 'prop-types';

import Tag from './tag/tag';
import Comments from './comments/comments';

import './pweet.css';

function renderTags(tags) {
	return tags.map(tag => {
		return (<Tag key={tag.id} tag={tag} onClick={() => (void 0)} />);
	});
}

class Pweet extends React.Component {

	constructor() {
		super();

		this.state = {
			showComments: false
		};
	}

	render() {
		const { pweet } = this.props;

		return (
			<li className="pweet">
				<div className="box">
					<article className="media">
						<div className="media-left">
							<figure className="image is-64x64">
									<img src="https://bulma.io/images/placeholders/128x128.png" alt={pweet.text} />
							</figure>
						</div>
						<div className="media-content">
							<div className="content">
								<p>
									<strong>{pweet.user.name}</strong>
									<small>{pweet.createDate}</small>
									<span className="icon is-pulled-right like-pweet">
										<i className="fa fa-thumbs-o-up"></i>
									</span>
								</p>
								{pweet.text}
							</div>
							<div className="level is-mobile">
								<div className="level-left">
									{renderTags(pweet.tags)}
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
									>Comments</a>
								</div>
							</div>

							{this.state.showComments && <Comments comments={pweet.comments} />}
						</div>
					</article>
				</div>
			</li>
		);
	}
}

Pweet.propTypes = {
	pweet: shape({
		user: shape({
			id: string.isRequired,
			name: string.isRequired
		}),
		createDate: string.isRequired,
		likes: number,
		text: string.isRequired,
		tags: arrayOf(object),
		comments: arrayOf(object)
	})
};

export default Pweet;
