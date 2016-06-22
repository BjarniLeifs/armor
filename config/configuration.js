/* Returning calls to whom ever called. */
module.exports = {
	/* Configuration of secrets goes here. */

	/* 
	 Setting variables for app
	 secret is all around in the app... here we set it for the whole app.
	*/
	'secret' : 'length.over c0mpl3xity haha6p',
	/* 
	 In scopes.js we need to change this aswell 
	 var tokenScopes = req.payload.scopes; payload = the name here "payload".
	 Do not change unless looking into helpers/scopes.js.
	 and change payload there to same.
	*/
	'payload' 						: 'payload',
	'connectionUrl' 				: 'postgres://postgres:1234@localhost:5432/armor',
	'smtpHost' 						: 'smtp.gmail.com',
	'smtpPort'						:  587,
	'emailUser' 					: 'travelapptests@gmail.com',
	'emailPass'						: 'bjarnil10',
	'projectName'  					: ' á vefsíðu armor.'
	'emailSubject' 					: 'Beðni um að breyta lykilorði notanda ',
	'greeting' 						: 'Hæ',
	'contentMailToken'  			: ' þú hefur fengið þennan póst vegna þess að þú (eða einhver annar) hefur beðið um að breyta lykilorði hjá þér á aðgangi þínum á vefsíðu armor. \n\n Vinsamlegast smelltu á slóð hér að neðan, eða afritaðu þessa slóð í vafra til að breyta lykilorði. \n\n',
	'contentMailReportChangePass' 	: ' þú hefur fengið þennan póst vegna þess að þú (eða einhver annar) hefur beðið um að breyta lykilorði hjá þér á aðgangi þínum á kerfinu Trausti \n\n Lykilorðið þitt hefur verið uppfært\n\n Ef þú kannast ekki við að hafa uppfært lykilorðið þitt, þá vinsamlegast hafðu samband við stjórnanda.\n',
	'regards'						: 'Kær kveðja \n Vefkerfi Armor.'


	
};