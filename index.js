const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = 4000;
const app = express();

// connect mongodb to our server

mongoose.connect("mongodb://localhost:27017/Sample", 
    {useNewUrlParser : true, useUnifiedTopology : true}
).then(()=>{
    console.log("connect to mongoDb");
}).catch((err) => {
    console.log(err);
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// The express.json() function is a built-in middleware function in Express.
//  It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

// create a productSchema
const productSchema = new mongoose.Schema({
    name : String,
    description : String,
    price: Number,
})

// create a schema model

const Product = new mongoose.model('Product', productSchema);

// create CRUD operations

// 1 create Request - to create a product
app.post('/app/createProuct', async(req, res) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    })

})

// get request - to get all producet

app.get('/app/getProduct', async(req, res)=> {

    const listProducts = await Product.find();
    res.status(200).json({
        success:true,
        listProducts
    }); 

})

// to update a product

app.put('/app/updateProduct/:id', async(req, res) => {
    let previousProduct = await Product.findById(req.params.id);

    
    previousProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        useFindAndModify : true,
        runValidators : true
    })

    res.status(200).json({
        success:true,
        previousProduct
    })
})

// delete product

app.delete('/app/deleteProduct/:id', async(req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(200).json({
            success:true,
            message:"product is not found" 
        })
    }

    await product.remove();

    res.status(200).json({
        success:true,
        message : "product is deleted successfully"
    })

})


app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}/`);
})