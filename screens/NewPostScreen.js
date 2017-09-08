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
		music: this.props.music,

		selectedDate: this.props.selectedDate,
		timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
		iOSDatePickerOpen: false,

		musicList: [],
	}

	componentDidMount = () => {
		Util.music.getAllMusic((error, result) => {
			if (error) {
				console.log(error)
			} else {
				this.setState({ musicList: result })
			}
		})

		Util.music.addChildAddedListener((key, value) => {
			var musicList = this.state.musicList
			musicList.push({
				title: key,
				url: value
			})
			this.setState({ musicList: musicList })
		})

		Util.music.addChildChangedListener((key, value) => {
			var musicList = this.state.musicList
			for (var i=0; i<musicList.length; i++) {
				if (musicList[i].title === key) {
					musicList[i].url = value
					break
				}
			}
			this.setState({ musicList: musicList })
		})

		Util.music.addChildRemovedListener((key, value) => {
			var musicList = this.state.musicList
			for (var i=0; i<musicList.length; i++) {
				if (musicList[i].title === key) {
					musicList.splice(i, 1)
					break
				}
			}
			this.setState({ musicList: musicList })
		})
	}

	datePicker = async () => {
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
					date: this.state.selectedDate
				})
				if (action === DatePickerAndroid.dismissedAction) {
					var date = new Date(year, month, day)
					this.setState({ selectedDate: date })
				} else {
					var date = new Date(year, month, day)

					this.setState({
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
			this.setState({
				date: this.state.selectedDate
			})
		} else {
			this.setState({
				iOSDatePickerOpen: false
			})
		}
	}

	handleAction = (action) => {
		if (action === 'cloud-upload') {
			this.handleUploadMusic()
		} else if (action === 'publish') {
			this.handlePublishPost()
		}
	}

	handleUploadMusic = () => {
		
	}

	handlePublishPost = () => {
		if (this.props.index === null) {
			Util.post.createPost(this.state.author, this.state.date.getTime(), this.state.title, this.state.text, this.state.music)
		} else {
			Util.post.editPost(this.state.author, this.state.date.getTime(), this.state.title, this.state.text, this.state.music, this.props.index)
		}
		this.props.navigator.push(Router.getRoute('main', {
			isAdmin: this.props.isAdmin
		}))
	}

 	render = () => {
		return (
			<View style={styles.container}>
				<Toolbar
					leftElement='arrow-back'
					centerElement='New Post'
					onLeftElementPress={() => this.props.navigator.pop()} />
				<ScrollView>
					<View style={styles.content}>
						<MKTextField
							style={{height: 45}}
		        			autoCorrect={false}
							placeholder="Post Title"
							textInputStyle={{flex: 1, fontSize: 20}}
							returnKeyType='next'
							floatingLabelEnabled={true}
							allowFontScaling={true}
							floatingLabelBottomMargin={45}
							onChangeText={(title) => this.setState({title})}
							value={this.state.title} />
						<MKTextField
							style={{height: 45}}
		        			autoCorrect={false}
							placeholder="Author Name"
							textInputStyle={{flex: 1, fontSize: 20}}
							returnKeyType='next'
							floatingLabelEnabled={true}
							allowFontScaling={true}
							floatingLabelBottomMargin={45}
							onChangeText={(author) => this.setState({author})}
							value={this.state.author} />
						<MKTextField
							style={{width: '43%', height: 45}}
		        			autoCorrect={false}
							placeholder="Post Date"
							textInputStyle={{flex: 1, fontSize: 20}}
							returnKeyType='next'
							floatingLabelEnabled={true}
							allowFontScaling={true}
							floatingLabelBottomMargin={45}
							onChangeText={(date) => this.setState({date})}
							onFocus={this.datePicker.bind(this)}
							value={this.state.date.toDateString()} />
						<View style={{flex: 1, marginTop: 32}}>
							<Text style={{fontSize: 20}}>Text</Text>
							<MKTextField
								style={{height: 210}}
			        			autoCorrect={false}
								placeholder=""
								textInputStyle={{flex: 1, fontSize: 16, textAlignVertical: 'top'}}
								blurOnSubmit={false}
								multiline={true}
								numberOfLines={10}
								floatingLabelEnabled={true}
								allowFontScaling={true}
								floatingLabelBottomMargin={16}
								onChangeText={(text) => this.setState({text})}
								value={this.state.text} />
						</View>
						<View style={{flex: 1, marginTop: 32}}>
							<Text style={{fontSize: 20}}>Music</Text>
							<Picker
								selectedValue={this.state.music}
								onValueChange={(itemValue, itemIndex) => this.setState({music: itemValue})}>
								{ this.state.musicList.map((music) => (
									<Picker.Item key={this.state.musicList.indexOf(music)} label={music.title} value={music.url} />	
								))}
							</Picker>
						</View>
					</View>
				</ScrollView>
				<ActionButton
					actions={[{icon: 'cloud-upload', label: 'Upload Music', name: 'cloud-upload'}, {icon: 'publish', label: 'Publish Post', name: 'publish'}]}
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