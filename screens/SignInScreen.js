import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Toolbar } from 'react-native-material-ui'
import { MKTextField } from 'react-native-material-kit'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'

export default class SignInScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	state = {
		email: "",
		password: ""
	}

	handleSubmit = () => {
		Util.authentication.signIn(this.state.email, this.state.password, (error, result) => {
			if (error) {
				console.log(error)
			} else {
				this.props.navigator.push(Router.getRoute('planner'))
			}
		})
	}

	render = () => {
		return (
			<View style={styles.container}>
				<Toolbar
					leftElement='arrow-back'
					centerElement='Sign In'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<MKTextField
        			autoCorrect={false}
					placeholder="Email"
					textInputStyle={{flex: 1}}
					keyboardType='email-address'
					returnKeyType='next'
					floatingLabelEnabled={true}
					allowFontScaling={true}
					onChangeText={(email) => this.setState({email})}
					value={this.state.email} />
				<MKTextField
        			autoCorrect={false}
					placeholder="Password"
					textInputStyle={{flex: 1}}
					password={true}
					returnKeyType='go'
					floatingLabelEnabled={true}
					allowFontScaling={true}
					onSubmitEditing={this.handleSubmit.bind(this)}
					onChangeText={(password) => this.setState({password})}
					value={this.state.password} />
				<Button
					raised
					onPress={this.handleSubmit.bind(this)}
					text='Submit'
					style={{
						container: {
							backgroundColor: "#3aa5e6",
							width: 200,
							flex: 1
						},
						text: {
							color: '#ffffff'
						}
					}} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	}
});