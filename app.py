from flask import Flask, request, jsonify, render_template
from spellchecker import SpellChecker
import re
from threading import Thread

# Initialize Flask app
app = Flask(__name__)

# ----------------------
# Global Variables
# ----------------------
spell = None  # SpellChecker instance
is_spell_checker_ready = False  # Readiness flag for spell checker
CLEANED_FILE_PATH = 'data/cleaned_corpus_2.txt'  # Path to preprocessed corpus

# ----------------------
# Load and Preprocess Corpus
# ----------------------

# Load the cleaned corpus from a text file
def load_corpus_from_cleaned_file(cleaned_file_path):
    """
    Loads the preprocessed corpus from a text file and tokenizes it into words.

    Args:
        cleaned_file_path (str): Path to the cleaned corpus file.

    Returns:
        list: List of tokenized words from the corpus.
    """
    with open(cleaned_file_path, 'r') as file:
        text = file.read()
    return re.findall(r'\w+', text)


# Initialize the spell checker with the preprocessed corpus
def initialize_spell_checker(cleaned_file_path):
    """
    Initializes the spell checker using a preprocessed corpus.

    Args:
        cleaned_file_path (str): Path to the cleaned corpus file.
    """
    global spell, is_spell_checker_ready
    print("Loading Words from preprocessed corpus...")
    words = load_corpus_from_cleaned_file(cleaned_file_path)

    print("Initializing Spell Checker...")
    spell = SpellChecker()
    spell.word_frequency.load_words(words)
    is_spell_checker_ready = True  # Signal readiness
    print("Spell Checker Ready!")

# ----------------------
# Flask Routes
# ----------------------

@app.route('/')
def home():
    """
    Serves the main web page (index.html) for the application.

    Returns:
        HTML template: Renders the main page.
    """
    # return render_template('index.html')
    return render_template('index_2.html')



@app.route('/check_word', methods=['POST'])
def check_word():
    """
    Handles spell checking for a single word input sent via HTTP POST requests.

    Request Body:
        {
            "word": "misspeled"
        }

    Returns:
        JSON:
        {
            "word": "misspelled",
            "correct": False
        }
    """
    if not is_spell_checker_ready:
        return jsonify({'error': 'Spell checker is still initializing, please try again later.'})

    # Extract the word from the request
    word = request.form.get('word')
    
    if not word:
        return jsonify({'error': 'No word provided.'})
    
    # Check if the word is correct
    if word in spell:
        return jsonify({'word': word, 'correct': True})
    else:
        corrected_word = spell.correction(word)
        return jsonify({'word': corrected_word, 'correct': False})

@app.route('/upload_file', methods=['POST'])
def upload_file():
    """
    Handles spell checking for uploaded files.

    Request Body:
        File upload with plain text content.

    Returns:
        JSON:
        {
            "original_text": "<original content>",
            "corrected_text": "<corrected content>"
        }
    """
    if not is_spell_checker_ready:
        return jsonify({'error': 'Spell checker is still initializing, please try again later.'})

    # Check if a file is present in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Read the file content
    text = file.read().decode('utf-8')
    original_text = text
    corrected_text = ""

    # Check and correct each word in the text
    for word in text.split():
        if word in spell:
            corrected_text += word + " "
        else:
            corrected_text += f'<span class="highlight">{spell.correction(word)}</span> '

    # Return the original and corrected text as JSON
    return jsonify({'original_text': original_text, 'corrected_text': corrected_text})


@app.route('/is_ready', methods=['GET'])
def is_ready():
    """
    Endpoint to check if the spell checker is ready.
    """
    return jsonify({'ready': is_spell_checker_ready})


# ----------------------
# Main Driver
# ----------------------

if __name__ == '__main__':
    # Start the spell checker initialization in a background thread
    thread = Thread(target=initialize_spell_checker, args=(CLEANED_FILE_PATH,))
    thread.start()
    
    # Run the Flask app in debug mode
    app.run(debug=True)
