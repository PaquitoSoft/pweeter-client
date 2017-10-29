import React from 'react';

class AddPweet extends React.Component {
	constructor() {
		super();

		this.state = {
			showButton: false
		};
	}

	render() {
		return (
			<section className="add-pweet-container is-clearfix">
				<div className="field">
					<div className="control">
						<input
							className="input"
							name="pweet-value"
							placeholder="Share a link"
							onFocus={() => this.setState({ showButton: true })}
							onBlur={() => this.setState({ showButton: false })}
						/>
					</div>
				</div>
				<div className={`add-pweet-actions ${this.state.showButton ? '' : 'hidden'}`}>
					<button className="button is-primary is-pulled-right add-pweet">Share it!</button>
				</div>
			</section>
		);
	}
}

export default AddPweet;
