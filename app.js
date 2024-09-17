const path = require('path');

const express = require('express');

const raizDir = require('./utils/path');

const bodyParser = require('body-parser')

const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario');


const adminRoutes = require('./routes/admin');
const tiendaRoutes = require('./routes/tienda');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(raizDir, 'public')));

app.use((req, res, next) => {
  // Crear un usuario manualmente en MongoAtlas
  Usuario.findById('66e75f6aa5ead9c7ab302d8c')
    .then(usuario => {
      req.usuario = new Usuario(usuario.nombre, usuario.email, usuario.carrito, usuario._id);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(tiendaRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://jcabelloc:secreto@cluster0.dm3fg.mongodb.net/tiendaonline?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(result => {
    console.log(result)
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


