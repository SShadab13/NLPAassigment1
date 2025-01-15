# NLP Spell Checker Application

This project implements a spell checker using Flask and Python, leveraging a pre-trained spell checking model. The application allows users to check the spelling of individual words or upload a text file for batch correction.

## Setup Instructions

### 1. Upload the Main Corpus

1. Ensure the corpus file is named `alldata_1_for_kaggle.csv`.
2. Upload the corpus file to the folder `data/`.
3. alldata_1_for_kaggle.csv available in this link: https://www.kaggle.com/datasets/falgunipatel19/biomedical-text-publication-classification
4. Also ensure that **main corpus** file `cleaned_corpus.txt` is present in the `data/` folder. 
![Note]: you can go through the `TextCleaning.ipynb` file to se how we cleaned the provide data.

### 2. Create a Virtual Environment

1. Open your terminal or command prompt.
2. Navigate to your project directory.
3. Run the following command to create a virtual environment:
   ```sh
   python3 -m venv venv
   ```

### 3. Activate the Virtual Environment

- On Windows:
  ```sh
  venv\Scripts\activate
  ```

- On macOS and Linux:
  ```sh
  source venv/bin/activate
  ```

### 4. Install Required Libraries

1. Ensure you are in the virtual environment.
2. Install the libraries listed in `requirements.txt`:
   ```sh
   pip install -r requirements.txt
   ```

### 5. Run the Flask Application

1. Ensure the virtual environment is loaded.
2. Run the Flask application using the following command:
   ```sh
   python3 app.py
   ```

### 6. Access the Application

1. Open your web browser.
2. Navigate to the URL: `http://127.0.0.1:5000`.

### 7. Wait for Corpus to Load

1. The application will load the corpus for the spell checker to use.
2. Once loaded, you can test the application.

## Testing the Application

1. To test the upload and spell check functionality, use the sample text file provided.
2. The sample file is located at: `data/sample_file_to_check.txt`.

Upload the sample file through the application interface to see the corrected content.

## Additional Information

### File Structure
- `app.py`: Main Flask application file.
- `data/alldata_1_for_kaggle.csv`: corpus file.
- `data/cleaned_corpus.txt`: main **cleaned** corpus file. 
- `data/sample_file_to_check.txt`: Sample file for testing.
- `requirements.txt`: List of required Python libraries.

### Main Endpoints
- `/`: Home page.
- `/check_word`: API endpoint for single word spell check.
- `/upload_file`: API endpoint for batch spell check through file upload.
- `/is_ready`: API endpoint to check if the spell checker is initialized.

### Technologies Used
- Python
- Flask
- Pandas
- Re (Regular Expressions)
- SpellChecker
- HTML/CSS
- Bootstrap