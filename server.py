from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os

app = Flask(__name__, static_folder='.')
CORS(app)

@app.route('/api/buscar')
def buscar():
    q = request.args.get('q','samsung')
    site = request.args.get('site','MLV')
    try:
        r = requests.get(f'https://api.mercadolibre.com/sites/{site}/search?q={q}&limit=20',
            headers={'User-Agent':'StoreForgeAI/1.0'}, timeout=10)
        return jsonify(r.json())
    except Exception as e:
        return jsonify({"results":[], "error":str(e)})

@app.route('/api/item/<item_id>')
def item(item_id):
    try:
        r = requests.get(f'https://api.mercadolibre.com/items/{item_id}',
            headers={'User-Agent':'StoreForgeAI/1.0'}, timeout=10)
        return jsonify(r.json())
    except Exception as e:
        return jsonify({"error":str(e)})

@app.route('/')
def index():
    return send_from_directory('.', 'app.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3000))
    app.run(host='0.0.0.0', port=port)