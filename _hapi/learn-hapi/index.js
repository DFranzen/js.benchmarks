'use strict';

// Start this app from your command line with: node hellovalidate.js
// then visit: http://localhost:3000/YOURNAME

var Hapi = require('hapi');
var path = require('path');
var Boom = require('boom');
var Joi = require('joi');
var bcrypt = require('bcrypt');
var cryptiles = require('cryptiles');
var port = 3000; // process.env.PORT || 3000; // allow port to be set by environment

var server = new Hapi.Server();
server.app.key = 'secret_app_value_102';
server.connection({
  port: port
});

server.register([
  //{
  //  register: require('inert')
  //},
  {
    register: require('hapi-server-session'),
    options: {
      key: cryptiles.randomString(16),
      expiresIn: 100000,
      cookie: {
        isHttpOnly: true,
        isSecure: true
      }
    }
  }
], function (err) {
  if (err) {
    throw err;
  }

  //// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  inert cases >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //server.route({
  //  method: 'GET',
  //  path: '/document1/{user}/{file}',
  //  handler: function (request, reply) {
  //    reply.file(path.join(request.params.user, request.params.file));
  //  }
  //});
  //
  //server.route({
  //  method: 'GET',
  //  path: '/document2/{file}',
  //  handler: function (request, reply) {
  //    reply.file(request.params.file);
  //  }
  //});
  //
  //server.route({
  //  method: 'GET',
  //  path: '/document3/{user}/{file}',
  //  handler: {
  //    file: function (request) {
  //      return path.join(request.params.user, request.params.file);
  //    }
  //  }
  //});
  //
  //server.route({
  //  method: 'GET',
  //  path: '/document4/{name}',
  //  handler: {
  //    file: function (request) {
  //      return request.params.name;
  //    }
  //  }
  //});

  //// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  bcrypt cases >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  server.route({
    method: 'POST',
    path: '/positive/bcrypt/1/{password*}',
    config: {
      validate: {
        params: {
          password: Joi.string().max(128).min(8).alphanum()
        }
      },
      handler: function (request, reply) {
        var salt1 = bcrypt.genSaltSync(10); // param is optional
        reply(bcrypt.hashSync(request.params.password, salt1));
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/positive/bcrypt/3/{password*}',
    config: {
      validate: {
        params: {
          password: Joi.string().max(128).min(8).alphanum()
        }
      },
      handler: function (request, reply) {
        bcrypt.genSalt(function (err, res) {
          if (!err) {
            reply(bcrypt.hashSync(request.params.password, res));
          } else {
            reply("Internal Error");
          }
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/positive/bcrypt/2/{password*}',
    config: {
      validate: {
        params: {
          password: Joi.string().max(128).min(8).alphanum()
        }
      },
      handler: function (request, reply) {
        bcrypt.genSalt(10, function (err, salt) { // first param is optional
          if (err) {
            return reply(err);
          }
          reply(bcrypt.hashSync(request.params.password, salt));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/positive/bcrypt/4/{password*}',
    config: {
      validate: {
        params: {
          password: Joi.string().max(128).min(8).alphanum()
        }
      },
      handler: function (request, reply) {
        bcrypt.genSalt(function (err, res) {
          if (!err) {
            bcrypt.hash(request.params.password, res, null, function (err, hash) {
              if (err) {
                return reply(err);
              }
              reply(hash);
            });
          } else {
            reply("Internal Error");
          }
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/negative/bcrypt/1/{password*}',
    config: {
      validate: {
        params: {
          password: Joi.string().max(128).min(8).alphanum()
        }
      },
      handler: function (request, reply) {
        bcrypt.hash(request.params.password, null, null, function (err, hash) {
          if (err) {
            return reply(err);
          }
          reply(hash);
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/negative/bcrypt/2/{password*}',
    config: {
      validate: {
        params: {
          password: Joi.string().max(128).min(8).alphanum()
        }
      },
      handler: function (request, reply) {
        reply(bcrypt.hashSync(request.params.password, request.params.hash));
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/negative/bcrypt/3/{password*}',
    config: {
      validate: {
        params: {
          password: Joi.string().max(128).min(8).alphanum()
        }
      },
      handler: function (request, reply) {
        var hash = 'Hello World';
        reply(bcrypt.hashSync(request.params.password, hash));
      }
    }
  });

  //// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  generic cases >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //server.route({
  //  method: [
  //    'GET',
  //    'POST'
  //  ],
  //  path: '/{name*}',
  //  config: {
  //    // validate will ensure YOURNAME is valid before replying to your request
  //    validate: {
  //      params: {
  //        name: Joi.string().max(40).min(2).alphanum()
  //      }
  //    },
  //    handler: function (request, reply) {
  //      reply('Hi ' + request.params.name + '!');
  //    }
  //  }
  //});
  //
  //server.route({
  //  method: 'DELETE',
  //  path: '/{name*}',
  //  config: {
  //    // validate will ensure YOURNAME is valid before replying to your request
  //    validate: {
  //      params: {
  //        name: Joi.string().max(40).min(2).alphanum()
  //      }
  //    },
  //    handler: function (request, reply) {
  //      reply('Goodbye ' + request.params.name + '!');
  //    }
  //  }
  //});
  //
  //server.route({
  //  method: 'GET',
  //  path: '/photo/{id*}',
  //  config: {
  //    // validate will ensure YOURNAME is valid before replying to your request
  //    validate: {
  //      params: {
  //        id: Joi.string().max(40).min(2).alphanum()
  //      }
  //    }
  //  },
  //  handler: function (request, reply) {
  //    // until we implement authentication we are simply returning a 401:
  //    reply(Boom.unauthorized('Please log-in to see that'));
  //  }
  //});
  //
  //server.route([
  //  {
  //    method: 'GET',
  //    path: '/route/num/2',
  //    handler: function (request, reply) {
  //      return reply('ok 2');
  //    }
  //  },
  //  {
  //    method: 'GET',
  //    path: '/route/num/{id*}',
  //    config: {
  //      validate: {
  //        params: {
  //          id: Joi.string().max(10).min(3).alphanum()
  //        }
  //      }
  //    },
  //    handler: function (request, reply) {
  //      return reply('ok 1');
  //    }
  //  }
  //]);
});
//
//server.state('data', {
//  ttl: null,
//  isSecure: true,
//  isHttpOnly: true,
//  encoding: 'base64json',
//  clearInvalid: false, // remove invalid cookies
//  strictHeader: true // don't allow violations of RFC 6265
//});

server.start(function () {
  console.log('Now Visit: http://localhost:' + port + '/{YOURNAME}');
});

module.exports = server;
