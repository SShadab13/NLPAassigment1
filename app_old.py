import time
from flask import Flask, request, jsonify
from spellchecker import SpellChecker
import pandas as pd
import re
from threading import Thread
from flask import render_template

app = Flask(__name__)

spell = SpellChecker()
corpus = None
is_spell_checker_ready = False

# Function to load dataset and initialize the spell checker
def load_corpus(file_path):
    global is_spell_checker_ready
    # Load the CSV file using pandas
    data = pd.read_csv(file_path, encoding='ISO-8859-1')
    # Rename columns for better readability
    data = data.rename(columns={"0": "Class Labels", "a": "Research Paper Text"})
    
    # Extract the 'Research Paper Text' column, remove NaN values, and concatenate all text into a single string
    text = " ".join(data['Research Paper Text'].dropna().tolist())
    
    # Preprocess text: remove non-alphanumeric characters and convert to lowercase
    text = re.sub(r'[^a-zA-Z\s]', '', text).lower()
    # Tokenize the text into individual words
    words = text.split()
    return words

# Function to initialize the spell checker
def initialize_spell_checker():
    global is_spell_checker_ready
    corpus_file = "data/alldata_1_for_kaggle.csv"  # Path to the corpus file
    print("Loading Words from training corpus")
    # Load words from the corpus
    words = load_corpus(corpus_file)
    
    print("Initializing Spell Checker")
    # Load words into the spell checker's frequency dictionary
    spell.word_frequency.load_words(words)
    
    # Signal that the spell checker is ready
    is_spell_checker_ready = True
    print(f"Spell Checker Instance: {spell}")

# Route for the home page
@app.route('/')
def home():
    return render_template('index.html')

# Route to check if a word is correct
@app.route("/check_word", methods=["POST"])
def check_word():
    # Get the word from the request
    word = request.form.get('word')
    # Check if the word is correct
    if word in spell:
        return jsonify({'word': word, 'correct': True})
    else:
        # Provide a corrected word if the input word is incorrect
        corrected_word = spell.correction(word)
        return jsonify({'word': corrected_word, 'correct': False})

# Route to handle file uploads and check spelling
@app.route("/upload_file", methods=["POST"])
def upload_file():
    # Check if a file part is present in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    # Check if the user has selected a file
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Read the file content
    text = file.read().decode('utf-8')
    corrected_text = ""
    original_text = text

    # Check and correct each word in the text
    for word in text.split():
        if word in spell:
            corrected_text += word + " "
        else:
            corrected_text += f'<span class="highlight">{spell.correction(word)}</span> '

    # Return the original and corrected text as JSON
    return jsonify({'original_text': original_text, 'corrected_text': corrected_text})

# Route to check if the spell checker is ready
@app.route('/is_ready', methods=['GET'])
def is_ready():
    return jsonify({'ready': is_spell_checker_ready})

if __name__ == '__main__':
    # Start the corpus loading and spell checker initialization in a background thread
    thread = Thread(target=initialize_spell_checker)
    thread.start()
    
    # Run the Flask app in debug mode
    app.run(debug=True)
