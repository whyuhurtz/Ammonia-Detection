#!/usr/bin/env python3
from flask import Flask, request, escape

import requests

url: str = "https://script.google.com/macros/s/AKfycbyh3U4Ot9Yo26UjdX4z3HBwSK7D9kHXf3ajyovZWEkHlf7o02ZS61XCgeiTxXxefK0eOA/exec?action=write&ppm1=80"

response = requests.get(url)
print("Success") if response.status_code == 200 else print("Failed")
print(response.text)