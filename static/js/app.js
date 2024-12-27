// const socket = new WebSocket('ws://localhost:5000');

const inputField = document.getElementById('inputField');
const outputField = document.getElementById('outputField');

// // Event listener for WebSocket connection open
// socket.addEventListener('open', () => {
//     console.log('WebSocket connection established');
// });

// // Event listener for WebSocket connection error
// socket.addEventListener('error', (error) => {
//     console.error('WebSocket error:', error);
// });

// // Event listener for text input field
// inputField.addEventListener('input', () => {
//     const text = inputField.value.trim();
//     if (text) {
//         socket.send(text);  // Send text to backend
//     }
// });

// socket.onmessage = (event) => {
//     outputField.innerText = event.data;  // Display corrected word
// };

// Send request to backend when input changes
inputField.addEventListener('input', () => {
    const text = inputField.value.trim();

    if (text) {
        // Use Fetch API for HTTP POST request
        fetch('/spellcheckText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        })
        .then(response => response.json())
        .then(data => {
            outputField.innerText = data.corrected_text; // Update result
        })
        .catch(error => console.error('Error:', error));
    } else {
        outputField.innerText = ''; // Clear output when input is empty
    }
});




console.clear();
('use strict');

(function () {
    'use strict';

    // Prevent default behaviors for drag-and-drop
    const preventDefaults = event => {
        event.preventDefault();
        event.stopPropagation();
    };

    // Highlight drop area on drag
    const highlight = event =>
        event.target.classList.add('highlight');

    // Remove highlight when drag leaves the area
    const unhighlight = event =>
        event.target.classList.remove('highlight');

    // Get references to input, gallery, and other elements
    const getInputAndTextAreas = element => {
        const zone = element.closest('.upload_dropZone') || false;
        const input = zone.querySelector('input[type="file"]') || false;
        const originalTextArea = document.getElementById('originalText');
        const correctedTextArea = document.getElementById('correctedText');
        const loadingBar = document.getElementById('loadingBar');
        return { input, originalTextArea, correctedTextArea, loadingBar };
    };

    // Handle dropped files
    const handleDrop = event => {
        const dataRefs = getInputAndTextAreas(event.target);
        dataRefs.files = event.dataTransfer.files;
        processFiles(dataRefs);
    };

    // Attach event listeners
    const eventHandlers = zone => {
        const dataRefs = getInputAndTextAreas(zone);
        if (!dataRefs.input) return;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, preventDefaults, false);
            document.body.addEventListener(event, preventDefaults, false);
        });

        // Highlight drop area on drag over
        ['dragenter', 'dragover'].forEach(event => {
            zone.addEventListener(event, highlight, false);
        });
        ['dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, unhighlight, false);
        });

        // Handle dropped files
        zone.addEventListener('drop', handleDrop, false);

        // Handle selected files (via button click)
        dataRefs.input.addEventListener(
            'change',
            event => {
                dataRefs.files = event.target.files;
                processFiles(dataRefs);
            },
            false
        );
    };

    // Initialize all drop zones
    const dropZones = document.querySelectorAll('.upload_dropZone');
    for (const zone of dropZones) {
        eventHandlers(zone);
    }

    // Validate file type (accept only .txt files)
    const isTextFile = file => file.type === 'text/plain';

    // Process files (read, upload, and handle response)
    const processFiles = async dataRefs => {
        let files = [...dataRefs.files];

        // Filter invalid files
        files = files.filter(file => {
            if (!isTextFile(file)) {
                alert('Only .txt files are supported.');
            }
            return isTextFile(file);
        });

        if (!files.length) return; // Exit if no valid files

        const file = files[0]; // Only process the first file
        const reader = new FileReader();

        // Show loading animation
        dataRefs.loadingBar.style.width = '0%';
        dataRefs.loadingBar.classList.add('progress-bar-striped', 'progress-bar-animated');

        // Read file content
        reader.onload = async () => {
            const originalText = reader.result;
            dataRefs.originalTextArea.value = originalText; // Show original text

            // Prepare form data for upload
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Send to backend for processing
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json(); // Parse response

                // Display corrected text
                dataRefs.correctedTextArea.value = data.corrected_text;

                // Update loading bar to 100%
                dataRefs.loadingBar.style.width = '100%';
                dataRefs.loadingBar.classList.remove('progress-bar-striped', 'progress-bar-animated');

            } catch (error) {
                console.error('Error processing file:', error);
                alert('An error occurred while processing the file.');
            }
        };

        reader.readAsText(file); // Read the file content
    };
})();
