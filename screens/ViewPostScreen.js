import React, { Component } from 'react'
import { DatePickerAndroid, DatePickerIOS, Dialog, Picker, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActionButton, Toolbar } from 'react-native-material-ui'
import { MKTextField } from 'react-native-material-kit'

import async from 'async'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'

export default class NewPostScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	static defaultProps = {
		author: '',
		date: new Date((new Date()).setHours(0,0,0,0) + 24 * 60 * 60 * 1000),
		title: '',
		text: '',
		music: '',
		index: null
	}

	state = {
		author: this.props.author,
		date: this.props.date,
		title: this.props.title,
		text: this.props.text,
		music: this.props.music
	}

	componentDidMount = () => {
	}

	componentWillReceiveProps = (nextProps) => {
	}

 	render = () => {
		return (
			<View style={styles.container}>
				<Toolbar
					leftElement='arrow-back'
					centerElement='View Post'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<ScrollView>
					<View style={styles.content}>
						<Text style={{fontSize: 20}}>{this.props.title}</Text>
						<Text>{new Date(this.props.date).toDateString()}</Text>
						<Text style={{marginBottom: 16}}>{this.props.author}</Text>
						<Text style={{marginBottom: 16}}>{this.props.text}</Text>
					</View>
				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#ffffff'
	},
	content: {
		flex: 1,
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 20
	}
})