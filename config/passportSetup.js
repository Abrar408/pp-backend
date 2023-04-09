const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../model/users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((newUser) => {
    done(null, newUser);
  });  
});

passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
        passReqToCallback : true,
      },
      function (req, accessToken, refreshToken, profile, done) {
        console.log(accessToken)
        User.findOne({githubID:profile.id}).then((user)=>{
          if(!user){
            new User({
              githubID:profile.id,
              username: profile.username,
              email: profile["_json"].email,
              gender: profile.gender,
            }).save().then((currUser) => {
              console.log('new user: ' + currUser);
              done(null, currUser);
            })
            .catch((err) => {console.log('error: ' + err)})
          } else {
            console.log('id already exists');
            done(null, user);
          }
        })
      }
    )
  );


  
 