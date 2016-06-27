
/* /config.js */
var config = function () { 
	switch(process.env.NODE_ENV) {
		case 'development':
			return {
				'secret' 		: 'length.over c0mpl3xity haha6p',
				'payload' 		: 'payload',
				'connectionUrl' : 'postgres://postgres:1234@localhost:5432/armor',
				'addTestUserUrl': 'postgres://postgres:1234@localhost:5432/testarmor'
			};

		case 'production':
			return {
				'secret' 		: 'length.over c0mpl3xity haha6p',
				'payload' 		: 'payload',
				'connectionUrl' : 'postgres://postgres:1234@localhost:5432/armor',
				'addTestUserUrl': 'postgres://postgres:1234@localhost:5432/testarmor'
			};

		case 'testing':
			return {
				'secret' 		: 'length.over c0mpl3xity haha6p',
				'payload' 		: 'payload',
				'connectionUrl' : 'postgres://postgres:1234@localhost:5432/testarmor',
				'addTestUserUrl': 'postgres://postgres:1234@localhost:5432/testarmor'
			};

		default:
			return {
				'secret' 		: 'length.over c0mpl3xity haha6p',
				'payload' 		: 'payload',
				'connectionUrl' : 'postgres://postgres:1234@localhost:5432/armor',
				'addTestUserUrl': 'postgres://postgres:1234@localhost:5432/testarmor'
			};
	}
};

module.exports = new config();  