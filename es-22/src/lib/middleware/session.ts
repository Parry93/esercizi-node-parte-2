import session from "express-session";

import config from "../../config";

export function initSessionMiddleware() {
  return session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  });
}

// secret encrypts the session cookie that is sent from the api to the browser during a new session
// è bene non lasciare il dato secret in chiaro qui ma inserirlo nel file di configurazione (che fa riferimento a .env = è file gitignore)
