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



document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById("wordInput");
    const checkButton = document.getElementById("checkButton");

    // Function to check spelling
    const checkSpelling = () => {
        const word = wordInput.value.trim();
        if (word === "") return; // Do nothing for empty input

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
            if (data.correct) {
                resultDiv.innerHTML = `<p class="correct">'${data.word}' is spelled correctly.</p>`;
            } else {
                resultDiv.innerHTML = `<p class="incorrect">${word}</p><span class="correct"> ➔ ${data.word}</span>`;
            }
        })
        .catch(error => console.error('Error:', error));
    };

    // Add event listener for the input field
    wordInput.addEventListener("keydown", (event) => {
        // Check if 'Enter' or 'Space' key is pressed
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault(); // Prevent default action (e.g., adding space)
            checkSpelling();
        }
    });

    // Trigger check spelling on button click
    checkButton.addEventListener("click", checkSpelling);

    // Add focus effect on the input field
    wordInput.addEventListener("focus", () => {
        wordInput.style.outline = "3px solid #00b3bb";
    });

    // Remove focus effect on blur
    wordInput.addEventListener("blur", () => {
        wordInput.style.outline = "none";
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const loadingBar = document.getElementById('loadingBar');
    const fileResult = document.getElementById('fileResult');
    const originalTextArea = document.getElementById('originalText');
    const correctedTextDiv = document.getElementById('correctedText');

    // Hide progress bar initially
    loadingBar.style.display = 'none';

    // Prevent default behaviors for drag-and-drop
    const preventDefaults = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    // Highlight drop area on drag over
    const highlight = () => dropZone.classList.add('highlight');
    const unhighlight = () => dropZone.classList.remove('highlight');

    // Handle dropped files
    const handleDrop = (event) => {
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    // Attach drag-and-drop events
    ['dragenter', 'dragover'].forEach(event => {
        dropZone.addEventListener(event, preventDefaults, false);
        dropZone.addEventListener(event, highlight, false);
    });
    ['dragleave', 'drop'].forEach(event => {
        dropZone.addEventListener(event, preventDefaults, false);
        dropZone.addEventListener(event, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);

    // Handle file input change
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) processFile(file);
    });

    // Process the uploaded file
    const processFile = (file) => {
        if (file.type !== 'text/plain') {
            alert('Please upload a valid .txt file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // Show and animate the progress bar
        loadingBar.style.display = 'block';
        loadingBar.style.width = '0%';
        loadingBar.classList.add('progress-bar-striped', 'progress-bar-animated');
        fileResult.style.display = 'none';

        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 70) {
                progress += 10;
                loadingBar.style.width = `${progress}%`;
            } else {
                clearInterval(interval);
            }
        }, 200); // Simulate gradual progress

        fetch('/upload_file', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // Finalize the progress bar
                loadingBar.style.width = '100%';
                setTimeout(() => {
                    loadingBar.style.display = 'none';
                }, 500);

                // Populate text areas with results
                originalTextArea.value = data.original_text || 'No original text available.';
                correctedTextDiv.innerHTML = data.corrected_text || 'No corrected text available.'; // Use innerHTML here

                // Show the results
                fileResult.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while processing the file.');
                loadingBar.style.display = 'none';
            });
    };
});

