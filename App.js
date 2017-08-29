import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLOR, ThemeProvider} from 'react-native-material-ui'
import { Provider } from 'react-redux'

import Expo from 'expo'
import { NavigationProvider, NavigationContext, StackNavigation } from '@expo/ex-navigation'

import Router from './navigation/Router'
import Store from './state/Store'

const navigationContext = new NavigationContext({
  router: Router,
  store: Store,
})

export default class AppContainer extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <NavigationProvider router={Router} context={navigationContext}>
          <App {...this.props}/>
        </NavigationProvider>
      </Provider>
    )
  }
}

class App extends React.Component {
  render() {
    const uiTheme = {
      palette: {
        primaryColor: '#3AA5E6',
      },
      toolbar: {
        container: {
          height: 50,
        },
      },
    };

    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
          <StackNavigation
            id='root'
            defaultRouteConfig={{navigationBar: {backgroundColor: '#ffffff'}}}
            initialRoute={Router.getRoute('home')} />
        </View>
      </ThemeProvider>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

Expo.registerRootComponent(AppContainer)
