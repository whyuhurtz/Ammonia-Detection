import requests

# Sample data.
ppm1=100
ppm2=200

# Google app script url.
url: str = f"https://script.google.com/macros/s/AKfycbyh3U4Ot9Yo26UjdX4z3HBwSK7D9kHXf3ajyovZWEkHlf7o02ZS61XCgeiTxXxefK0eOA/exec?action=write&ppm1={ppm1}&ppm2={ppm2}"

# Send data to google sheet via web app url.
response = requests.get(url)
# Set response status code to 200 if success to send data.
if response.status_code == 200:
  print(f"Data {ppm1} and {ppm2} sent to Google Sheet successfully!")
# Set response status code to 500 if failed to send data.
else:
  print(f"Failed to send data: {response.text}", 500)