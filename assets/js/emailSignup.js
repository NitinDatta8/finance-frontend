// Get the base URL depending on the environment
const baseUrl = window.location.hostname === 'localhost' ? 
    'http://localhost:3000' : 
    'https://sripadaai.netlify.app/.netlify/functions/subscribe'; // Update with your Netlify function URL

// Post email to your server-side endpoint
document.getElementById("signup-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;

    try {
        const response = await fetch(`${baseUrl}`, { // Only the base URL needed
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            document.getElementById("email").value = "";
            alert("Thank you for signing up! We’ll keep you updated.");
        } else {
            alert("There was an error signing you up. Please try again.");
        }
    } catch (error) {
        alert("Something went wrong. Please try again.");
    }
});
