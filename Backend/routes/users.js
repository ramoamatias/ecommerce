import { Router } from "express";
import passport from "passport";


let router = Router();

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("home.ejs");
  }
}
router.get("/login",(req,res)=>{
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/user/errorLogin",
    successRedirect: "/",
  })
);

router.get("/register", (req, res) => {
  res.render("register.ejs"); 
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/user/errorRegister",
    successRedirect: "/",
  })
);

router.get("/errorRegister", (req, res) => {
  res.send("Existe usuario")
  // res.render("pageError.hbs", { message: "error, existing user" }); //CAMBIAR VISTA
});

router.get("/errorLogin", (req, res) => {
  res.send("Credenciales Incorrectas")
  // res.render("pageError.hbs", { message: "error, invalid credentials" }); //CAMBIAR VISTA
});

router.get("/logout", isAuth, (req, res) => {
  const userLogout = req.user.firstName;
  req.logOut(()=> {res.render("logout.ejs", { user: userLogout })});
});

export { router, isAuth };
