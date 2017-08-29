import React, { Component } from 'react'
import { DatePickerAndroid, DatePickerIOS, Dialog, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActionButton, Toolbar } from 'react-native-material-ui'
import { MKTextField } from 'react-native-material-kit'
import RNGooglePlaces from 'react-native-google-places'

import async from 'async'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'
import PlaceList from '../components/PlaceList'

export default class NewPlanScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	static defaultProps = {
		selectedDate: new Date((new Date()).setHours(0,0,0,0)),
		startDate: new Date((new Date()).setHours(0,0,0,0)),
		endDate: new Date((new Date()).setHours(0,0,0,0)),
		timeZoneOffsetInHours: (-1) * (new Date((new Date()).setHours(0,0,0,0))).getTimezoneOffset() / 60,

		title: '',
		selectedPlaces: []
	}

	state = {
		title: this.props.title,
		startDate: this.props.startDate,
		endDate: this.props.endDate,

		selectedDate: this.props.selectedDate,
		timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
		iOSDatePickerOpen: false,

		dateType: 'start',

		selectedPlaces: this.props.selectedPlaces
	}

	startDatePicker = async () => {
		this.setState({
			dateType: 'start'
		})
		if (Platform.OS === 'ios') {
			this.setState({
				iOSDatePickerOpen: true
			})
		} else if (Platform.OS === 'android') {
			try {
				const {action, year, month, day} = await DatePickerAndroid.open({
					date: this.state.selectedDate,
					minDate: new Date()
				})
				if (action === DatePickerAndroid.dismissedAction) {
					var date = new Date(year, month, day)
					this.setState({ selectedDate: date })
				} else {
					var date = new Date(year, month, day)

					this.setState({
						startDate: date,
						selectedDate: date
					})	
				}
			} catch ({code, message}) {
				console.warn('Cannot open date picker', message);
			}
		}
	}

	endDatePicker = async () => {
		this.setState({
			dateType: 'end'
		})
		if (Platform.OS === 'ios') {
			this.setState({
				iOSDatePickerOpen: true
			})
		} else if (Platform.OS === 'android') {
			try {
				const {action, year, month, day} = await DatePickerAndroid.open({
					date: this.state.selectedDate,
					minDate: new Date()
				})
				if (action === DatePickerAndroid.dismissedAction) {
					var date = new Date(year, month, day)
					this.setState({ selectedDate: date })
				} else {
					var date = new Date(year, month, day)

					this.setState({
						endDate: date,
						selectedDate: date
					})
				}
			} catch ({code, message}) {
				console.warn('Cannot open date picker', message);
			}
		}
	}

	onDateChange = (date) => {
		this.setState({selectedDate: date})
	}

	onTimezoneChange = (event) => {
		var offset = parseInt(event.nativeEvent.text, 10)
		if (isNaN(offset)) {
		  return;
		}
		this.setState({timeZoneOffsetInHours: offset})
	}

	handleDialogAction = (action) => {
		if (action === 'Add') {
			if (this.state.dateType === 'start') {
				this.setState({
					startDate: this.state.selectedDate
				})
			} else if (this.state.dateType === 'end') {
				this.setState({
					endDate: this.state.selectedDate
				})
			}
		} else {
			this.setState({
				iOSDatePickerOpen: false
			})
		}
	}

	handleAction = (action) => {
		if (action === 'add-location') {
			this.handleAddPlace()
		} else if (action === 'assignment') {
			this.props.navigator.push(Router.getRoute('planSummary', {
				title: this.state.title,
				startDate: this.state.startDate,
				endDate: this.state.endDate,
				selectedPlaces: this.state.selectedPlaces,
				index: this.props.index
			}))
		}
	}

	handleAddPlace = () => {
		this.props.navigator.push(Router.getRoute('addPlace', {getAddedPlace: this.handleGetAddedPlace}))
	}

	handleGetAddedPlace = (place) => {
		this.state.selectedPlaces.push(place)
	}

 	render = () => {
		return (
			<View style={styles.container}>
				<Toolbar
					leftElement='arrow-back'
					centerElement='New Plan'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<ScrollView>
					<View style={styles.content}>
						<MKTextField
							style={{height: 45}}
		        			autoCorrect={false}
							placeholder="Plan Title"
							textInputStyle={{flex: 1, fontSize: 20}}
							returnKeyType='next'
							floatingLabelEnabled={true}
							allowFontScaling={true}
							floatingLabelBottomMargin={45}
							onChangeText={(title) => this.setState({title})}
							value={this.state.title} />
						<View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
							<MKTextField
								style={{width: '43%', height: 45}}
			        			autoCorrect={false}
								placeholder="Start Date"
								textInputStyle={{flex: 1, fontSize: 20}}
								returnKeyType='next'
								floatingLabelEnabled={true}
								allowFontScaling={true}
								floatingLabelBottomMargin={45}
								onChangeText={(startDate) => this.setState({startDate})}
								onFocus={this.startDatePicker.bind(this)}
								value={this.state.startDate.toDateString()} />
							<Text style={{fontSize: 20, marginTop: 20, marginLeft: 16, marginRight: 16}}>to</Text>
							<MKTextField
								style={{width: '43%', height: 45}}
			        			autoCorrect={false}
								placeholder="End Date"
								textInputStyle={{flex: 1, fontSize: 20}}
								returnKeyType='next'
								floatingLabelEnabled={true}
								allowFontScaling={true}
								floatingLabelBottomMargin={45}
								onChangeText={(endDate) => this.setState({endDate})}
								onFocus={this.endDatePicker.bind(this, 'end')}
								value={this.state.endDate.toDateString()} />
						</View>
						<View style={{flex: 1, marginTop: 32}}>
							<Text style={{fontSize: 20}}>Places</Text>
						</View>
					</View>
					<PlaceList
						selectedPlaces={this.state.selectedPlaces} />
				</ScrollView>
				<ActionButton
					actions={[{icon: 'add-location', label: 'Add Place', name: 'add-location'}, {icon: 'assignment', label: 'Make Plan', name: 'assignment'}]}
                    icon='add'
                    transition='speedDial'
                    onPress={(action) => this.handleAction(action)} />
				{ this.state.iOSDatePickerOpen ?
					<Dialog>
                        <Dialog.Title><Text>Select a date</Text></Dialog.Title>
                        <Dialog.Content>
                            <DatePickerIOS
								date={this.state.selectedDate}
								mode="date"
								timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
								onDateChange={this.onDateChange} />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <DialogDefaultActions
                                actions={['Cancel', 'Add']}
                                onActionPress={(action) => this.handleDialogAction.bind(this, action)} />
                        </Dialog.Actions>
                    </Dialog>
					: <View></View>
				}
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