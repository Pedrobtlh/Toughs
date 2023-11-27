const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    //Validação do Usuário
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Usuário não encontrado!");
      res.render("auth/login");

      return;
    }
    //Validação da Senha
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      req.flash("message", "Senha invalida!");
      res.render("auth/login");

      return;
    }

    const createdUser = await User.create(user);

    //Inicializar a Sessão
    req.session.userid = user.id;

    req.flash("message", "Login feito com Sucesso!");

    req.session.save(() => {
      res.redirect("/");
      return;
    });
  }
  static register(req, res) {
    res.render("auth/register");
  }
  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // validação da senha
    if (password != confirmpassword) {
      //mensagens
      req.flash("message", "As senhas não conferem, tente novamente");
      res.render("auth/register");

      return;
    }

    //validação do email
    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      req.flash("message", "O Email já está em uso");
      res.render("auth/register");

      return;
    }

    //Criação de Senha
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      //Inicializar a Sessão
      req.session.userid = createdUser.id;

      req.flash("message", "Cadastro Realizado com Sucesso!");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      console.log(`Deu o erro ${err}`);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
