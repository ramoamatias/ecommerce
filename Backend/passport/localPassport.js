import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UsersMongoDAO } from "../persistencia/daos/usersMongoDAO.js";

const modelUser = new UsersMongoDAO();

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userDB = await modelUser.getByProps({ email });
      console.log("usuario recuperado en register",userDB);
      if (userDB.length > 0) {
        return done(null, false);
      } else {
        let user = {};
        for (const key in req.body) {
          user[key] = req.body[key];
        }
        const userCreated = await modelUser.createDocument(user);
        console.log(userCreated);
        done(null, userCreated);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userDB = await modelUser.getOne({ email, password });
      if (!userDB) {
        done(null, false);
      }
      done(null, userDB);
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar debe de ir a buscar el id en la base de datos para recupararlo.
passport.deserializeUser(async (id, done) => {
  const userDB = await modelUser.getById(id);
  done(null, userDB);
});
