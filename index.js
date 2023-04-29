const express = require("express");
const cors = require("cors");
require("./db/config");
const user = require("./db/User");
const product = require("./db/Products");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const data = new user(req.body);
  let response = await data.save();
  response = response.toObject();
  delete response.password;
  res.send(response);
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let response = await user.findOne(req.body).select("-password");
    response ? res.send(response) : res.send({ result: "no user found" });
  } else {
    res.send({ result: "no user found" });
  }
});

app.get("/products", async (req,res) => {
    const products =  await product.find();
    if(products.length > 0){
        res.send(products);
    }
    else{
      res.send({result:"data not found"})
    }
    
})

app.post("/addproduct", async (req, res) => {
  const data = new product(req.body);
  let response = await data.save();
  res.send(response);
});

app.delete("/products/:id",async (req,res) => {
  const result =  await product.deleteOne({_id:req.params.id});
  res.send(result);
})

app.get("/products/:id",async (req,res) => {
  const data = await product.findOne({_id:req.params.id});
  if(data){
    res.send(data);
  }
  else{
    res.send({result:"not found"});
  }
})

app.put("/products/:id",async (req,res) => {
  let result = await product.updateOne(
    {_id:req.params.id},{
      $set:req.body
    }
  )
  res.send(result);
});

app.get("/search/:key",async (req,res) => {
  let result = await product.find({
    "$or" : [
      {name: {$regex : req.params.key}},
      {company: {$regex : req.params.key}},
      {category: {$regex : req.params.key}}
    ]
  });
  res.send(result);
})

app.get("/search/:key",async (req,res) =>{
  let result = await product.find({
    "$or":[
      {name:{$regex:req.params.key}},
      {company:{$regex:req.params.key}},
      {category:{$regex:req.params.key}}
    ]
  });
  res.send(result);
})

app.listen(2000, (err) => {
  console.log("listening at 2000");
});
