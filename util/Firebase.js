var firebase = require("firebase"),
	config = {
		apiKey: "AIzaSyCUx6R11tvDcnaRMbNwLEJpLdoOtJ1D99E",
	    authDomain: "devotion-16c22.firebaseapp.com",
	    databaseURL: "https://devotion-16c22.firebaseio.com",
	    projectId: "devotion-16c22",
	    storageBucket: "devotion-16c22.appspot.com",
	    messagingSenderId: "826195465935"
	}
firebase.initializeApp(config)

module.exports = class Firebase {
	constructor() {
		this.firebase = firebase
		this.config = config
		this.user = null
		this.db = this.firebase.database()
		this.auth = this.firebase.auth()
		this.storage = this.firebase.storage()
	}
}