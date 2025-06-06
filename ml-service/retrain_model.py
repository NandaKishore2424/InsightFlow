import os
from models.sentiment import SentimentModel

# Delete existing model file if it exists
model_path = os.path.join('models', 'sentiment_model.pkl')
if os.path.exists(model_path):
    print(f"Deleting existing model at {model_path}")
    os.remove(model_path)

# Generate new dataset
from generate_dataset import generate_sentiment_dataset
generate_sentiment_dataset(3000)

# Train new model
print("Training new model...")
model = SentimentModel(force_retrain=True)

print("Model training complete. Testing with a sample review...")
result = model.predict("This product is amazing, I love it!")
print(f"Test result: {result}")