export const sendLoginView = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const sendRegisterView = async (req, res) => {
    try {
      res.render("register");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

export const forgotPasswordView = async (req, res) => {
    try {
      res.render("forgotPassword");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };


  export const sendResetPasswordView = async (req, res) => {
    try {
      res.render("resetPassword");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
