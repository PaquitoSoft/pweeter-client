import React from 'react';
import md5 from 'md5';

import { getAuth, isUserLogged, cleanAuth } from '../../../service/authentication';

import './layout-header.css';

function renderUserArea(userAuth) {
	const { email, name } = userAuth;
	const gravatarHash = email ? md5((email).trim().toLowerCase()) : '';

	return (
		<div className="level-right">
			<div className="level-item">
				<div className="user-gravatar">
					<p><img src={`https://www.gravatar.com/avatar/${gravatarHash}`} alt={name} /></p>
					<p>
						<a
							href="/"
							className="dropdown-item"
							onClick={cleanAuth}>
							Logout
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

function LayoutHeader() {
	const userAuth = getAuth();

	return (
		<section id="app-header" className="section">
			<div className="columns">
				<div className="column is-8 is-offset-2">
					<nav className="level">
						<div className="level-left">
							<div className="level-item">
								<div>
									<a href="/">
										<h1 className="title">
											Linky
										</h1>
									</a>
									<p className="subtitle">
										Share interest technical content with your collegues
									</p>
								</div>
							</div>
						</div>

						{
							isUserLogged() &&
							renderUserArea(userAuth)
						}

					</nav>
				</div>
			</div>
		</section>
	);
}

export default LayoutHeader;
