import Firebase from  './Firebase'

module.exports = class Post extends Firebase {
	constructor() {
		super()
	}

	createPost(author, date, title, text, music) {
		if (this.auth.currentUser !== null) {
			var ref = this.db.ref('post').push()
			ref.set({
				author: author,
				date: date,
				title: title,
				text: text,
				music: music,
				owner: this.auth.currentUser.uid
			})
		}
	}

	editPost(author, date, title, text, music, key) {
		if (this.auth.currentUser !== null) {
			var ref = this.db.ref('post/' + key)
			ref.set({
				author: author,
				date: date,
				title: title,
				text: text,
				music: music,
				owner: this.auth.currentUser.uid
			})
		}
	}

	getAllPost(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('post').once('value')
			.then(function(snapshot) {
				var result = {}

				snapshot.forEach(function(childSnapshot) {
					var key = childSnapshot.key,
						value = childSnapshot.val()

					result[key] = value
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

	getPostById(id, cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('post/' + id).once('value')
			.then(function(snapshot) {
				cb(null, snapshot.val())
			})
			.catch(function(error) {
				cb(error.code, error.message)
			})
		}
	}

	addChildAddedListener(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('post').on('child_added', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	addChildChangedListener(cb) {
		if (this.user !== null) {
			this.db.ref('post').on('child_changed', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	addChildRemovedListener(cb) {
		if (this.auth.currentUser !== null) {
			this.db.ref('post').on('child_removed', function(data) {
				cb(data.key, data.val())
			})
		}
	}

	removeAllListeners() {
		if (this.auth.currentUser !== null) {
			this.db.ref('post').off()
		}
	}
}