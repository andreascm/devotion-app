import Firebase from  './Firebase'

module.exports = class Authentication extends Firebase {
	constructor() {
		super()
	}

	getAllUsername = () => {
		this.db.ref('users').once('value')
		.then(function(snapshot) {
			var usernames = {}

			snapshot.forEach(function(childSnapshot) {
				usernames.push(childSnapshot.val().username)
			})

			return usernames
		})
		.catch(function(error) {
			return null
		})
	}

	isUsernameValid = (username) => {
		var usernames = getAllUsername()
		if (usernames !== null && usernames.indexOf(username) !== -1) {
			return false
		}

		return true
 	}

	signUp = (email, username, password, cb) => {
		var username = username
		this.auth.createUserWithEmailAndPassword(email, password)
		.then(function() {
			while(this.auth.currentUser == null) {
			}

			this.db.ref('users/' + this.auth.currentUser.uid).set({
				username: username
			})
			cb(null, null)
		}) 
		.catch(function(error) {
			cb(error.code, error.message)
		})
	}

	signIn = (email, password, cb) => {
		this.auth.signInWithEmailAndPassword(email, password)
		.then(function() {
			cb(null, null)
		})
		.catch(function(error) {
			cb(error.code, error.message)
		})
	}

	signOut = () => {
		this.auth.signOut()
		.then(function() {
			cb(null, null)
		}).catch(function(error) {
			cb(error.code, error.message)
		});
	}
}