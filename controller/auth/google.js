const passport = require('passport');
const User = require('../../schema/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const GOOGLE_CLIENT_ID = `236470399794-grve2s0gr7gk2snb76tphggoeq605qb9.apps.googleusercontent.com`
const GOOGLE_CLIENT_SECRET = `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`

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://webversesolution.com/sites/e4d4/api/auth/google/callback"
},
  async (accessToken, refreshToken, profile, cb) => {
    // console.log('accessToken',accessToken)
    // console.log('refreshToken',refreshToken)
    console.log('profile', profile._json)
    const userInfo = profile._json
    const checkUser = await User.findOne({
      'primaryEmail.email': userInfo.email
    });
    if (!checkUser) {
      const user = await User.create({
        fullName: userInfo.name,
        primaryEmail: {
          email: userInfo.email,
          verified: userInfo.email_verified,
          provider: [{
            id: userInfo.sub,
            type: 'google'
          }],
        }
      })
      
      console.log('Registered using Google')
      return cb(null, user);
    } else {
      if (!checkUser.primaryEmail.provider.some(provider => provider.type === 'google')) {
        checkUser.primaryEmail.provider.push({ type: 'google', id: profile.id });
        await checkUser.save();
      }
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