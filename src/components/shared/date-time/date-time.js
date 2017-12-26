import { string } from 'prop-types';

function DateTime({ date }) {
	return (new Date(date)).toLocaleString();
}

DateTime.propTypes = {
	date: string
};

export default DateTime;
