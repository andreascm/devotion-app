import React, { Component } from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { Button, Toolbar } from 'react-native-material-ui'
import { MKTextField } from 'react-native-material-kit'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'

export default class SignUpScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	state = {
		email: "",
		username: "",
		password: "",

		usernameColor: "",
		emailColor: "",
		passwordColor: ""
	}

	handleCheck = () => {
		var inputValid = true

		if (this.state.email.indexOf('@') < 0 || this.state.email.indexOf('.com') < 0) {
			inputValid = false
		}

		if (this.state.password.length < 6 || this.state.password.toLowerCase() === this.state.password || !/\d/.test(this.state.password) || !/[a-zA-Z]/.test(this.state.password)) {
			inputValid = false
		}

		Util.authentication.isUsernameValid(this.state.username, (result) => {
			if (result && inputValid) {
				this.handleSubmit()
			}
		})
	}

	handleSubmit = () => {
		Util.authentication.signUp(this.state.email, this.state.username, this.state.password, (error, result) => {
			if (error) {
				console.log(error)
			} else {
				Util.authentication.addUser(this.state.email, this.state.username)
				this.props.navigator.push(Router.getRoute('main'))
			}
		})
	}

	render = () => {
		return (
			<View style={styles.container}>
				<Toolbar
					leftElement='arrow-back'
					centerElement='Sign Up'
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
					placeholder="Username"
					textInputStyle={{flex: 1}}
					returnKeyType='next'
					floatingLabelEnabled={true}
					allowFontScaling={true}
					onChangeText={(username) => this.setState({username})}
					value={this.state.username} />
				<MKTextField
        			autoCorrect={false}
					placeholder="Password"
					textInputStyle={{flex: 1}}
					password={true}
					returnKeyType='go'
					floatingLabelEnabled={true}
					allowFontScaling={true}
					onSubmitEditing={this.handleCheck.bind(this)}
					onChangeText={(password) => this.setState({password})}
					value={this.state.password} />
				<Button
					raised
					onPress={this.handleCheck.bind(this)}
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