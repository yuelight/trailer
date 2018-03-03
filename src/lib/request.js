import axios from 'axios';
import { message } from 'antd';

const defaultAxiosConf = {
	timeout: 5000
};

const _request = async (params = {}, fn = () => {}) => {
	const conf = Object.assign({}, defaultAxiosConf, params);

	try {
		const res = await axios(conf);
		const { success, data } = res.data;
		if (res.status === 401) {
			window.location.href = '/';
			return;
		}

		if (success) {
			fn(false);
			return data;
		}
	} catch (err) {
		fn(false);
		message.error(String(err || '网络错误'));
	}
};

export default param => {
	const type = typeof param;
	if (type === 'function') {
		param(true);
		return obj => _request(obj, param);
	}
	if (type === 'object' && type !== null) {
		return _request(param);
	}
};
