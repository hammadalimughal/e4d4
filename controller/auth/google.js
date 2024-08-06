const passport = require('passport');
const User = require('../../schema/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = `8489350076-nlkfq6hdc50o23414057879dm5giudod.apps.googleusercontent.com`
const GOOGLE_CLIENT_SECRET = `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`

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/api/auth/google/callback"
},
  async (accessToken, refreshToken, profile, cb) => {
    // console.log('accessToken',accessToken)
    // console.log('refreshToken',refreshToken)
    console.log('profile', profile._json)
    const userInfo = profile._json
    const checkUser = await User.findOne({
      'provider.id': userInfo.sub,
      'provider.type': 'google'
    });
    if (!checkUser) {
      const user = await User.create({
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        provider: {
          id: userInfo.sub,
          type: 'google'
        },
        primaryEmail: {
          email: userInfo.email,
          verified: userInfo.email_verified,
        }
      })
      console.log('Registered using Google')
      return cb(null, user);
    } else {
      console.log('already Registered from Google')
      return cb(null, checkUser);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})