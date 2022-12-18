import config from "../../config";
import passport from "passport";
import passportGitHub2 from "passport-github2";
import { RequestHandler } from "express";

//configurazione della githubstrategy
const githubStrategy = new passportGitHub2.Strategy(
  {
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL,
  },
  function (
    accessToken: string,
    refreshToken: string,
    profile: { [key: string]: string },
    done: (error: null, user: Express.User) => void
  ) {
    const user: Express.User = {
      username: profile.username,
    };

    done(null, user);
  }
);

passport.use(githubStrategy);

//persistent login session, get the user stay logged in - store the user data in the session -
//vedi anche file middleware/session.ts dove è configurata la sessione
passport.serializeUser<Express.User>((user, done) => done(null, user));

passport.deserializeUser<Express.User>((user, done) => done(null, user));

const checkAuthorization: RequestHandler = (request, response, next) => {
  if (request.isAuthenticated()) {
    //isAuthenticated è un metodo da passport
    return next(); // se l'utente è loggato passo al prossimo middleware, che in cities.ts è validate
  }

  response.status(401).end(); // se l'utente non è loggato 401 = not authorized
};

export { passport, checkAuthorization };
