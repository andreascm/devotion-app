import React, { Component } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActionButton, Toolbar } from 'react-native-material-ui'

import Router from '../navigation/Router'
import Colors from '../constants/Colors'
import Util from '../util'

import PostList from '../components/PostList'

export default class MainScreen extends Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	static defaultProps = {
		isAdmin: false
	}

	state = {
		postList: {},
		isAdmin: this.props.isAdmin
	}

	componentDidMount = () => {
		Util.post.getAllPost((error, result) => {
			if (error) {
				console.log(error)
			} else {
				this.setState({ postList: result })
			}
		})

		Util.post.addChildAddedListener((key, value) => {
			var postList = this.state.postList
			postList[key] = value
			this.setState({ postList: postList })
		})

		Util.post.addChildChangedListener((key, value) => {
			var postList = this.state.postList
			postList[key] = value
			this.setState({ postList: postList })
		})

		Util.post.addChildRemovedListener((key, value) => {
			var postList = this.state.postList
			delete postList[key]
			console.log(postList)
			this.setState({ postList: postList })
		})
	}

	handleAddPost = () => {
		this.props.navigator.push(Router.getRoute('newPost'))
	}

	editPost = (data, key) => {
		Util.authentication.getUid((uid) => {
			if (this.state.isAdmin && data.owner === uid) {
				this.props.navigator.push(Router.getRoute('newPost', {
					title: data.title,
					index: key,
					date: new Date(data.date),
					author: data.author,
					text: data.text,
					music: data.music,
					isAdmin: this.props.isAdmin
				}))
			} else {
				this.props.navigator.push(Router.getRoute('viewPost', {
					title: data.title,
					index: key,
					date: new Date(data.date),
					author: data.author,
					text: data.text,
					music: data.music
				}))
			}
		})
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
						<PostList postList={this.state.postList} editPost={this.editPost}/>
					</View>
				</ScrollView>
				{ this.state.isAdmin ?
					<ActionButton
						icon="add"
						onPress={this.handleAddPost.bind(this)} />
					: null
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
		padding: 16
	}
})