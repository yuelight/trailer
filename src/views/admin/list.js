import React, {Component} from 'react';
import {
	Table,
	Button
} from 'antd';
import request from '../../lib/request';
import Layout from '../../layouts/default';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const site = 'http://p3tixpd4t.bkt.clouddn.com/';

export default class AdminList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			dataSource: [],
			columns: [
				{
					title: '海报',
					dataIndex: 'posterKey',
					key: 'posterKey',
					render: (text, record) => (<img width="160" src={site + record.posterKey}/>)
				}, {
					title: '名字',
					dataIndex: 'title',
					key: 'title'
				}, {
					title: '原始名',
					dataIndex: 'rawTitle',
					key: 'rawTitle'
				}, {
					title: '上映时间',
					dataIndex: 'pubdate',
					key: 'pubdate',
					render: (text, record) => (record.pubdate.map((it, i) => (<p key={i}>{moment(it.date).format('YYYY-MM-DD')} {it.country}</p>)))
				}, {
					title: '评分',
					dataIndex: 'rate',
					key: 'rate'
				}, {
					title: '更新时间',
					dataIndex: 'meta',
					key: 'meta',
					render: (text, record) => (<span>{ moment(record.meta.createdAt).fromNow(true) } 前</span>)
				}, {
					title: '豆瓣 ID',
					dataIndex: 'doubanId',
					key: 'doubanId'
				}, {
					title: '类型',
					dataIndex: 'movieTypes',
					key: 'movieTypes',
					render: (text, record) => (record.movieTypes.map((it, i) => (<p key={i}>{it}</p>)))
				}, {
					title: '标签',
					dataIndex: 'tags',
					key: 'tags',
					render: (text, record) => (record.tags.map((it, i) => (<p key={i}>{it}</p>)))
				}, {
					title: '简要',
					key: 'summary',
					render: (text, record) => (<p style={{padding: '5px',maxWidth: '800px'}}>{record.summary}</p>)
				}, {
					title: '详情',
					key: '_id',
					render: (text, record) => <a href={`/detail/${record._id}`} target={'_blank'}>详情</a>
				}, {
					title: '操作',
					key: 'action',
					render: (text, record) => <Button type="danger" onClick={() => this._delete(record._id)}>删除</Button>
				}
			]
		};
		const storage = window.localStorage.getItem('trailer');
		if (!storage)
			this.props.history.replace('/admin');
		this._toggleLoading = this._toggleLoading.bind(this);
	}

	componentDidMount() {
		this._getAllMovies();
	}

	async _delete(id) {
		try {
			const res = await request({method: 'delete', url: `/admin/movie?id=${id}`});
			this.setState({
				dataSource: res.filter(item => item.posterKey)
			});
		} catch (err) {
			this.setState({dataSource: []});
		}
	}

	_toggleLoading(status = false) {
		this.setState({
			loading: status
		});
	}

	async _getAllMovies() {
		try {
			const res = await request(this._toggleLoading)({method: 'get', url: '/admin/movie/list'});
			this.setState({
				dataSource: res.filter(item => item.posterKey)
			});
		} catch (err) {
			this.setState({dataSource: []});
		}
	}

	render() {
		let {dataSource, columns} = this.state;
		if (!dataSource || !dataSource.length)
			return null;

		dataSource = dataSource.map((data, i) => {
			data.key = i;
			return data;
		});

		return (
			<Layout>
				<div className='flex-row full'>
					<div className='flex-1 scroll-y align-self-start'>
						<Table dataSource={dataSource} columns={columns} />
					</div>
				</div>
			</Layout>
		);
	}
}
