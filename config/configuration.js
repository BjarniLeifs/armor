
/* /config.js */
var config = function () { 
	switch(process.env.NODE_ENV) {
		case 'development':
			return {
				'secret' 		: 'length.over c0mpl3xity haha6p',
				'payload' 		: 'payload',
				'connectionUrl' : 'postgres://postgres:1234@localhost:5432/armor',
			};

		case 'production':
			return {
				'secret' 		: 'length.over c0mpl3xity haha6p',
				'payload' 		: 'payload',
				'connectionUrl' : 'postgres://postgres:1234@localhost:5432/armor',
			};

		case 'testing':
			return {
				'secret' 		: 'length.over c0mpl3xity haha6p',
				'payload' 		: 'payload',
				'connectionUrl' : 'postgres://postgres:1234@localhost:5432/testarmor',
			};

		default:
			return {
				'secret' 		: 'length.over c0mpl3xity haha6p',
				'payload' 		: 'payload',
				'connectionUrl' : 'postgres://postgres:1234@localhost:5432/armor',
			};
	}
};

module.exports = new config();  