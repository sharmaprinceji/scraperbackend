class AuthController {

  googleSuccess(req, res) {
    res.redirect("http://localhost:5173/dashboard");
  }

  googleFailure(req, res) {
    res.redirect("http://localhost:5173/login");
  }

  logout(req, res) {
    req.logout(() => {

      res.redirect("http://localhost:5173");

    });

  }

}

export default new AuthController();