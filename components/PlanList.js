import React, { Component } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Card } from 'react-native-material-ui'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

export default class PlanList extends Component {
	state = {
		cardList: []
	}

	componentDidMount = () => {
		var cardList = [],
			keys = Object.keys(this.props.planList)

		for (i=0; i<keys.length; i++) {
			//console.log(this.props.planList[keys[i]])
			cardList.push(
				<TouchableHighlight onPress={this.editPlan.bind(this.props.planList[keys[i]], keys[i])} underlayColor="white">
					<View key={keys[i]} style={{marginBottom: 16}}>
						<Card>
							<View style={styles.content}>
							<MapView
								style={styles.map}
								provider={PROVIDER_GOOGLE}
								initialRegion={{
									latitude: 37.78825,
									longitude: -122.4324,
									latitudeDelta: 0.0922,
									longitudeDelta: 0.0421,
								}} />
							</View>
							<View style={styles.text}>
								<Text>{this.props.planList[keys[i]].name}</Text>
								<Text>{new Date(this.props.planList[keys[i]].startDate).toDateString()} - {new Date(this.props.planList[keys[i]].endDate).toDateString()}</Text>
							</View>
						</Card>
					</View>
				</TouchableHighlight>
			)
		}

		this.setState({ cardList: cardList })
	}

	componentWillReceiveProps = (nextProps) => {
		var cardList = [],
			keys = Object.keys(nextProps.planList)

		for (i=0; i<keys.length; i++) {
			//console.log(this.props.planList[keys[i]])
			cardList.push(
				<TouchableHighlight onPress={this.editPlan.bind(this, this.props.planList[keys[i]], keys[i])} underlayColor="white">
					<View key={keys[i]} style={{marginBottom: 16}}>
						<Card>
							<View style={styles.content}>
							<MapView
								style={styles.map}
								provider={PROVIDER_GOOGLE}
								initialRegion={{
									latitude: 37.78825,
									longitude: -122.4324,
									latitudeDelta: 0.0922,
									longitudeDelta: 0.0421,
								}} />
							</View>
							<View style={styles.text}>
								<Text style={{fontSize: 18}}>{nextProps.planList[keys[i]].name}</Text>
								<Text>{new Date(this.props.planList[keys[i]].startDate).toDateString()} - {new Date(this.props.planList[keys[i]].endDate).toDateString()}</Text>
							</View>
						</Card>
					</View>
				</TouchableHighlight>
			)
		}

		this.setState({ cardList: cardList })
	}

	editPlan = (data, key) => {
		this.props.editPlan(data, key)
	}

	render = () => {
		return (
			<View style={styles.container}>
				{this.state.cardList}
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
		bottom: 26,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 26
	},
	text: {
		paddingTop: 150,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16
	}
})