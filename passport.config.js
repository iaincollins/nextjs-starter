/**
 * Add configuration for oAuth providers here.
 * 
 * In addition to standard options to pass to Passport a getUserFromProfile()
 * method should be defined to allow us to use the same logic in 
 * passport-strategies.js for all providers (the oAuth standard doesn't
 * specify what format they should be in and different providers use different
 * names for fields like email address and name).
 **/

require('dotenv').load()

let providers = []

if (process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET) {
  providers.push({
    providerName: 'facebook',
    providerOptions: {
      scope: ['email', 'public_profile']
    },
    Strategy: require('passport-facebook').Strategy,
    strategyOptions: {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      profileFields: ['id', 'displayName', 'email', 'link']
    },
    getUserFromProfile(profile) {
      // Normalize profile object from Facebook into one with {id, name, email}
      return {
        id: profile.id,
        name: profile.displayName,
        email: profile._json.email
      }
    }
  })
}

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push({
    providerName: 'google',
    providerOptions: {
      scope: ['profile', 'email']
    },
    Strategy: require('passport-google-oauth').OAuth2Strategy,
    strategyOptions: {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    },
    getUserFromProfile(profile) {
      // Normalize profile object from Google into one with {id, name, email}
      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      }
    }
  })
}

/**
 * Note: Twitter doesn't expose emails by default.
 * If we don't get one, Passport-stategies.js will create a placeholder.
 *
 *
 * To have your Twitter oAuth return emails go to apps.twitter.com and add 
 * links to your Terms and Conditions and Privacy Policy under the "Settings" 
 * tab, then check the "Request email addresses" from users box under the 
 * "Permissions" tab. 
 **/
if (process.env.TWITTER_KEY && process.env.TWITTER_SECRET) {
  providers.push({
    providerName: 'twitter',
    providerOptions: {
      scope: []
    },
    Strategy: require('passport-twitter').Strategy,
    strategyOptions: {
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
    },
    getUserFromProfile(profile) {
      // Normalize profile object from Twitter into one with {id, name, email}
      return {
        id: profile.id,
        name: profile.displayName,
        email: (profile.emails && profile.emails[0].value) ? profile.emails[0].value : ''
      }
    }
  })
}

module.exports.providers = providers