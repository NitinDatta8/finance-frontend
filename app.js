const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const app = express();
const uri = 'mongodb+srv://admin:admin@signals-output.ctl2i.mongodb.net/';
const dbName = 'final-signals';

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

async function startServer() {
    try {
        console.log('Connecting to MongoDB...');
        const client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);

        app.get('/', async (req, res) => {
            try {
                const collection = db.collection('aggregated_signals');
                const data = await collection.find({}).toArray();
        
                const predictionData = data.filter(item => item.data_type === 'prediction');
                const truthData = data.filter(item => item.data_type === 'truth');
                
                if (data && data.length > 0) {
                    // Render index.ejs and save to public directory as index.html
                    ejs.renderFile(path.join(__dirname, 'views', 'index.ejs'), {
                        predictionData,
                        truthData,
                        error: null
                    }, (err, str) => {
                        if (err) {
                            console.error('Error rendering EJS:', err);
                            return res.status(500).send('Error rendering HTML');
                        }
                        // Save the HTML file to the 'public' folder
                        fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), str);
                        res.send('HTML file generated successfully!');
                    });
                } else {
                    res.render('index', {  
                        predictionData: null,
                        truthData: null,
                        error: 'No data found in the signals collection' 
                    });
                }
            } catch (err) {
                console.error('Error querying MongoDB:', err);
                res.render('index', { 
                    predictionData: null,
                    truthData: null,
                    error: 'Error querying database: ' + err.message 
                });
            }
        });
        
        app.listen(7878, () => {
            console.log('Server started on port 7878');
        });
    } catch (err) {
        console.error('Error starting server:', err);
    }
}

startServer();
