import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Toolbar } from 'react-native-material-ui'

import Router from '../navigation/Router'
import Colors from '../constants/Colors';

export default class HomeScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	handleSignUp = () => {
		this.props.navigator.push(Router.getRoute('signUp'))
	}

	handleSignIn = () => {
		this.props.navigator.push(Router.getRoute('signIn'))
	}

	render = () => {
		return (
			<View style={styles.container}>
				<Button
					raised
					onPress={this.handleSignUp}
					text='Sign Up'
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
				<Button
					raised
					onPress={this.handleSignIn}
					text='Sign In'
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
		alignItems: 'center',
		backgroundColor: '#ffffff'
	}
});