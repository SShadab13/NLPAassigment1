from flask import Flask, request, jsonify, render_template
from spellchecker import SpellChecker
# from flask_socketio import SocketIO
import re

# Initialize Flask app
app = Flask(__name__)

# # Enable WebSocket support with Flask-SocketIO
# socketio = SocketIO(app
#                     ,cors_allowed_origins='*'
#                     # , transports=['websocket']
#                     )

# ----------------------
# Load and Preprocess Corpus
# ----------------------

# Load the cleaned corpus from a text file
with open('data/cleaned_corpus.txt', 'r') as file:
    text_corpus = file.read()

# Preprocess the corpus: Extract words using regex
corpus_words = re.findall(r'\w+', text_corpus)

# Initialize PySpellChecker and load the custom corpus
spell = SpellChecker()
spell.word_frequency.load_words(corpus_words)  # Train the spell checker with preprocessed words


# ----------------------
# WebSocket for Real-time Spell Checking
# ----------------------

# @socketio.on('message')  # WebSocket event listener
# def handle_message(data):
#     """
#     Handles real-time spell checking through WebSocket.
#     Receives a word, processes it, and sends back the corrected word.

#     Args:
#         data (str): The input word from the client-side.
#     """
#     # Perform spell correction
#     corrected_word = spell.correction(data)

#     # Send the corrected word back to the client
#     socketio.send(corrected_word)


# ----------------------
# Routes for Web Pages and API Endpoints
# ----------------------

@app.route('/')
def home():
    """
    Serves the main web page (index.html) for the application.

    Returns:
        HTML template: Renders the main page.
    """
    return render_template('index.html')


@app.route('/spellcheckText', methods=['POST'])
def spellcheckText():
    """
    Handles spell checking for text input sent via HTTP POST requests.

    Request Body (JSON):
        {
            "text": "misspeled"
        }

    Returns:
        JSON:
        {
            "corrected_text": "misspelled"
        }
    """
    # Extract text from JSON request
    data = request.json
    text = data.get('text', '')

    # Perform spell checking and get the corrected word
    corrected_text = spell.correction(text)

    # Return the corrected text in JSON format
    return jsonify({'corrected_text': corrected_text})


# ----------------------
# Start Flask App with WebSocket
# ----------------------

if __name__ == '__main__':
    """
    Runs the Flask application with WebSocket support.
    Debug mode is enabled for development purposes.
    """
    # socketio.run(app, debug=True)
    """
    Start Flask server.
    """
    app.run(debug=True)
