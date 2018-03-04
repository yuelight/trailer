import React, { Component } from 'react';
import request from '../../lib/request';
import {
	Form,
	Icon,
	Input,
	Button
} from 'antd';
import 'assets/login.sass';

const FormItem = Form.Item;

@Form.create()
export default class AdminLogin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		};
		const storage = window.localStorage.getItem('trailer');
		if (storage)
			this.props.history.replace('/admin/list');

		this._toggleLoading = this._toggleLoading.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
	}

	_toggleLoading(status = false) {
		this.setState({
			loading: status
		});
	}

	_handleSubmit(e) {
		e.preventDefault();

		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				try {
					await request(this._toggleLoading)({
						method: 'post',
						url: '/admin/login',
						data: values
					});
					window.localStorage.setItem('trailer', 'yuelight');
					this.props.history.replace('/admin/list');
				} catch (err) {
					console.error(err);
				}
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Form onSubmit={this._handleSubmit} className='login-form'>
				<h3 style={{textAlign: 'center'}}>黑骑预告片后台</h3>
				<FormItem>
					{
						getFieldDecorator('email', {
							rules: [{
								required: true,
								message: '请填入邮箱'
							}]
						})(
							<Input type='email' prefix={<Icon type='user' style={{fontSize: 13}} />} placeholder='Email' />
						)
					}
				</FormItem>
				<FormItem>
					{
						getFieldDecorator('password', {
							rules: [{
								required: true,
								message: '请填入密码'
							}]
						})(
							<Input type='password' prefix={<Icon type='user' style={{fontSize: 13}} />} placeholder='Password' />
						)
					}
				</FormItem>
				<FormItem>
					<Button style={{width: '100%'}} htmlType='submit' loading={this.state.loading}>Login in</Button>
				</FormItem>
			</Form>
		);
	}
}
