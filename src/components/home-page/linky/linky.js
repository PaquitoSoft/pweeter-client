import React from 'react';
import { shape, arrayOf, string, array, object } from 'prop-types';

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

	render() {
		const { linky } = this.props;

		return (
			<li className="linky">
				<div className="box">
					<article className="media">
						<div className="media-left">
							<figure className="image is-64x64">
								<img src="https://bulma.io/images/placeholders/128x128.png" data-alt={linky.text} />
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
										<span className="icon like-linky">
											<i className="fa fa-thumbs-o-up"></i>
										</span>
									</span>
								</p>
								<a href={linky.url} className="url" target="_blank">{linky.url}</a>
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

							{this.state.showComments && <CommentsList linky={linky} comments={linky.comments} />}
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
		votes: array,
		text: string,
		tags: arrayOf(object),
		comments: arrayOf(object)
	})
};

export default Linky;
