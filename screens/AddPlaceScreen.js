import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Card, Toolbar } from 'react-native-material-ui'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { config } from '../util/GoogleMaps'

export default class AddPlaceScreen extends Component {
	static route = {
		navigationBar: {
			visible: false,
			title(getAddedPlace) {
				this.props.getAddedPlace = getAddedPlace
			}
		}
	}

	state = {
		region: {
			latitude: 37.78825,
			longitude: -122.4324,
			latitudeDelta: 0.0022,
			longitudeDelta: 0.0021
		},
		coordinate: {},
		data: {},
		details: {}
	}

	onRegionChange = (region) => {
		this.setState({ region })
	}

	handleAddPlace = () => {
		this.props.getAddedPlace({
			coordinate: this.state.coordinate,
			data: this.state.data,
			details: this.state.details
		})
		this.props.navigator.pop()
	}

	render = () => {
		return (
			<View style={styles.container}>
				<Toolbar
					leftElement='arrow-back'
					centerElement='Add Place'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<GooglePlacesAutocomplete
					placeholder='Search'
					minLength={2} // minimum length of text to search
					autoFocus={false}
					listViewDisplayed='auto'
					fetchDetails={true}
					renderDescription={(row) => row.description}
					onPress={(data, details = null) => {
						var region = {},
							coordinate = {}

						region.latitude = details.geometry.location.lat
						region.longitude = details.geometry.location.lng
						region.latitudeDelta = 0.0022
						region.longitudeDelta = 0.0021

						coordinate.latitude = details.geometry.location.lat
						coordinate.longitude = details.geometry.location.lng

						this.setState({
							data: data,
							details: details,
							region: region,
							coordinate: coordinate
						})
					}}
					query={{
					  key: 'AIzaSyBgg0tf604dP5hPL5HPDyD_Izx06NS_Fb8'
					}}
					nearbyPlacesAPI='GooglePlacesSearch'
					GooglePlacesSearchQuery={{
					  rankby: 'distance'
					}}
					debounce={200} />
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
						{ this.state.data.structured_formatting ?
							<MapView.Marker
								coordinate={{
									latitude: this.state.region.latitude,
									longitude: this.state.region.longitude
								}} >
								<MapView.Callout
									onPress={this.handleAddPlace.bind(this)} >
									<Button
										raised
										onPress={this.handleAddPlace.bind(this)}
										text='Add'
										style={{
											container: {
												backgroundColor: "#3aa5e6"
											},
											text: {
												color: '#ffffff'
											}
										}} />
								</MapView.Callout>
							</MapView.Marker>
							: null
						}
					</MapView>
				</View>
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
		top: '55%',
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