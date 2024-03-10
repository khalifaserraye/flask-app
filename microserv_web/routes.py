from flask import request, render_template, make_response, jsonify
from microserv_web import app
import requests

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/suggest', methods=['POST'])
def suggest():
    req = request.get_json()
    url=f"http://127.0.0.1:8008/mun/code/{req.get('code')}"
    res = requests.get(url)
    res = make_response(res.text, 200)
    return res