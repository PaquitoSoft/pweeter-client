import React from 'react';

import './add-linky.css';

class AddLinky extends React.Component {

	constructor() {
		super();

		this.state = {
			isFolded: true
		};
	}

	documentClickHandler = e => {
		const isChild = [...document.querySelectorAll('.add-linky-container *')].includes(e.target);
		if (!isChild) {
			this.setState({ isFolded: true });
		}
	}

	documentKeydownHandler = e => {
		if (e.keyCode === 27) {
			this.setState({ isFolded: true });
		}
	}

	componentDidMount() {
		document.addEventListener('click', this.documentClickHandler);
		document.addEventListener('keydown', this.documentKeydownHandler);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.documentClickHandler);
		document.removeEventListener('keydown', this.documentKeydownHandler);
	}

	render() {
		return (
			<section className="add-linky-container is-clearfix">
				<div className="field">
					<div className="control">
						<input
							className="input"
							name="linky-value"
							placeholder="Share a link"
							onFocus={() => this.setState({ isFolded: false })}
							onClick={() => this.setState({ isFolded: false })}
						/>
					</div>
				</div>
				<div className={`field ${this.state.isFolded ? 'hidden' : ''}`}>
					<div className="control">
						<input
							className="input is-small"
							name="linky-tags"
							placeholder="Set some tags"
							size="40"
						/>
					</div>
				</div>
				<div className={`add-linky-actions ${this.state.isFolded ? 'hidden' : ''}`}>
					<button className="button is-primary is-pulled-right add-linky">Share it!</button>
				</div>
			</section>
		);
	}
}

export default AddLinky;
