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
  Usuario.findById('66e8e9ae442a15f1a5280dad')
    .then(usuario => {
      console.log(usuario)
      req.usuario = usuario;
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
    Usuario.findOne().then(usuario => {
      if (!usuario) {
        const usuario = new Usuario({
          nombre: 'Juan',
          email: 'juan@gmail.com',
          carrito: {
            items: []
          }
        });
        usuario.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });



