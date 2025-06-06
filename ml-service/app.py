from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from api.routes import sentiment_bp
from models.sentiment import SentimentModel

load_dotenv()

app = Flask(__name__)
app.register_blueprint(sentiment_bp, url_prefix='/api')

model = SentimentModel(force_retrain=False)

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "ML service is running"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)