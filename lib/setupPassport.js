var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({  
    domain:       'wpablo.auth0.com',
    clientID:     'EthQ6xAUsiEat6vecpmjdSZ0ehlYAATa',
    clientSecret: 'o6RM-pEl8DzyXmQg71kSQf9dqGZB6S8mN9hk3hqxMbZLWosUnuRDqJldo8P29RTN',
    callbackURL:  '/callback'
  }, function(accessToken, refreshToken, profile, done) {
    //Some tracing info
    console.log('profile is', profile);
    return done(null, profile);
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user); 
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy; 