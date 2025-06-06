import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, RegexpTokenizer
from nltk.stem import WordNetLemmatizer

class TextProcessor:
    def __init__(self):
        # Download required NLTK data
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
            nltk.data.find('corpora/wordnet')
        except LookupError:
            nltk.download('punkt')
            nltk.download('stopwords')
            nltk.download('wordnet')
            
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        self.tokenizer = RegexpTokenizer(r'\w+')  # Use RegexpTokenizer as a fallback
    
    def preprocess(self, text):
        if not text:
            return ""
            
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\d+', '', text)
        
        # Use a try-except block to handle tokenization issues
        try:
            tokens = word_tokenize(text)
        except LookupError:
            # Fallback to RegexpTokenizer if word_tokenize fails
            tokens = self.tokenizer.tokenize(text)
            
        filtered_tokens = [self.lemmatizer.lemmatize(w) for w in tokens if w not in self.stop_words]
        
        return " ".join(filtered_tokens)