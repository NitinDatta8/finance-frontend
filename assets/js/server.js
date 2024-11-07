import express from 'express'; // Import express
import bodyParser from 'body-parser'; // Import body-parser
import fetch from 'node-fetch'; // Import node-fetch
import cors from 'cors'; // Import cors

const app = express();
app.use(cors({
    origin: [
        'http://localhost:5500', // Allow local Live Server
        'https://your-github-username.github.io' // Allow your GitHub Pages URL
    ],
    methods: ['GET', 'POST'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));
app.use(bodyParser.json());

app.options('*', cors()); // Allow preflight requests for all routes

const apiKey = process.env.MAILERLITE_API_KEY; // Store this securely in environment variables
const groupId = process.env.MAILERLITE_GROUP_ID; // Store this securely in environment variables

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    const params = {
        email: email,
        groups: [groupId],
        status: "active"
    };

    try {
        const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(params)
        });

        if (response.ok) {
            res.status(200).json({ message: "Subscription successful" });
        } else {
            const errorData = await response.json();
            res.status(400).json({ error: errorData });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
