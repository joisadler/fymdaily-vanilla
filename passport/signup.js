import pl from 'passport-local';
import bCrypt from 'bcrypt-nodejs';
import User from '../models/user';

const LocalStrategy = pl.Strategy;

// Generates hash using bCrypt
const createHash = password => bCrypt
  .hashSync(password, bCrypt.genSaltSync(10), null);

export default (passport) => {
  passport.use('signup', new LocalStrategy({
    passReqToCallback: true, // allows us to pass back the entire request to the callback
    usernameField: 'email'
  },
  (req, email, password, done) => {
    const findOrCreateUser = () => {
      // find a user in Mongo with provided email
      User.findOne({ email }, (err, user) => {
        // In case of any error, return using the done method
        if (err) {
          console.log(`Error in SignUp: ${err}`);
          return done(err);
        }
        // already exists
        if (user) {
          console.log(
            `User already exists with username: ${req.body.username}`
          );
          return done(
            null,
            false,
            req.flash('message', 'User with this Email already exists')
          );
        }
        // find a user in Mongo with provided username
        User.findOne({ username: req.body.username }, (er, usr) => {
          if (er) {
            console.log(`Error in SignUp: ${er}`);
            return done(er);
          }
          // already exists
          if (usr) {
            console.log(`User already exists with email: ${email}`);
            return done(
              null,
              false,
              req.flash('message', 'This username is already in use')
            );
          }
          const { confirmPassword } = req.body;
          if (confirmPassword !== password) {
            console.log('Password and confirmation password do not match');
            return done(
              null,
              false,
              req.flash('message', 'Your password and confirmation password do not match')
            );
          }
          // if there is no user with that email and username
          // create the user
          const newUser = new User();
          // set the user's local credentials
          newUser.username = req.body.username;
          newUser.password = createHash(password);
          newUser.email = email;
          // save the user
          newUser.save((error) => {
            if (error) {
              console.log(`Error in Saving user: ${error}`);
              throw error;
            }
            console.log('User Registration succesful');
          });
          return done(null, newUser);
        });
        return null;
      });
    };
    // Delay the execution of findOrCreateUser and execute the method
    // in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));
};
