// 🐨 you don't need to do anything in this file for the exercise. This is
// just here for the extra credit. See the instructions for more info.


module.exports = function proxy(app) {
    app.get(/\/$/, (req, res) => res.redirect('/discover'))
}
