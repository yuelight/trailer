import React, { Component } from 'react';
import {
	Card,
	Row,
	Col,
	Badge,
	Modal,
	Spin,
	Icon
} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DPlayer from 'dplayer';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const site = 'http://p3tixpd4t.bkt.clouddn.com/';
const Meta = Card.Meta;

export default class Content extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
		this._handleClose = this._handleClose.bind(this);
		this._handleCancel = this._handleCancel.bind(this);
		this._jumpToDetail = this._jumpToDetail.bind(this);
	}

	_handleClose(e) {
		if (this.palyer && this.player.pause) {
			this.player.pause();
		}
	}

	_handleCancel(e) {
		this.setState({
			visible: false
		});
	}

	_jumpToDetail() {
		const { url } = this.props;

		url && window.open(url);
	}

	_showModal(movie) {
		this.setState({
			visible: true
		});

		const video = site + movie.videoKey;
		const pic = site + movie.coverKey;

		if (!this.player) {
			setTimeout(() => {
				this.player = new DPlayer({
					container: document.querySelector('.videoModal'),
					autoplay: true,
					screenshot: true,
					video: {
						url: video,
						pic: pic,
						thumbnails: pic
					}
				});
			}, 500);
		} else {
			if (this.player.video.currentSrc !== video) {
				this.player.switchVideo({
					url: video,
					autoplay: true,
					pic: pic,
					type: 'auto'
				});
			}
			this.player.play();
		}
	}

	_renderContent() {
		const { movies } = this.props;
		return (
			<div style={{ padding: '30px' }}>
				<Row>
					{
						movies.map((it, i) => (
							<Col
								key={i}
								xl={{span: 6}}
								lg={{span: 8}}
								md={{span:12}}
								sm={{span: 24}}
								style={{margin: '8px'}}>
								<Card
									bordered={false}
									hoverable
									style={{width: '100%'}}
									actions={[
										<Badge>
											<Icon style={{marginRight: '2px'}} type='clock-circle' />
											{ moment(it.meta.createdAt).fromNow(true) } 前更新
										</Badge>,
										<Badge>
											<Icon style={{marginRight: '2px'}} type='star' />
											{ it.rate } 分
										</Badge>
									]}
									cover={
										<img onClick={() => this._showModal(it)} src={site + it.posterKey + '?imageMogr2/thumbnail/x1680/crop/1080x1600'} />
									}>
									<Meta
										style={{height: '202px', overflow: 'hidden'}}
										title={<Link to={`/detail/${it._id}`}>{ it.title }</Link>}
										onClick={this._jumpToDetail}
										description={<Link to={`/detail/${it._id}`}>{ it.summary }</Link>} />
								</Card>
							</Col>
						))
					}
				</Row>
				<Modal
					className='videoModal'
					footer={null}
					visible={this.state.visible}
					afterClose={this._handleClose}
					onCancel={this._handleCancel}>
					<Spin size='large' />
				</Modal>
			</div>
		);
	}
	render() {
		return (
			<div style={{ padding: 10 }}>{ this._renderContent() }</div>
		);
	}
}
