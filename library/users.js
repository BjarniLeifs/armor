var exports = module.exports = {};
/* Declare of bcrypt model, it is for salt and hasing information. Security model. */
var bcrypt = require('bcryptjs');

/* Declare nodemailer  to send emails */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
/*
 Declare of jwt (Json web token), used for client and server for authanticating user 
 This is done for security feature.. other method that can be used = sessions.
*/
var jwt = require('jsonwebtoken');
//var jwts = require('jwt-simple');
/* Getting secrets config file. */
var config = require('../config/configuration');
var service = require('./../library/dbLibrary');

/* register new user */
exports.register = function (req, cb) {
	bcrypt.genSalt(10, function (err, salt) {
	    bcrypt.hash(req.body.password, salt, function(err, hash) {
			var stringAdd = 'INSERT INTO users (username, name, email, hash, salt)';
				stringAdd +='  VALUES($1, $2, $3, $4, $5) returning *';
				// Defining values to insert 
				var value = [req.body.username, req.body.name, 
							req.body.email, hash, null];
				// Calling postService to add values with string constrains 
				service.queryStringValue(stringAdd, value, function (err, results) {
						if (results) {
							return cb(true);
						} else {
							return cb(false);
						}
					}
				);; 
   		});
	});	
};

/* setPassword for user */
exports.setPassword = function (password) {
	//console.log(password);
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(password, salt, function(err, hash) {
	    	if (err)
	    		return err;
			return hash; 
   		});
	});	
};

/* Validating the password of user. */
exports.validPassword = function (password, object, cb) {
	//console.log(object);
	bcrypt.compare(password, object.hash, function (err, res) {
    	return cb(res);
	});
};

/* Change password if user needs to change it for any reson. */
exports.changePassword = function (object) {
	/* Set new object with right information */
	var checkobject = {
		salt : object.salt,
		hash : object.hash
	};
	/* validate if everything is okei */
	if (validPassword(object.oldPassword, checkobject)) {
		/* Get new hash and salt */
		var setPass = setPassword(object.newPassword);
		/* Populate return object with new data. (new salt and hash) */
		var returnObject = {
			username: object.username,
			salt 	: setPass.salt,
			hash 	: setPass.hash
		};	
		return returnObject;
	} 
	else {
		/* We have an error */
		return null;
	}
};

/* 
 Generating json web token for user.. exp = expire, returns token
 with id, usernamem scope and when it expires +
*/
exports.generateJWT = function (object) {
	/* Set expirateion to 4 days. */
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 4);
	var scopes = [];

		
	scopes.push('user');


	/* Sign the token and return it. */
	return jwt.sign({
		/* 
		 Payload, here we can set what ever we want to send with
		 the token and use for what ever we want. Pease do not send
		 password or other sensitive information.
		*/
		id 		: object.id,
		username: object.username,
		name 	: object.name,	
		scopes  : scopes,
		imageurl: object.imageurl,
		exp 	: parseInt(exp.getTime() /1000)
	}, 
	config.secret);
};

/* Just used to reset password and store this token */
exports.generateResetJWT = function (object) {
	/* Set expirateion to 1 hour. */
	var expTime = Date.now() + 3600000; 

	return jwt.sign({
		/* 
		 Payload, here we can set what ever we want to send with
		 the token and use for what ever we want. Pease do not send
		 password or other sensitive information.
		*/
		id: object.id,
		username: object.username,
		exp: expTime
	}, 
	config.secret);
};

/* After generate token this is used to send e-mail to user with token. */
exports.sendResetPassEmail = function (user, token, req) {
	/* Defining the transporter to send email with configureation */
	var transporter = nodemailer.createTransport(smtpTransport({
		    host: config.smtpHost,
		    port: 587,
	   		auth: {
	       		user: config.emailUser,
	       		pass: config.emailPass
	    	}
		}));
	/* Structor for the e-mail to be sent. */
	var mailOptions = {
		to: user.email,
		from: 'test@vedur.is',
		subject: 'Vedurstofa Íslands, beðni um að breyta lykilorði notanda '+ user.name + ' ',
		text: 'Hæ '+user.name+' þú hefur fengið þennan póst vegna þess að þú (eða einhver annar) hefur beðið um að breyta lykilorði hjá þér á aðgangi þínum á kerfinu Trausti \n\n' +
			'Vinsamlegast smelltu á slóð hér að neðan, eða afritaðu þessa slóð og notaðu í vafra til að ljúka þessu ferli.\n\n' +
			'slóð : http://' + req.headers.host + '/#/reset/' + token.token + ' \n\n' +
			'Ef þú hefur ekki beðið um þetta, þá vinsamlegast máttu leiða þennan póst hjá þér og lykilorðið þitt verður óbreytt.\n' + '\n\n' +
			'Kær Kveðja \n' +
			'Vefkerfið Trausti'
	};
	/* Sending e-mail to user, error checking or send. */
	transporter.sendMail(mailOptions, function (err, res) {
		if (err) {
			return err;
		} else {
			return true;
		}
	});

};

/* Same as other above, however this is only sent to confirm that everything went well or not. */
exports.confirmPassReset = function (user, req) {
	var transporter = nodemailer.createTransport(smtpTransport({
		    host: config.smtpHost,
		    port: 587,
	   		auth: {
	       		user: config.emailUser,
	       		pass: config.emailPass
	    	}
		})
	);
	var mailOptions = {
		to: user.email,
		from: 'trausti@vedurstofa.is',
		subject: 'Vedurstofa Íslands, beðni um að breyta lykilorði notanda '+ user.name + ' ',
		text: 'Hæ '+user.name+' þú hefur fengið þennan póst vegna þess að þú (eða einhver annar) hefur beðið um að breyta lykilorði hjá þér á aðgangi þínum á kerfinu Trausti \n\n' +
			'Lykilorðið þitt hefur verið uppfært\n\n' +
			'Ef þú kannast ekki við að hafa uppfært lykilorðið þitt, þá vinsamlegast hafðu samband við stjórnanda.\n' + 
			'\n\n' +
			'Kær Kveðja \n' +
			'Vefkerfið Trausti'
	};
	transporter.sendMail(mailOptions, function (err, res) { 
		if (err) {
			return err;
		} else {
			return true;
		}
	});
	
}; 

exports.decodeJWT = function (req) {
	//console.log('header i helper ' + req.headers.authorization);
	var token = req.headers.authorization;
	token2 = token.substring(7);
	//console.log("token 2 " + token2);
	var decoded = jwt.verify(token2, config.secret);
	//console.log("decode i helper " + decoded.id + ' ' + decoded.username);
	return decoded;
};
