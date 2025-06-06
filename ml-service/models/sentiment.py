import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib
from utils.text_processor import TextProcessor

class SentimentModel:
    def __init__(self, force_retrain=True):
        self.model_path = os.path.join(os.path.dirname(__file__), 'sentiment_model.pkl')
        self.processor = TextProcessor()
        self.pipeline = None
        
        # Delete existing model file if force_retrain is True
        if force_retrain and os.path.exists(self.model_path):
            print(f"Deleting existing model at {self.model_path}")
            os.remove(self.model_path)
        
        if os.path.exists(self.model_path):
            self.load_model()
        else:
            self.train_model()
    
    def train_model(self):
        print("Training new sentiment model with synthetic Amazon reviews dataset...")
        
        large_data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                                      'data', 'amazon_reviews_large.csv')
        
        # If dataset doesn't exist, create it
        if not os.path.exists(large_data_path):
            try:
                from generate_dataset import generate_sentiment_dataset
                large_data_path = generate_sentiment_dataset(3000)
            except Exception as e:
                print(f"Could not generate dataset: {e}")
        
        if os.path.exists(large_data_path):
            print(f"Loading dataset from {large_data_path}")
            df = pd.read_csv(large_data_path)
            print(f"Dataset loaded with {len(df)} reviews")
            
            # Convert ratings to sentiment labels if needed
            if 'sentiment' not in df.columns and 'reviews.rating' in df.columns:
                df['sentiment'] = df['reviews.rating'].apply(
                    lambda x: 'positive' if x > 3 else ('negative' if x < 3 else 'neutral')
                )
            
            # Handle column name differences
            text_column = 'reviews.text' if 'reviews.text' in df.columns else 'text'
            
            # Filter out reviews with missing text
            df = df.dropna(subset=[text_column])
            
            # Map text column to a consistent name for processing
            df['text'] = df[text_column]
            
            # Balance the dataset by sampling equal amounts from each sentiment
            sentiment_counts = df['sentiment'].value_counts()
            min_samples = min(sentiment_counts)
            
            balanced_df = pd.DataFrame()
            for sentiment in sentiment_counts.index:
                samples = df[df['sentiment'] == sentiment].sample(min_samples, random_state=42)
                balanced_df = pd.concat([balanced_df, samples])
            
            df = balanced_df.reset_index(drop=True)
            
        else:
            # Use mock data if the file doesn't exist
            print(f"Dataset not found at {large_data_path}, using mock data instead")
            # Create mock dataset with improved examples
            data = {
                'text': [
                    "This product is amazing, I love it! Best purchase ever.",
                    "Works well and easy to use, highly recommend.",
                    "Great customer service and quick delivery.",
                    "Not bad but could be better for the price.",
                    "Average product, nothing special about it.",
                    "It's okay I guess, does what it's supposed to.",
                    "Terrible experience with this product, broke after a week.",
                    "Don't waste your money, awful quality and poor design.",
                    "Worst purchase I've ever made, complete disappointment.",
                    "Disappointed with the features, not what was advertised."
                ],
                'sentiment': [
                    'positive', 'positive', 'positive',
                    'neutral', 'neutral', 'neutral',
                    'negative', 'negative', 'negative', 'negative'
                ]
            }
            df = pd.DataFrame(data)
        
        # Preprocess text
        print("Preprocessing text...")
        df['processed_text'] = df['text'].apply(self.processor.preprocess)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            df['processed_text'], df['sentiment'], test_size=0.2, random_state=42
        )
        
        # Create and train pipeline
        print("Training model...")
        self.pipeline = Pipeline([
            ('vectorizer', TfidfVectorizer(max_features=5000)),
            ('classifier', LogisticRegression(C=10, max_iter=1000))
        ])
        
        self.pipeline.fit(X_train, y_train)
        
        # Evaluate
        accuracy = self.pipeline.score(X_test, y_test)
        print(f"Model accuracy: {accuracy:.2f}")
        
        # Save model
        joblib.dump(self.pipeline, self.model_path)
        print(f"Model saved to {self.model_path}")
    
    def load_model(self):
        print("Loading existing sentiment model...")
        self.pipeline = joblib.load(self.model_path)
    
    def predict(self, text):
        processed_text = self.processor.preprocess(text)
        
        if not processed_text:
            return {"sentiment": "neutral", "confidence": 0.5}
        
        # Get prediction and confidence
        sentiment = self.pipeline.predict([processed_text])[0]
        probabilities = self.pipeline.predict_proba([processed_text])[0]
        confidence = float(np.max(probabilities))
        
        return {
            "sentiment": sentiment,
            "confidence": confidence
        }