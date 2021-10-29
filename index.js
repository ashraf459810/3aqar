
// const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
var app = require('express')(),
    server = require('http').createServer(app);

    require("dotenv").config();

// //middleware
// app.use(cors());

// app.use(express.json()); // req.body

// //ROUTES//

// //create a todo

// app.post("/todos", async (req, res) => {
//   try {
//     const { description } = req.body;

//     console.log(req.body);
//     const newTodo = await pool.query(
//       "INSERT INTO todos (description) VALUES (?)",

//       [description]
//     );

//     res.json("Todo was added");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//get all states api

app.get("/AllEstates", async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM Estate");
    res.json(todos[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// search api 

app.get("/search/:buy_or_rent/:type/:furshined/:city_id/:hood_id/:bedroom/:price", async (req, res) => {
  
  try {
    
    const todo = await pool.query("SELECT * FROM Estate , cities , hoods WHERE Estate.buyorrent = ? and Estate.price < ? and Estate.type = ? and Estate.furshined = ?  and cities.city_id = Estate.city and Estate.hood = hoods.idhoods  ", [req.params.buy_or_rent,parseInt( req.params.price),req.params.type,req.params.furshined,req.params.city_id,req.params.hood_id,req.params.bedroom]);

    res.json(todo[0]) ;
  } catch (err) {
    console.error(err.message);
  }
});

// get specification for estate api



app.get("/Estate/:id", async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM Estate where idEstate = ?",[req.params.id]);
    res.json(todos[0]);
  } catch (err) {
    console.error(err.message);
  }
});


// sort the Estate according to price or newest 


app.get("/AllEstates/:oderby", async (req, res) => {

  try {
    let todos ;
    if (req.params.oderby == "low_to_hight"){
       todos = await pool.query("SELECT * FROM Estate order by price desc");
    }
    else {
       todos = await pool.query("SELECT * FROM Estate order by price asc");
    }
 
    res.json(todos[0]);
  } catch (err) {
    console.error(err.message);
  }
});



//register api 
app.get("/register/:name/:password/:mobile", async (req, res) => {
  var  name    = req.params.name;
  var password  =req.params.password;
  var mobile  = req.params.mobile;
    try {
      // Get user input
   
      
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await pool.query("SELECT * FROM users where mobile = ? ", [mobile]);
   
  
    if (oldUser[0].length>= 1) {

    
      
       res.status(500).send("User Already Exist. Please Login");
    }

    else {
    
    const token = jwt.sign(
      { name: mobile, password },
   ""+   process.env.JWT_KEY,
      {
        expiresIn: "1000h",
      }
    );
    // save user token
    const the_token = token;
const result =  await pool.query("INSERT INTO users VALUES (?,?,?,?)",[the_token,name,mobile,password])
 



    // return new user
     if (result[0].affectedRows==1){
    res.status(200).json(the_token);
     }
    else   res.status(500).json("not registerd");
 } } catch (err) {
    console.log(err);
  }
});

// login api 
app.get("/login/:mobile/:password", async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM users where mobile = ? and passwrod= ?",[req.params.mobile,req.params.password]);
    if (todos[0].length ==1){
    res.json(todos[0]);}

    else {
      res.json("wrong email or password");
    }


  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updateTodo = await pool.query(
      "UPDATE todos SET description = ? WHERE todo_id = ?",
      [description, id]
    );

    res.json("Todo was updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTodo = await pool.query("DELETE FROM todos WHERE todo_id = ?", [
      id
    ]);

    res.json("Todo was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
