// Function to check if the spell checker is initialized
function checkSpellCheckerStatus() {
    // Make a GET request to the '/is_ready' endpoint
    fetch("/is_ready")
        .then(response => response.json())
        .then(data => {
            // If the spell checker is ready
            if (data.ready) {
                // Hide the loading screen
                document.getElementById("loadingScreen").style.display = 'none'; 
                // Show the main content
                document.getElementById("mainContent").style.display = 'block';  
            } else {
                // If not ready, retry after 1 second
                setTimeout(checkSpellCheckerStatus, 1000);  
            }
        })
        .catch(error => console.error('Error:', error));
}

// When the window loads, start checking the spell checker status
window.onload = function() {
    checkSpellCheckerStatus();
};

// Function to check the spelling of a word
function checkSpelling() {
    // Get the word entered by the user and trim any whitespace
    const word = document.getElementById("wordInput").value.trim();
    if (word === "") return; // If the input is empty, do nothing

    // Make a POST request to the '/check_word' endpoint
    fetch("/check_word", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `word=${word}` // Send the word as form data
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById("result");
        // Display the result of the spell check
        if (data.correct) {
            resultDiv.innerHTML = `<p class="correct">'${data.word}' is spelled correctly.</p>`;
        } else {
            resultDiv.innerHTML = `<p class="incorrect">${word}</p><span class="correct"> ➔ ${data.word}</span>`;
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to upload a file and check its spelling
function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]); // Add the selected file to the form data

    // Show the loader while processing the file
    document.getElementById("loader").style.display = "block";
    document.getElementById("fileResult").innerHTML = "";  // Clear any previous results

    // Make a POST request to the '/upload_file' endpoint
    fetch("/upload_file", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById("fileResult");

        // Hide the loader after processing
        document.getElementById("loader").style.display = "none";

        // Display the original and corrected text
        if (data.corrected_text) {
            let correctedText = data.corrected_text;

            resultDiv.innerHTML = `
                <h3>Uploaded File Content</h3>
                <pre>${data.original_text}</pre>
                <h3>Corrected Content</h3>
                <pre>${correctedText}</pre>
            `;
        } else {
            resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Hide the loader if there's an error
        document.getElementById("loader").style.display = "none";
    });
}
