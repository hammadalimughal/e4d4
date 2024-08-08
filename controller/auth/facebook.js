const passport = require('passport');
const User = require('../../schema/User');
const FacebookStrategy = require('passport-facebook').Strategy;

const FACEBOOK_APP_ID = `373536035551217`;
const FACEBOOK_APP_SECRET = `06bca01189f162ff3775f99c0ef8546d`;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8080/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log('profile', profile._json);
        const userInfo = profile._json;

        // Example findOrCreate method
        // let user = await User.findOne({ 'provider.id': userInfo.id, 'provider.type': 'facebook' });
        let user = await User.findOne({
            'primaryEmail.email': userInfo.email
        });
        if (!user) {
            user = await User.create({
                firstName: userInfo.name.split(' ')[0],
                lastName: userInfo.name.split(' ')[userInfo.name.split(' ').length - 1],
                primaryEmail: {
                    email: userInfo.email,
                    verified: true,
                    provider: {
                        id: userInfo.id,
                        type: 'facebook'
                    },
                }
            });
            console.log('Registered using Facebook');
        } else {
            if (!user.primaryEmail.provider.some(provider => provider.type === 'facebook')) {
                user.primaryEmail.provider.push({ type: 'facebook', id: userInfo.id });
                await user.save();
            }
            console.log('Already registered from Facebook');
        }
        return cb(null, user);
    } catch (err) {
        return cb(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
