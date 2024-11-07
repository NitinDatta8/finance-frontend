import fetch from 'node-fetch';

export async function handler(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" })
        };
    }

    const { email } = JSON.parse(event.body);

    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_GROUP_ID;

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
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Subscription successful" })
            };
        } else {
            const errorData = await response.json();
            return {
                statusCode: 400,
                body: JSON.stringify({ error: errorData })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        };
    }
}
