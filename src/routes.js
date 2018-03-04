import AC from './components/async_load';

export default [
	{
		name: '首页',
		icon: 'home',
		path: '/',
		component: AC(() => require('./views/home'))

	},
	{
		name: '详情页',
		path: '/detail/:id',
		component: AC(() => require('./views/movie/detail'))
	},
	{
		name: '后台入口',
		icon: 'admin',
		path: '/admin',
		component: AC(() => require('./views/admin/login'))
	},
	{
		name: '后台列表',
		icon: 'admin',
		path: '/admin/list',
		component: AC(() => require('./views/admin/list'))
	}
];
