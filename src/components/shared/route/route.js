import React from 'react'
import {
  Redirect,
  Route as ReactRouterRoute
} from 'react-router-dom';
import { object, func, bool } from 'prop-types';

import { isUserLogged } from '../../../service/authentication';

function Route({ component: Component, ...props }) {
	return (
		<ReactRouterRoute {...props} render={_props => {
			const { isPublicRoute = false } = props;
			const isUserAuthenticated = isUserLogged();

			if (isPublicRoute || isUserAuthenticated) {
				return (<Component {..._props} />);
			} else {
				return (<Redirect to={{
					pathname: '/login',
					state: { from: props.location }
				}}/>);
			}
		}} />
	);
}

Route.propTypes = {
	component: func,
	location: object,
	isPublicRoute: bool
};

export default Route;
