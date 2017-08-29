import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ActionButton, Toolbar } from 'react-native-material-ui'
import RNGooglePlaces from 'react-native-google-places'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'

export default class EditRouteScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	static defaultProps = {
		title: '',
		startDate: new Date(),
		endDate: new Date(),
		selectedPlaces: []
	}

	state = {
		planList: [],

		diffDays: [],
		clusters: []
	}

	render = () => {

	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#ffffff'
	},
	content: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	}
})