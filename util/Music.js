

import Firebase from  './Firebase'

module.exports = class Music extends Firebase {
	constructor() {
		super()
	}

	getAllMusic(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('musics').once('value')
			.then(function(snapshot) {
				var result = []

				snapshot.forEach(function(childSnapshot) {
					var key = childSnapshot.key,
						value = childSnapshot.val()

					result.push({
						title: key,
						url: value
					})
				})

				cb(null, result)
			})
			.catch(function(error) {
				cb(error.code, error.message)
			})
		} else {
			cb('noUser', 'noCurrentUser')
		}
	}

	addChildAddedListener(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('musics/' + this.auth.currentUser.uid).on('child_added', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	addChildChangedListener(cb) {
		if (this.user !== null) {
			this.db.ref('musics/' + this.auth.currentUser.uid).on('child_changed', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	addChildRemovedListener(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('musics/' + this.auth.currentUser.uid).on('child_removed', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	removeAllListeners() {
		if (this.auth.currentUser !== null) {
			this.db.ref('musics/' + this.auth.currentUser.uid).off()
		}
	}
}