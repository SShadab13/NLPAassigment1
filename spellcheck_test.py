import pandas as pd
import re
from spellchecker import SpellChecker

# Load dataset
def load_corpus(file_path):
    # Load the CSV
    data = pd.read_csv(file_path, encoding='ISO-8859-1')
    data= data.rename(columns={"0": "Class Labels", "a":"Research Paper Text"})
    
    # Extract the 'Research Paper Text' column and concatenate all text
    text = " ".join(data['Research Paper Text'].dropna().tolist())
    
    # Preprocess text (remove non-alphanumeric characters and tokenize)
    text = re.sub(r'[^a-zA-Z\s]', '', text).lower()
    words = text.split()
    return words

# Main application
def main():
    # Load and preprocess the corpus
    corpus_file = "data/alldata_1_for_kaggle.csv"  # Adjust the path to your file
    words = load_corpus(corpus_file)

    # Initialize SpellChecker with the custom corpus
    spell = SpellChecker()
    spell.word_frequency.load_words(words)

    print("Spelling Correction Application")
    print("Enter 'exit' to quit.")

    while True:
        word = input("Enter a word to check: ").strip().lower()
        if word == 'exit':
            break

        if word in spell:
            print(f"'{word}' is spelled correctly.")
        else:
            corrected_word = spell.correction(word)
            print(f"Did you mean '{corrected_word}'?")

if __name__ == "__main__":
    main()
