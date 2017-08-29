import React, { Component } from 'react'
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActionButton, Toolbar } from 'react-native-material-ui'
import RNGooglePlaces from 'react-native-google-places'

import async from 'async'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'
import PlaceList from '../components/PlaceList'

export default class PlanSummaryScreen extends Component {
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

	componentDidMount = () => {
		this.initCluster(this.props.selectedPlaces)
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.selectedPlaces !== this.props.selectedPlaces) {
			this.initCluster(nextProps.selectedPlaces)
		}
 	}

 	initCluster = async (selectedPlaces) => {
 		var placeCoords = []

		for (var i=0; i<selectedPlaces.length; i++) {
			var coord = {
				lat: selectedPlaces[i].coordinate.latitude,
				lng: selectedPlaces[i].coordinate.longitude
			}

			placeCoords.push(coord)
		}

		var diffDays = 1 + parseInt((this.props.endDate.getTime() - this.props.startDate.getTime()) / (1000 * 60 * 60 * 24))

 		Util.cluster.getCluster(placeCoords, diffDays, (results) => {
 			var clusters = results[results.length-1].clusters
			clusters = clusters.map((cluster) => {
				return cluster.map((index) => {
					return this.props.selectedPlaces[index]
				})
			})

			this.setState({
				diffDays: diffDays,
				clusters: clusters
			})

 			this.generatePlan(diffDays, clusters)
 		})
 	}

 	movePlace = (place, initDay, initIndex, moveDay, moveIndex) => {
 		var clusters = this.state.clusters
 		clusters[initDay].splice(initIndex, 1)

 		if (index < clusters[moveDay].length) {
 			clusters[moveDay].splice(moveIndex, 0, place)
 		} else {
 			clusters[moveDay].push(place)
 		}

 		this.setState({ clusters: clusters })

 		this.generatePlan(this.state.diffDays, clusters)
 	}

	generatePlan = (diffDays, results) => {
		for (var i=0; i<diffDays; i++) {
			var date = new Date(this.props.startDate.getTime() + i*86400000)

			this.state.planList.push(
				<Text style={styles.subheader}>{date.toDateString()}</Text>
			)
			this.state.planList.push(
				<PlaceList
					selectedPlaces={results[i]} />
			)
		}
	}

	handleAction = (action) => {
		if (action === 'save') {
			this.handleSavePlan()
		} else if (action === 'map') {
			this.openMap()
		}
	}

	handleSavePlan = () => {
		if (this.props.index === null) {
 			Util.plan.createPlan(this.props.title, this.props.startDate.getTime(), this.props.endDate.getTime(), this.state.clusters)
 		} else {
 			Util.plan.editPlan(this.props.title, this.props.startDate.getTime(), this.props.endDate.getTime(), this.state.clusters, this.props.index)
 		}
 		this.props.navigator.push(Router.getRoute('planner'))
	}

	openMap = () => {
 		var selectedPlaces = []

 		for (var i=0; i<this.state.clusters.length; i++) {
			for (var j=0; j<this.state.clusters[i].length; j++) {
				selectedPlaces.push(this.state.clusters[i][j])
			}
		}

		var length = selectedPlaces.length

 		if (length > 1) {
			var origin = {
					name: encodeURIComponent(selectedPlaces[0].details.name),
					id: encodeURIComponent(selectedPlaces[0].data.place_id)
				},
				destination = {
					name: encodeURIComponent(selectedPlaces[length-1].details.name),
					id: encodeURIComponent(selectedPlaces[length-1].data.place_id)
				},
				waypoints = []

			for (var j=1; j<length-1; j++) {
				waypoints.push({
					name: encodeURIComponent(selectedPlaces[j].details.name),
					id: encodeURIComponent(selectedPlaces[j].data.place_id)
				})
			}

			var initialURL = 'https://www.google.com/maps/dir/?api=1&origin=' + origin.name + '&origin_place_id=' + origin.id + '&destination=' + destination.name + '&destination_place_id=' + destination.id,
				waypointsURL = '&waypoints=',
				waypointIdsURL = '&waypoint_place_ids=',
				request

			if (waypointsURL.length === 0) {
				request = initialURL
			} else {
				waypointsURL += waypoints[0].name
				waypointIdsURL += waypoints[0].id

				for (var k=1; k<waypoints.length; k++) {
					waypointsURL += '%7C' +  waypoints[k].name
					waypointIdsURL += '%7C' + waypoints[k].id
				}

				request = initialURL + waypointsURL
			}

			Linking.canOpenURL(request).then(supported => {
				if (!supported) {
					console.log('Can\'t handle url: ' + request)
				} else {
					return Linking.openURL(request)
				}
			}).catch(err => console.error('An error occurred', err))
		} else {
			var origin = {
					name: encodeURIComponent(selectedPlaces[0].details.name),
					id: encodeURIComponent(selectedPlaces[0].data.place_id)
				},
				initialURL = 'https://www.google.com/maps/dir/?api=1&origin=' + origin.name + '&origin_place_id=' + origin.id

			Linking.canOpenURL(initialURL).then(supported => {
				if (!supported) {
					console.log('Can\'t handle url: ' + initialURL)
				} else {
					return Linking.openURL(initialURL)
				}
			}).catch(err => console.error('An error occurred', err))
		}
 	}

	render = () => {
		return (
			<View style={styles.container}>
				<Toolbar
					leftElement='arrow-back'
					centerElement={this.props.title}
					onLeftElementPress={() => this.props.navigator.pop()} />
				<ScrollView>
					<View style={styles.content}>
						{this.state.planList}
					</View>
				</ScrollView>
				<ActionButton
					actions={[{icon: 'map', label: 'View Route', name: 'map'}, {icon: 'save', label: 'Save Plan', name: 'save'}]}
                    icon='add'
                    transition='speedDial'
                    onPress={(action) => this.handleAction(action)} />
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
		paddingRight: 16
	},
	subheader: {
		marginTop: 20,
		fontSize: 20
	}
})