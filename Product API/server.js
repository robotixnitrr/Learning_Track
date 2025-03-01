require('dotenv').config();

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'products.json');
const enteriesPath = path.join(__dirname, 'enteries.json');


const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const API_KEY = process.env.API_KEY;

const getProducts = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

const getEnteries = () => {
    const data = fs.readFileSync(enteriesPath);
    return JSON.parse(data);
}

const userEnteries = (req, res, next) => {
    if(req.path === '/api/enteries'){
        return next();
    }

    const method = req.method;
    const url = req.url;
    const date = new Date().toISOString();

    const enteries = getEnteries();
    enteries.push({
        id: enteries.length + 1,
        method,
        url,
        date
    })
    fs.writeFileSync(enteriesPath, JSON.stringify(enteries, null, 2));
    
    console.log(`[LOG] ${method} ${url} - ${date}`);
    next();
}

const userAuthentication = (req, res,next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Invalid or missing API key.",
        });
    }
    next();
}

// 1. Parse JSON body
app.use(express.json());

//for middleware task
app.use(userEnteries);
app.get('/api/enteries', (req, res) => {
    const enteries = getEnteries();
    
    res.json({
        success: true,
        data: enteries
    });
})

// 2. GET /api/products
app.get('/api/products', (req, res) => {
    const { category } = req.query;
    let filteredProducts = getProducts();

    if(category){
        filteredProducts = filteredProducts.filter((product) => {
            return product.category.toLowerCase() === category.toLowerCase();
        });
    }

    res.json({
        success: true,
        data: filteredProducts
    });
});

// 3. GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const products = getProducts();
    const product = products.find((product) => {
        return product.id === parseInt(id);
    });

    if(!product) {
        return res.status(404).json({
            success: false,
            message: `Product with ID ${id} not found.`,
          });
    }

    res.json({
        success: true,
        data: product
    });
});

// 4. POST /api/products
app.post('/api/products',userAuthentication ,(req, res) => {
    const { name, category, price } = req.body;
    if(!name || !category || !price ){
        res.status(400).json({
            success: false,
            message: "Please provide name, category, and price."
        })
    }
    
    const products = getProducts();
    const newProduct = {
        id: products.length + 1,
        name,
        category,
        price
    };

    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    
    res.status(201).json({
        success: true,
        data: products
    })
})

// 5. DELETE /api/products/:id
app.delete('/api/products/:id',userAuthentication, (req, res) => {
    const { id } = req.params;

    let products = getProducts();
    const productExists = products.some((product) => product.id === parseInt(id));
    
    if (!productExists) {
        return res.status(404).json({ // Changed 400 to 404 for "not found"
            success: false,
            message: "Product not found"
        });
    }

    // Correct way to update the global products array
    products = products.filter((product) => product.id !== parseInt(id));
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    res.json({
        success: true,
        message: "Product deleted successfully",
        data: products
    });
});

// 6. PUT /api/products/:id
app.put('/api/products/:id',userAuthentication, (req, res) => {
    const { id } = req.params;

    const updatedProduct = req.body;

    const products = getProducts();
    const productIndex = products.findIndex((product) => product.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }


    products[productIndex] = { id: parseInt(id), ...updatedProduct };
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    res.json({
        success: true,
        message: "Product updated successfully",
        data: products
    });
})

// 7. PATCH /api/products/:id
app.patch('/api/products/:id',userAuthentication, (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Find the product index
    const products = getProducts();
    const productIndex = products.findIndex((product) => product.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    // Update the product at the found index
    products[productIndex] = { ...products[productIndex], ...updates };
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    res.json({
        success: true,
        message: "Product updated successfully",
        data: products,
    });
});

// 8. Listen on port from .env
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})