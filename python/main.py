import logging
import os

from flask import Flask, jsonify, request
from flask_cors import CORS

# from backend.core import run_llm
from backend.wecore import run_llm

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)


@app.route("/ask", methods=["POST"])
def ask():
    app.logger.info(f"Received request: {request.json}")
    data = request.get_json()
    messages = data.get("query")

    if not messages or not isinstance(messages, list) or not messages:
        return jsonify({"error": "No query provided or invalid format"}), 400

    first_message_content = (
        messages[0].get("content") if isinstance(messages[0], dict) else None
    )

    if not first_message_content:
        return jsonify({"error": "Empty or invalid message content"}), 400

    try:
        response = run_llm(first_message_content)
        print(response)
        return jsonify(response)
    except Exception as e:
        app.logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = os.getenv("PORT", 5000)
    app.run(host="0.0.0.0", port=port)
