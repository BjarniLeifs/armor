const secret 		= 'length.over c0mpl3xity haha6p';
const tokenPayload 	= 'payload';
const productionDb 	= 'postgres://postgres:1234@localhost:5432/armor';
const developmentDb = 'postgres://postgres:1234@localhost:5432/armor';
const testingDb 	= 'postgres://postgres:1234@localhost:5432/testarmor';
/* /config.js */
const config = () => { 
	switch(process.env.NODE_ENV) {
		case 'development':
			return {
				'secret' 		: secret,
				'payload' 		: tokenPayload,
				'connectionUrl' : developmentDb,
				'addTestUserUrl': testingDb
			};

		case 'production':
			return {
				'secret' 		: secret,
				'payload' 		: tokenPayload,
				'connectionUrl' : productionDb,
				'addTestUserUrl': testingDb
			};

		case 'testing':
			return {
				'secret' 		: secret,
				'payload' 		: tokenPayload,
				'connectionUrl' : testingDb,
				'addTestUserUrl': testingDb
			};

		default:
			return {
				'secret' 		: secret,
				'payload' 		: tokenPayload,
				'connectionUrl' : developmentDb,
				'addTestUserUrl': testingDb
			};
	}
};

module.exports = config();  