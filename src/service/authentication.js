import { getValue, storeValue, removeValue } from '../plugins/local-cache';

const USER_AUTH_KEY = 'ua';

let userAuthData = getValue(USER_AUTH_KEY);

export function isUserLogged() {
	return !!userAuthData;
}

export function getAuth() {
	return userAuthData;
}

export function storeAuth(authData) {
	userAuthData = storeValue(USER_AUTH_KEY, authData);
}

export function cleanAuth() {
	removeValue(USER_AUTH_KEY);
}
