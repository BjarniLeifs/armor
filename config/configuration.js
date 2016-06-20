/* Returning calls to whom ever called. */
module.exports = {
	/* Configuration of secrets goes here. */

	/* 
	 Setting variables for app
	 secret is all around in the app... here we set it for the whole app.
	*/
	'secret' : 'SECRET',
	/* 
	 In scopes.js we need to change this aswell 
	 var tokenScopes = req.payload.scopes; payload = the name here "payload".
	 Do not change unless looking into helpers/scopes.js.
	 and change payload there to same.
	*/
	'payload' : 'payload',

	//'connectionUrl' : 'postgres://postgres:1234@localhost:5432/armor' 
	'connectionUrl' : 'postgres://postgres:1234@localhost:5432/armor',
	'smtpHost' : 'smtp.gmail.com',
	'emailUser': 'travelapptests@gmail.com',
	'emailPass': 'bjarnil10' 
	
};