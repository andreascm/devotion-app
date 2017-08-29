import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { StackNavigation, TabNavigation, TabNavigationItem } from '@expo/ex-navigation'

import Router from './Router'
import Colors from '../constants/Colors';

const defaultRouteConfig = {
	navigationBar: {
		titleStyle: {fontFamily: 'OpenSans-Bold'},
		backgroundColor: '#ffffff'
	}
}

export default class TabNavigationLayout extends React.Component {
	static route = {
		navigationBar: {
			visible: false
		}
	}

	render() {
		return (
			<TabNavigation
				tabBarColor={'#fefefe'}
				tabBarHeight={48}
				initialTab="list">

				<TabNavigationItem
					id="list"
					rendericon={isSelected => this._renderIcon('view-list', isSelected)}>
					<StackNavigation
						defaultRouteConfig={defaultRouteConfig}
						initialRoute={Router.getRoute('home')} />
				</TabNavigationItem>

				<TabNavigationItem
					id="list2"
					rendericon={isSelected => this._renderIcon('view-list', isSelected)}>
					<StackNavigation
						defaultRouteConfig={defaultRouteConfig}
						initialRoute={Router.getRoute('home')} />
				</TabNavigationItem>

				<TabNavigationItem
					id="list3"
					rendericon={isSelected => this._renderIcon('view-list', isSelected)}>
					<StackNavigation
						defaultRouteConfig={defaultRouteConfig}
						initialRoute={Router.getRoute('home')} />
				</TabNavigationItem>
			</TabNavigation>
		)
	}

	_renderIcon(iconName, isSelected) {
		let color = isSelected ? '#000000' : '#cccccc'

		return (
			<View style={styles.tabItemContainer}>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	tabItemContainer: {
		alignItems: 'center',
		justifyContent: 'center'
	}
})