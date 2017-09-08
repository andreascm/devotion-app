import { createRouter } from '@expo/ex-navigation'

import HomeScreen from '../screens/HomeScreen'
import SignUpScreen from '../screens/SignUpScreen'
import SignInScreen from '../screens/SignInScreen'
import MainScreen from '../screens/MainScreen'
import NewPostScreen from '../screens/NewPostScreen'
import ViewPostScreen from '../screens/ViewPostScreen'

export default createRouter(() => ({
	home: () => HomeScreen,
	signUp: () => SignUpScreen,
	signIn: () => SignInScreen,
	main: () => MainScreen,
	newPost: () => NewPostScreen,
	viewPost: () => ViewPostScreen
	// setting: () => SettingScreen
}), {
	ignoreSerializableWarnings: true
})