const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/genreRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const commentRoutes = require('./routes/commentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const imageRoutes = require('./routes/imageRoutes');
const miniImageRoutes = require('./routes/miniImageRoutes');
const { faker } = require('@faker-js/faker');
const Product = require('./models/Product');
const MiniImage = require('./models/MiniImage');

const app = express();
const port = process.env.PORT || 4000;

// MIDDLEWARES
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

// ROUTES
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/genres', genreRoutes);
app.use('/products', productRoutes);
app.use('/ratings', ratingRoutes);
app.use('/comments', commentRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);
app.use('/images', imageRoutes);
app.use('/minis', miniImageRoutes);


// STRIPE CONNECTION
app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(price),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    });
});

mongoose.connect(process.env.MONGODB_URL, (e) => {
    console.log('Successfully connected to database.',e);
});


function generateRandomProduct() {
    // const imageUrl = faker.image.url();
    // const name = faker.commerce.productName();
    // const color = faker.color.human();
    // const sizes = ['S', 'M', 'L', 'XL']; // You can adjust this array as needed
    // const description = faker.lorem.paragraph();
    // const gender = faker.string.fromCharacters(['Male', 'Female', 'Unisex']);
    // const price = faker.number.int({ min: 10, max: 200 }); // You can adjust min and max price
    // return {
    //     imageUrl,
    //     name,
    //     color,
    //     sizes,
    //     description,
    //     gender,
    //     price,
    // };
    return {
        url: faker.image.url()
    }
}

// Generating 10 random products
// const randomProducts = Array.from({ length: 10 }, () => generateRandomProduct());

// randomProducts.forEach(async (data) => {
//     const model = await MiniImage.create({
//         ...data
//     });
//     console.log(model);
// });


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

