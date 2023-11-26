const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtsController {
  static async showToughts(req, res) {
    res.render("toughts/home");
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Tought,
      plain: true,
    });
    //Checkar se o usuário Existe
    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("toughts/dashboard", { toughts });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);

      req.flash("message", "Pensamento Criado com Sucesso");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static removeTought(req, res) {
    const id = req.body.id;

    Tought.destroy({ where: { id: id }, raw: true })
      .then(() => {
        req.flash("message", "Pensamento removido com sucesso!");
        req.session.save(() => {
          res.redirect("/toughts/dashboard");
        });
      })
      .catch((err) => console.log());
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ where: { id: id } });

    res.render("toughts/edit", { tought });
  }

  static async updateToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
      description: req.body.description,
    };

    await Tought.update(tought, { where: { id: id } })
      .then(() => {
        req.flash("message", "Pensamento atualizado com sucesso!");
        req.session.save(() => {
          res.redirect("/toughts/dashboard");
        });
      })
      .catch((err) => console.log());
  }
};
