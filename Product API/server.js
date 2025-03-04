require('dotenv').config();

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'products.json');
const enteriesPath = path.join(__dirname, 'enteries.json');
const { z } = require('zod');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const API_KEY = process.env.API_KEY;

let numberOfRequestPerUserId = {};
setInterval(() => {
    numberOfRequestPerUserId = {};
}, 1000);

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

//ZOD input validation
const productSchema = z.object({
    name: z.string(),
    category: z.string(),
    // category: z.nullable(z.string()),
    // category: z.optional(z.string()),
    price: z.number()
})

//Rate Limitting using Midleware
const rateLimiter = (req, res, next) => {
    const userId = req.headers["userId"];
    if(!userId){
        return res.status(404).json({
            success: false,
            message: "No User Id Found"
        })
    }

    if(numberOfRequestPerUserId[userId]){
        numberOfRequestPerUserId[userId]++;
        if(numberOfRequestPerUserId[userId] > 5){
            return res.status(404).json({
                success: false,
                message: "Request Limit Exhausted"
            })
        }
    } else {
        numberOfRequestPerUserId[userId] = 1;
    }

    next();
}
app.use(rateLimiter);

//for Request Enteries
app.use(userEnteries);
app.get('/api/enteries', (req, res) => {
    const enteries = getEnteries();

    res.json({
        success: true,
        data: enteries
    });
})

//Error Handling Middleware
app.use(function(err, req, res, next) {
    const statusCode = err.status || 500; 

    return res.status(statusCode).send({
        success: false,
        message: err.message || "Internal Server Error"
    })
})

// 1. Parse JSON body
app.use(express.json());

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
    try {
        productSchema.parse(req.body);
        const { name, category, price } = req.body;
    
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
            data: newProduct
        })
    } catch(error) {
        return res.status(400).json({ error: 'Invalid input.', details: error.errors });
    }
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
    const products = getProducts();
    const productIndex = products.findIndex((product) => product.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    const updatedProduct = req.body;

    try {
        productSchema.parse(updatedProduct);
        products[productIndex] = { id: parseInt(id), ...updatedProduct };
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

        res.json({
            success: true,
            message: "Product updated successfully",
            data: products[productIndex]
        });
    } catch(error) {
        res.status(400).json({ error: 'Invalid input.', details: error.errors });
    }
})

// 7. PATCH /api/products/:id
app.patch('/api/products/:id',userAuthentication, (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const products = getProducts();
    const productIndex = products.findIndex((product) => product.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    // Find the product index
    try {
        // Update the product at the found index
        productSchema.partial().parse(updates);
        products[productIndex] = { ...products[productIndex], ...updates };
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

        res.json({
            success: true,
            message: "Product updated successfully",
            data: products[productIndex]
        });
    } catch (error) {
        return res.status(400).json({ error: 'Invalid input.', details: error.errors });
    }
});

// 8. Listen on port from .env
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})