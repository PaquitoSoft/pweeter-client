import React from 'react';

class AddLinky extends React.Component {
	constructor() {
		super();

		this.state = {
			showButton: false
		};
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
							onFocus={() => this.setState({ showButton: true })}
							onBlur={() => this.setState({ showButton: false })}
						/>
					</div>
				</div>
				<div className={`add-linky-actions ${this.state.showButton ? '' : 'hidden'}`}>
					<button className="button is-primary is-pulled-right add-linky">Share it!</button>
				</div>
			</section>
		);
	}
}

export default AddLinky;
