import React, { Component } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Card } from 'react-native-material-ui'

export default class PostList extends Component {
	state = {
		cardList: []
	}

	componentDidMount = () => {
		//console.log(this.props.postList)
		var cardList = [],
			keys = Object.keys(this.props.postList)

		for (i=0; i<keys.length; i++) {
			//console.log(this.props.postList[keys[i]])
			cardList.push(
				<TouchableHighlight onPress={this.editPost.bind(this.props.postList[keys[i]], keys[i])} underlayColor="white">
					<View key={keys[i]} style={{marginBottom: 16}}>
						<Card>
							<View style={styles.text}>
								<Text style={{fontSize: 20}}>{this.props.postList[keys[i]].title}</Text>
								<Text>{new Date(this.props.postList[keys[i]].date).toDateString()}</Text>
								<Text style={{marginBottom: 8}}>{this.props.postList[keys[i]].author}</Text>
								{ this.props.postList[keys[i]].text.length > 100 ?
									<Text>{this.props.postList[keys[i]].text.substring(0, 97)}...</Text>
									: <Text>{this.props.postList[keys[i]].text}</Text>
								}
							</View>
						</Card>
					</View>
				</TouchableHighlight>
			)
		}

		this.setState({ cardList: cardList })
	}

	componentWillReceiveProps = (nextProps) => {
		//console.log(this.props.postList)
		var cardList = [],
			keys = Object.keys(nextProps.postList)

		for (i=0; i<keys.length; i++) {
			//console.log(this.props.postList[keys[i]])
			cardList.push(
				<TouchableHighlight onPress={this.editPost.bind(this, this.props.postList[keys[i]], keys[i])} underlayColor="white">
					<View key={keys[i]} style={{marginBottom: 16}}>
						<Card>
							<View style={styles.text}>
								<Text style={{fontSize: 20}}>{this.props.postList[keys[i]].title}</Text>
								<Text>{new Date(this.props.postList[keys[i]].date).toDateString()}</Text>
								<Text style={{marginBottom: 8}}>{this.props.postList[keys[i]].author}</Text>
								{ this.props.postList[keys[i]].text.length > 300 ?
									<Text>{this.props.postList[keys[i]].text.substring(0, 297)}...</Text>
									: <Text>{this.props.postList[keys[i]].text}</Text>
								}
							</View>
						</Card>
					</View>
				</TouchableHighlight>
			)
		}

		this.setState({ cardList: cardList })
	}

	editPost = (data, key) => {
		this.props.editPost(data, key)
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
	text: {
		paddingTop: 16,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16
	}
})