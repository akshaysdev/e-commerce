require('dotenv').config();

const express = require('express');
const app = express();

const router = require('./controller/router');
const { assignDeliveryPartnerJob } = require('./helpers/cronJobs');

/* This is a middleware that parses the request body and makes it available in the request object. */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* A function that takes in the express app as a parameter and returns a router object. */
router(app);

/* This is a function that starts the server. */
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Cron job that runs every 10 seconds to assign delivery partners to orders
assignDeliveryPartnerJob.start();
