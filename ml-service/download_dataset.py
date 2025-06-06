import os
import pandas as pd
import requests
import io

def download_amazon_reviews():
    """Download a sample of Amazon reviews for sentiment analysis."""
    
    print("Creating data directory if it doesn't exist")
    os.makedirs('data', exist_ok=True)
    
    output_path = os.path.join('data', 'amazon_reviews.csv')
    
    # If file already exists, skip download
    if os.path.exists(output_path):
        print(f"Dataset already exists at {output_path}")
        return
    
    # URL for a smaller subset of Amazon reviews from GitHub
    url = "https://raw.githubusercontent.com/pmanresa/hotel_reviews_analysis/master/data/amazon_reviews.csv"
    
    print(f"Downloading Amazon reviews dataset from {url}")
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Save the file
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        # Verify the file was downloaded correctly
        df = pd.read_csv(output_path)
        print(f"Dataset downloaded successfully with {len(df)} reviews")
        
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        print("Creating a mock dataset instead")
        
        # Create a mock dataset if download fails
        data = {
            'reviews.text': [
                "This product is amazing, I love it!",
                "Works well and easy to use",
                "Great customer service",
                "Not bad but could be better",
                "Average product, nothing special",
                "It's okay I guess",
                "Terrible experience with this product",
                "Don't waste your money, awful quality",
                "Worst purchase I've ever made",
                "Disappointed with the features"
            ],
            'reviews.rating': [5, 5, 5, 3, 3, 3, 1, 1, 1, 1]
        }
        
        df = pd.DataFrame(data)
        df.to_csv(output_path, index=False)
        print(f"Mock dataset created and saved to {output_path}")

if __name__ == "__main__":
    download_amazon_reviews()