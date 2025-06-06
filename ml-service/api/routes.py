from flask import Blueprint, request, jsonify

sentiment_bp = Blueprint('sentiment', __name__)

@sentiment_bp.route('/classify', methods=['POST'])
def classify_sentiment():
    from app import model  
    
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({"error": "Text is required"}), 400
    
    text = data['text']
    result = model.predict(text)
    
    return jsonify(result)