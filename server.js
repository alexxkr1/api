const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mainRoutes = require('./routes/mainRoutes')
const organizationRoutes = require('./routes/organizationRoutes')
const eventRoutes = require('./routes/eventRoutes')
const inviteRoutes = require('./routes/inviteRoutes')
const paymentRoute = require('./routes/paymentRoutes')
const connection = require('../api-service/db');
const usersRoute = require('./routes/usersRoute')

const dotenv = require('dotenv');
const cors = require("cors")

dotenv.config();
const app = express();



app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(cors(
    {
    origin: 'https://master.d1x7vys3fc5yj6.amplifyapp.com',
    headers: {
      "Access-Control-Allow-Origin": "https://master.d1x7vys3fc5yj6.amplifyapp.com",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    }
}
));



  


app.use(eventRoutes, organizationRoutes, inviteRoutes, usersRoute, paymentRoute);

// Add connection to the app object
app.set('mysqlConnection', connection);




const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A sample API'
        }
    },
    apis: ['server.js', 'swagger.yaml']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



port = 3000;
app.listen(port, () => {
    console.log(`API Server is running on port ${port}`)
});


// export the connection
module.exports = { connection };