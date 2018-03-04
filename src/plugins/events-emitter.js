class EventEmitter {

	constructor() {
		this.listeners = {};
	}

	on(eventName, listener) {
		this.listeners[eventName] = this.listeners[eventName] || [];
		this.listeners[eventName].push(listener);
	}

	trigger(eventName, data) {
		const listeners = this.listeners[eventName] || [];
		listeners.forEach(fn => {
			try {
				fn(eventName, data);
			} catch (error) {
				console.warn(`Error calling a ${eventName} event listener: ${error}`);
			}
		});
	}

}

export default EventEmitter;
