const express = require('express');
const bcrypt = require('bcrypt')
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');
const router = express.Router();

//Database password from the .ENV file
const DBPASS = process.env.DBPASSWORD;

//Database connection
const pool = mariadb.createPool({host: '127.0.0.1',port:'3306', user: 'root', database:'explicaapp', password: DBPASS, connectionLimit: 5});




//Route to get the Dynamics prices of the home page/landing page of the web app
  router.get("/getprecos",(req,res,next)=>{
    pool.getConnection()
    .then(conn => {
      conn.query("SELECT Aula, Mensal, Anual FROM precario")
              .then((rows) => {
                conn.end();
                return res.status(200).send(rows);
              }).catch(err =>{
                conn.end();
                return res.status(500).json({
                  code: "500",
                  message: "Conexão à BD falhou!",
                })
            });
          });
  });

  //Route used to update the prices via Admin page
  router.post("/atualizaprecos",(req,res,next)=>{
    Anual= req.body.Anual;
    Mensal= req.body.Mensal;
    Aula= req.body.Aula;

    pool.getConnection()
    .then(conn => {
      conn.query("UPDATE precario SET Anual = '"+Anual+"', Mensal = '"+Mensal+"', Aula = '"+Aula+"'")
              .then((rows) => {
                conn.end();
                return res.status(200).json({
                  code: "200",
                  message: "Preçário atualizado",
                });
              }).catch(err =>{
                conn.end();
                return res.status(500).json({
                  code: "500",
                  message: "Conexão à BD falhou!",
                })
            });
          });
  });




module.exports = router;
