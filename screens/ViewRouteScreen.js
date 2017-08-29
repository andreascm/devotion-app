import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ActionButton, Toolbar } from 'react-native-material-ui'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import async from 'async'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'

export default class ViewRouteScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	static defaultProps = {
		title: '',
		startDate: new Date(),
		endDate: new Date(),
		clusters: []
	}

	state = {
		region: {
			latitude: 1.3470414,
			longitude: 103.7713172,
			latitudeDelta: 0.0022,
			longitudeDelta: 0.0021
		},
		markerList: [],
		routeList: [],
		clusters: []
	}

	componentDidMount = () => {
		this.setState({ clusters: this.props.clusters })

		this.initRoutes(this.props.clusters)
		this.initMarkers(this.props.clusters)
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.props.clusters !== nextProps.clusters) {
			this.setState({ clusters: nextProps.clusters })

			this.initRoutes(nextProps.clusters)
			this.initMarkers(nextProps.clusters)
		}
 	}

 	initMarkers = (clusters) => {
 		var markerList = []
		for (var i=0; i<clusters.length; i++) {
			for (var j=0; j<clusters[i].length; j++) {
				markerList.push(
					<MapView.Marker
						coordinate={{
							latitude: clusters[i][j].coordinate.latitude,
							longitude: clusters[i][j].coordinate.longitude
						}} >
						<MapView.Callout>
							<Text style={{fontSize: 12}}>{clusters[i][j].data.structured_formatting.main_text}</Text>
						</MapView.Callout>			
					</MapView.Marker>
				)
			}
		}

		this.setState({ markerList })
 	}

 	initRoutes = (clusters) => {
 		var routeList = [],
 			markerList = []
 		for (var i=0; i<clusters.length; i++) {
 			var length = clusters[i].length

 			if (length > 1) {
 				var originId = clusters[i][0].data.place_id,
 					destinationId = clusters[i][length-1].data.place_id
 					waypointsId = []

 				for (var j=1; j<length-1; j++) {
 					waypointsId.push(clusters[i][j].data.place_id)
 				}

 				Util.direction.getDirection(originId, destinationId, waypointsId, (error, waypoints, routes) => {
 					var latLngList = []

 					for (var j=0; j<routes[0].legs.length; j++) {
						for (var k=0; k<routes[0].legs[j].steps.length; k++) {
 							latLngList.push(routes[0].legs[j].steps[k].polyline.points)

							console.log('start')
							console.log(routes[0].legs[j].steps[k].start_location.lat)
							console.log(routes[0].legs[j].steps[k].start_location.lng)
							console.log('end')
							console.log(routes[0].legs[j].steps[k].end_location.lat)
							console.log(routes[0].legs[j].steps[k].end_location.lng)
						}
					}

					routeList.push(
		 				<MapView.Polyline
							key={i}
							coordinates={latLngList}
							strokeColor="#F00"
							fillColor="rgba(255,0,0,0.5)"
							strokeWidth={5} />
		 			)
 				})
 			}
 		}

 		this.setState({ routeList: routeList, markerList: markerList })
 	}

 	addPlaceToRoute = async (day, index) => {
 		var clusters = this.state.clusters

 		clusters[day].push(this.props.clusters[day][index])
 		this.initRoutes(clusters)

 		this.setState({ clusters: clusters })
 	}

 	removePlaceFromRoute = async (day, index) => {
 		var clusters = this.state.clusters

 		clusters[day].splice(index, 1)
 		this.initRoutes(clusters)

 		this.setState({ clusters: clusters })
 	}

 	handleSavePlan = () => {
 		if (this.props.index === null) {
 			Util.plan.createPlan(this.props.title, this.props.startDate.getTime(), this.props.endDate.getTime(), this.state.clusters)
 		} else {
 			Util.plan.editPlan(this.props.title, this.props.startDate.getTime(), this.props.endDate.getTime(), this.state.clusters, this.props.index)
 		}
 		this.props.navigator.push(Router.getRoute('planner'))
	}

	onRegionChange = (region) => {
		this.setState({ region })
	}

	render = () => {
		return (
			<View style={styles.container}>
				<Toolbar
					leftElement='arrow-back'
					centerElement='Route'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<View style={styles.content}>
					<MapView
						style={styles.map}
						provider={PROVIDER_GOOGLE}
						initialRegion={{
							latitude: 37.78825,
							longitude: -122.4324,
							latitudeDelta: 0.0022,
							longitudeDelta: 0.0021,
						}}
						region={this.state.region}
						onRegionChange={this.onRegionChange.bind(this)}>
						{this.state.markerList}
						{this.state.routeList}
					</MapView>
				</View>
				<ActionButton
					icon="save"
					onPress={this.handleSavePlan.bind(this)} />
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