//let exports = module.exports = {};

/* load the modern build */ 
let _ = require('lodash');

/* To check if person scopes (rights) */
exports.Scopes = (scopes) => {
  "use strict";
  return (req, res, next) => {
      /* Get from scope in request (req) payload. */
      let tokenScopes = req.payload.scopes;
      /* Checking for every scope, for val in scope and return it */
      let check = _.every(scopes, (val) => {
          return _.contains(tokenScopes, val);
      });
      /* If no Check! return 401 */
      if (!check) {
          return res.send(401, 'insufficient rights');
      } else {
          next();
      }
    };
};

/* To get scopes from token. */
exports.getScopesFromRequest = (req) => {

  return req.payload.scopes;
};

/* Getting username out of scope */
exports.getTokenUsername = (req) => {
  return req.payload.username;
};

/* Getting id from token */
exports.getTokenUserId = (req) => {
 return req.payload.id;
};
/* Getting exp date from token */
exports.expiertoken = (req) => {
  return req.paylod.exp;
};
/* Getting admin value of token  */
exports.admin = (req) => {
  return req.payload.admin;
};