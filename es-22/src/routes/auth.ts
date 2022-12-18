import { Router } from "express";
import { passport } from "../lib/middleware/passport";

const router = Router();

router.get("/login", (request, response, next) => {
  if (
    typeof request.query.redirectTo !== "string" ||
    !request.query.redirectTo
  ) {
    response.status(400);
    return next("Missing redirectTo query string parameter");
  }
  //vogliamo che l'utente venga reindirizzato dopo il login
  //@ts-ignore
  request.session.redirectTo = request.query.redirectTo;

  response.redirect("/auth/github/login");
});

router.get(
  "/github/login",
  //passport method authenticate
  passport.authenticate("github", {
    scope: ["user:email"], // "github" significa che uso la github strategy - lo scope è un'opzione che indica quali info dell'utente ci servono
  })
);

//dopo il login
router.get(
  "/github/callback",
  // @ts-ignore
  passport.authenticate("github", {
    failureRedirect: "/auth/github/login", //opzione per far tornare al login se il login è fallito
    keepSessionInfo: true, //opzione per non perdere i session data
  }),
  (request, response) => {
    //@ts-ignore
    if (typeof request.session.redirectTo !== "string") {
      return response.status(500).end(); // end of the request.
    }
    //@ts-ignore
    response.redirect(request.session.redirectTo);
    //se è tutto ok l'utente ormai loggato è reindirizzato a dove era prima.
  }
);

//logout
router.get("/logout", (request, response, next) => {
  if (
    typeof request.query.redirectTo !== "string" ||
    !request.query.redirectTo
  ) {
    response.status(400);
    return next("Missing redirectTo query string parameter");
  }

  const redirectUrl = request.query.redirectTo;
  //logout è un metodo reso disponibile da passport
  request.logout((error) => {
    if (error) {
      return next(error);
    }
    //quando il logout è eseguito correttamente.
    response.redirect(redirectUrl);
  });
});

export default router;

//userò queste routes in app.ts
