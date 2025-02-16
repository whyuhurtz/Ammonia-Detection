#!/usr/bin/env python3
from flask import Flask, request, escape
import requests

app = Flask(__name__)

# Create root endpoint.
# Only accept GET request.
@app.route('/', methods=['GET'])
def root():
	return "<h1>This website is for experiment purpose only.</h1>", 200

# Create endpoint for receive data sensor sended by ESP32.
# Only accept GET request.
@app.route('/sendDataSensor', methods=['GET'])
def send_data_sensor():
  # Get query parameters from client.
  ppm1 = escape(request.args.get("ppm1", "0"))
  ppm2 = escape(request.args.get("ppm2", "0"))

  # URL google app script.
  url: str = f"https://script.google.com/macros/s/AKfycbyh3U4Ot9Yo26UjdX4z3HBwSK7D9kHXf3ajyovZWEkHlf7o02ZS61XCgeiTxXxefK0eOA/exec?action=write&ppm1={ppm1}&ppm2={ppm2}"

  # Send data to google sheet via web app url.
  response = requests.get(url)
  # Set response status code to 200 if success to send data.
  if response.status_code == 200:
    return f"Data {ppm1} and {ppm2} sent to Google Sheet successfully!"
  # Set response status code to 500 if failed to send data.
  else:
    return f"Failed to send data: {response.text}", 500

"""
# Uncomment the code below if you want to run the app locally.
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)
"""