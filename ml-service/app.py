from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/api/classify', methods=['POST'])
def classify_sentiment():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "Text is required"}), 400
    
    text = data['text']
    
    sentiment = "positive" if "good" in text.lower() else "negative" if "bad" in text.lower() else "neutral"
    
    return jsonify({
        "sentiment": sentiment,
        "confidence": 0.85
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)