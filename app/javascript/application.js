const urlInput = document.getElementById("url-input");
const shortenBtn = document.getElementById("shorten-btn");
const shortenedUrlElement = document.getElementById("shortened-url");

// Function to generate a short unique code
function generateCode() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let code = "";

	for (let i = 0; i < 6; i++) {
		code += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return code;
}

shortenBtn.addEventListener("click", async () => {
	const originalUrl = urlInput.value;

	const csrfToken = document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute("content");

	if (originalUrl) {
		try {
			const response = await fetch("/shortened_urls", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Include the CSRF token in the request headers
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({ original_url: originalUrl }),
			});

			if (response.ok) {
				const data = await response.json();
				shortenedUrlElement.textContent = `Shortened URL: ${data.short_url}`;
			} else {
				const error = await response.json();
				const errorMessage = error.error.join("\n");
				alert("Error:\n" + errorMessage);
			}
		} catch (error) {
			console.error("Error:", error);
			alert("An error occurred. Please try again.");
		}
	} else {
		alert("Please enter a valid URL.");
	}
});
