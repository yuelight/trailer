import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import request from '../../lib/request';
import {
	Tabs,
	Badge
} from 'antd';
import moment from 'moment';
import DPlayer from 'dplayer';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const TabPane = Tabs.TabPane;
const site = 'http://p3tixpd4t.bkt.clouddn.com/';
const callback = key => {};

export default class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			movie: null,
			relativeMovies: [],
			_id: this.props.match.params.id
		};
	}
	componentDidMount() {
		this._getMovieDetail();
	}
	async _getMovieDetail() {
		try {
			const res = await request({
				method: 'get',
				url: `/api/v0/movies/${this.state._id}`
			});
			const { movie, relativeMovies } = res;
			const video = site + movie.videoKey;
			const pic = site + movie.coverKey;

			this.setState({
				movie,
				relativeMovies
			}, () => {
				this.player = new DPlayer({
					container: document.querySelector('#videoPlayer'),
					screenshot: true,
					video: {
						url: video,
						pic: pic,
						thumbnails: pic
					}
				});
			});
		} catch (e) {
			this.setState({
				movie: null
			});

			this.props.history.goBack();
		}
	}
	render() {
		const { movie, relativeMovies } = this.state;
		if (!movie)
			return null;
		return (
			<div className='flex-row full'>
				<div className='page-shade'>
					<div className='video-wrapper'>
						<div id='videoPlayer' data-src={site + movie.coverKey} data-video={site + movie.videoKey}></div>
					</div>
					<div className='video-sidebar'>
						<Link className='homeLink' to='/'>回到首页</Link>
						<Tabs defaultActiveKey='1' onChange={callback}>
							<TabPane tab='关于本片' key='1'>
								<h1>{ movie.title }</h1>
								<dl>
									<dt>豆瓣评分：<Badge count={movie.rate} style={{backgroundColor: '#52c41a'}} /> 分</dt>
									<dt>电影分类：{ movie.tags && movie.tags.join(' ') }</dt>
									<dt>更新时间：{ moment(movie.meta.createdAt).fromNow() }</dt>
									<dt>影片介绍：</dt>
									<dt>{ movie.summary }</dt>
								</dl>
							</TabPane>
							<TabPane tab='同类电影' key='2'>
								{
									relativeMovies.map(item => (
										<Link key={item._id} className='media' to={`/detail/${item._id}`}>
											<img width='60' className='align-self-center mr-3' src={site + item.posterKey} />
											<div className='media-body'>
												<h6 className='media-title'>{ item.title }</h6>
												<ul className='list-unstyled'>
													{
														item.pubdate && item.pubdate.map((it, i) => (
															<li key={i}>{ moment(it.date).format('YYYY.MM') } { it.country }</li>
														))
													}
												</ul>
											</div>
										</Link>
									))
								}
							</TabPane>
						</Tabs>
					</div>
				</div>
			</div>
		);
	}
}
