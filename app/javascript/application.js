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
					Accept: "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({ original_url: originalUrl }),
			});

			if (response.ok) {
				const contentType = response.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					const data = await response.json();
					shortenedUrlElement.textContent = `Shortened URL: ${data.short_url}`;

					// Create a clickable link and set the URL
					const link = document.createElement("a");
					link.href = data.short_url;
					link.textContent = data.short_url;

					// Add a click event listener to copy the link to the clipboard
					link.addEventListener("click", (event) => {
						event.preventDefault();
						copyToClipboard(data.short_url);
						alert("Shortened URL copied to clipboard.");
					});

					// Clear the previous link if it exists
					while (shortenedUrlElement.firstChild) {
						shortenedUrlElement.removeChild(shortenedUrlElement.firstChild);
					}

					// Append the new link
					shortenedUrlElement.appendChild(link);
				} else {
					console.error("Unexpected content type:", contentType);
					alert("An error occurred. Please try again.");
				}
			} else {
				const error = await response.json();
				const errorMessage = Array.isArray(error.error)
					? error.error.join("\n")
					: error.error;
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

function copyToClipboard(text) {
	const textarea = document.createElement("textarea");
	textarea.value = text;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	document.body.removeChild(textarea);
}
