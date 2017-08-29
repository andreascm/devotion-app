import React, { Component } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActionButton, Toolbar } from 'react-native-material-ui'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'

import PlanList from '../components/PlanList'

export default class PlannerScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	state = {
		planList: {}
	}

	componentDidMount = () => {
		Util.plan.getAllPlan((error, result) => {
			if (error) {
				console.log(error)
			} else {
				this.setState({ planList: result })
			}
		})

		Util.plan.addChildAddedListener((key, value) => {
			var planList = this.state.planList
			planList[key] = value
			this.setState({ planList: planList })
		})

		Util.plan.addChildChangedListener((key, value) => {
			var planList = this.state.planList
			planList[key] = value
			this.setState({ planList: planList })
		})

		Util.plan.addChildRemovedListener((key, value) => {
			var planList = this.state.planList
			delete planList[key]
			this.setState({ planList: planList })
		})
	}

	handleAddPlan = () => {
		this.props.navigator.push(Router.getRoute('newPlan'))
	}

	editPlan = (data, key) => {
		var selectedPlaces = []

		for (var i=0; i<data.clusters.length; i++) {
			for (var j=0; j<data.clusters[i].length; j++) {
				selectedPlaces.push(data.clusters[i][j])
			}
		}

		this.props.navigator.push(Router.getRoute('newPlan', {
			title: data.name,
			index: key,
			startDate: new Date(data.startDate),
			endDate: new Date(data.endDate),
			selectedDate: new Date(data.startDate),
			selectedPlaces: selectedPlaces
		}))
	}

	render = () => {

		return (
			<View style={styles.container}>
				<Toolbar
					centerElement='Searchable'
					searchable={{
						autoFocus: true,
						placeholder: 'Search'
					}} />
				<ScrollView>
				<View style={styles.content}>
					<PlanList planList={this.state.planList} editPlan={this.editPlan}/>
				</View>
				</ScrollView>
				<ActionButton
					icon="add"
					onPress={this.handleAddPlan.bind(this)} />
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
		padding: 16
	}
})