import { getValue, storeValue, removeValue } from '../plugins/local-cache';
import EventEmitter from '../plugins/events-emitter';

const USER_AUTH_KEY = 'ua';
const AUTH_CHANGED_EVENT = 'auth-changed';

class Authentication extends EventEmitter {

	constructor() {
		super();
		this.userAuthData = getValue(USER_AUTH_KEY);
	}

	isUserLogged() {
		return !!this.userAuthData;
	}

	getAuth() {
		return this.userAuthData;
	}

	storeAuth(authData) {
		this.userAuthData = storeValue(USER_AUTH_KEY, authData);
		this.trigger(AUTH_CHANGED_EVENT, { userData: this.userAuthData });
	}

	cleanAuth() {
		removeValue(USER_AUTH_KEY);
		this.userAuthData = null;
		this.trigger(AUTH_CHANGED_EVENT, { userData: this.userAuthData });
	}

	onAuthChanged(listener) {
		this.on(AUTH_CHANGED_EVENT, listener);
	}
}

export default new Authentication();
