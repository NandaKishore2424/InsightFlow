import os
import pandas as pd
from generate_dataset import generate_sentiment_dataset

def get_sentiment_dataset():
    """Get a dataset for sentiment analysis - use generate_dataset instead of downloading"""
    return generate_sentiment_dataset(3000)

if __name__ == "__main__":
    get_sentiment_dataset()