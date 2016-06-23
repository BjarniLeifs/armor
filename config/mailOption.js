/* Returning calls to whom ever called. */
module.exports = {
	// Configuration for the post service
	'smtpHost' 						: 'smtp.gmail.com',
	'smtpPort'						:  587,
	'emailUser' 					: 'travelapptests@gmail.com',
	'emailPass'						: 'bjarnil10',
	// Configuration for the link to click on ... http://...hosturlfromheaderreguest.../#/reset/...tokenfromAPI.
	'http' 							: 'http://',
	'injectUrl'						: '/#/reset/',
	// Configuration of the email content
	'projectName'  					: ' á vefsíðu armor.',
	'emailSubject' 					: 'Beðni um að breyta lykilorði notanda ',
	'greeting' 						: 'Hæ ',
	'contentMailToken'  			: ' þú hefur fengið þennan póst vegna þess að þú (eða einhver annar) hefur beðið um að breyta lykilorði hjá þér á aðgangi þínum á vefsíðu armor. \n\n Vinsamlegast smelltu á slóð hér að neðan, eða afritaðu þessa slóð í vafra til að breyta lykilorði. \n\n',
	'contentMailReportChangePass' 	: ' þú hefur fengið þennan póst vegna þess að þú (eða einhver annar) hefur beðið um að breyta lykilorði hjá þér á aðgangi þínum á kerfinu Trausti \n\n Lykilorðið þitt hefur verið uppfært\n\n Ef þú kannast ekki við að hafa uppfært lykilorðið þitt, þá vinsamlegast hafðu samband við stjórnanda.\n',
	'regards'						: 'Kær kveðja \n Vefkerfi Armor.'

};