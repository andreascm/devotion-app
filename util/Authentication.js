import Firebase from  './Firebase'

module.exports = class Authentication extends Firebase {
	constructor() {
		super()
	}

	getUid = (cb) => {
		if (this.auth.currentUser !== null) {
			cb(this.auth.currentUser.uid)
		} else {
			cb(null)
		}
	}

	getAllUser = (cb) => {
		this.db.ref('users').once('value')
		.then(function(snapshot) {
			var users = []

			snapshot.forEach(function(childSnapshot) {
				users.push({
					username: childSnapshot.val().username,
					email: childSnapshot.val().email,
					admin: childSnapshot.val().admin
				})
			})

			cb(users)
		})
		.catch(function(error) {
			cb(null)
		})
	}

	isUsernameValid = (username, cb) => {
		this.getAllUser((users) => {
			if (users !== null) {
				for (var i=0; i<users.length; i++) {
					if (users[i].username !== null && users[i].username === username) {
						cb(false)
						return
					}
				}

				cb(true)
				return
 			}

	 		cb(false)
	 		return
		})
 	}

 	isAdmin = (email, cb) => {
 		this.getAllUser((users) => {
 			if (users !== null) {
				for (var i=0; i<users.length; i++) {
					if (users[i].email !== null && users[i].email === email) {
						cb(users[i].admin)
						return
					}
				}

				cb(false)
				return
 			}

	 		cb(false)
	 		return
 		})
 	}

 	addUser = (email, username) => {
 		if (this.auth.currentUser !== null) {
	 		this.db.ref('users/' + this.auth.currentUser.uid).set({
				username: username,
				admin: false,
				email: email
			})
		}
 	}

	signUp = (email, username, password, cb) => {
		var username = username
		this.auth.createUserWithEmailAndPassword(email, password)
		.then(function() {
			while(this.auth.currentUser === null) {
			}

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