import os
import pandas as pd
import numpy as np

def generate_sentiment_dataset(size=3000):
    """Generate a synthetic dataset for sentiment analysis"""
    print(f"Generating synthetic sentiment dataset with {size} samples...")
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    output_path = os.path.join('data', 'amazon_reviews_large.csv')
    
    # Check if file already exists
    if os.path.exists(output_path):
        print(f"Dataset already exists at {output_path}")
        return output_path
    
    # Generate synthetic reviews with sentiment ratings
    np.random.seed(42)  # For reproducibility
    
    # Create positive sentiment phrases
    positive_phrases = [
        "love this product", "excellent quality", "works great", 
        "highly recommend", "perfect fit", "best purchase", 
        "amazing value", "very satisfied", "exceeded expectations",
        "fantastic product", "great customer service", "very happy with",
        "well designed", "easy to use", "worth every penny"
    ]
    
    # Create negative sentiment phrases
    negative_phrases = [
        "waste of money", "poor quality", "doesn't work", 
        "disappointed with", "broke easily", "would not recommend", 
        "stopped working", "terrible product", "not as described",
        "defective", "not worth the price", "very frustrated",
        "cheaply made", "customer service is terrible", "regret buying"
    ]
    
    # Create neutral sentiment phrases
    neutral_phrases = [
        "it's okay", "average product", "does the job", 
        "as expected", "not bad", "fairly good", 
        "standard quality", "nothing special", "middle of the road",
        "decent", "acceptable", "ordinary product", 
        "reasonable", "satisfactory", "neither good nor bad"
    ]
    
    # Generate data
    reviews = []
    ratings = []
    
    # Generate positive reviews
    for _ in range(size // 3):
        # Combine 1-3 positive phrases with filler text
        num_phrases = np.random.randint(1, 4)
        phrases = np.random.choice(positive_phrases, num_phrases, replace=False)
        review = "I " + " and ".join(phrases) + ". " + "It's exactly what I was looking for."
        reviews.append(review)
        ratings.append(5)  # 5-star rating
    
    # Generate neutral reviews
    for _ in range(size // 3):
        num_phrases = np.random.randint(1, 3)
        phrases = np.random.choice(neutral_phrases, num_phrases, replace=False)
        review = "This product is " + " and ".join(phrases) + ". " + "It works for now."
        reviews.append(review)
        ratings.append(3)  # 3-star rating
    
    # Generate negative reviews
    for _ in range(size // 3):
        num_phrases = np.random.randint(1, 3)
        phrases = np.random.choice(negative_phrases, num_phrases, replace=False)
        review = "I'm " + " and ".join(phrases) + ". " + "I would not buy this again."
        reviews.append(review)
        ratings.append(1)  # 1-star rating
    
    # Create DataFrame
    df = pd.DataFrame({
        'reviews.text': reviews,
        'reviews.rating': ratings
    })
    
    # Shuffle the data
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Save to CSV
    df.to_csv(output_path, index=False)
    print(f"Generated dataset with {len(df)} reviews saved to {output_path}")
    
    return output_path

if __name__ == "__main__":
    generate_sentiment_dataset(3000)  # Generate 3000 samples