import React, { Component } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Card } from 'react-native-material-ui'

export default class PlaceList extends Component {

	constructor(props) {
		super(props)
	}

	state = {
		cardList: []
	}

	componentDidMount() {
		var cardList = []

		for (i=0; i<this.props.selectedPlaces.length; i++) {
			cardList.push(
				<View key={i} style={{marginBottom: 8}}>
					<Card>
						<View style={styles.text}>
							<Text>{this.props.selectedPlaces[i].data.structured_formatting.main_text}</Text>
							<Text>{this.props.selectedPlaces[i].data.structured_formatting.secondary_text}</Text>
						</View>
					</Card>
				</View>
			)
		}

		this.setState({ cardList: cardList })
	}

	componentWillReceiveProps(nextProps) {
		var cardList = []

		for (i=0; i<this.props.selectedPlaces.length; i++) {
			cardList.push(
				<View key={i} style={{marginBottom: 8}}>
					<Card>
						<View style={styles.text}>
							<Text style={{fontSize: 18}}>{this.props.selectedPlaces[i].data.structured_formatting.main_text}</Text>
							<Text style={{fontSize: 14}}>{this.props.selectedPlaces[i].data.structured_formatting.secondary_text}</Text>
						</View>
					</Card>
				</View>
			)
		}

		this.setState({ cardList: cardList })
	}

	render() {

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
		backgroundColor: '#ffffff',
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 8
	},
	text: {
		paddingTop: 16,
		paddingBottom: 16,
		paddingLeft: 16,
		paddingRight: 16
	}
})