#include <Arduino.h> // Required for PlatformIO.

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClient.h>

WiFiClient client;
HTTPClient http;

const int PIN_SENSOR1 = 34;       // Sensor 1 MQ-135 connect to pin 34.
const int PIN_SENSOR2 = 35;       // Sensor 1 MQ-135 connect to pin 34.
const char* SSID = "Wokwi-GUEST"; // Default SSID in Wokwi.
const char* PASSWORD = "";        // SSID not require a password in Wokwi.
const char* FLASK_SERVER_URL = "http://whyuhurtz.pythonanywhere.com/sendDataSensor"; // Replace with your PythonAnywhere/Ngrok URL. Don't use HTTPS!.

void setup()
{
  Serial.begin(115200);
  pinMode(PIN_SENSOR1, INPUT);
  pinMode(PIN_SENSOR2, INPUT);

  WiFi.mode(WIFI_STA);
  Serial.println("WiFi mode: WIFI_STA");

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("WiFi status: ");
  Serial.println(WiFi.status());
}

void loop()
{
  int ppmValueSensor1 = analogRead(PIN_SENSOR1) / 4.095;
  int ppmValueSensor2 = analogRead(PIN_SENSOR2) / 4.095;

  Serial.print("PPM value sensor 1: ");
  Serial.println(ppmValueSensor1);
  Serial.print("PPM value sensor 2: ");
  Serial.println(ppmValueSensor2);

  if (WiFi.status() == WL_CONNECTED)
  {
    String serverPath = String(FLASK_SERVER_URL) + "?ppm1=" + String(ppmValueSensor1) + "&ppm2=" + String(ppmValueSensor2);
    Serial.print("Sending HTTP GET request to Flask server: ");
    Serial.println(serverPath);
    
    // Initialize HTTP connection to serverPath.
    http.begin(client, serverPath);
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);

    // Send HTTP GET request.
    int httpCode = http.GET();

    // Get the response payload.
    String payload = http.getString();
    if (payload.length() > 0)
      Serial.println(payload);

    // End the HTTP connection.
    http.end();
  }
  else
  {
    Serial.println("WiFi not connected");
  }

  delay(1000);  // Send data every 1s.
}
