#include <Arduino.h> // Required for PlatformIO.

#include <WiFi.h>
#include <HTTPClient.h>

const int PIN_SENSOR1 = 21;       // Sensor 1 MQ-135 connect to pin 34.
const int PIN_SENSOR2 = 35;       // Sensor 1 MQ-135 connect to pin 34.
const char* SSID = "Wokwi-GUEST"; // Default SSID in Wokwi.
const char* PASSWORD = "";        // SSID not require a password in Wokwi.
const char* NGROK_URL = "https://3d93-110-137-192-50.ngrok-free.app/sendSensorData"; // Replace with your Ngrok URL.

void setup()
{
  Serial.begin(115200);
  pinMode(PIN_SENSOR1, INPUT);
  pinMode(PIN_SENSOR2, INPUT);

  WiFi.mode(WIFI_STA);
  Serial.println("WiFi mode: WIFI_STA");

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
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
    HTTPClient http;

    String serverPath = String(NGROK_URL) + "?ppm1=" + String(ppmValueSensor1) + "&ppm2=" + String(ppmValueSensor2);
    Serial.print("Connecting to server: ");
    Serial.println(serverPath);

    // Initialize HTTP connection to serverPath.
    http.begin(serverPath);
    // http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);

    // Send HTTP GET request.
    int httpCode = http.GET();
    if (httpCode > 0)
    {
      Serial.print("HTTP GET request success, status code: ");
      Serial.println(httpCode);
    }
    else
    {
      Serial.print("HTTP GET request failed, error code: ");
      Serial.println(httpCode);
    }

    // Get the response payload.
    String payload = http.getString();
    Serial.println("Server response: " + payload); 

    // End the HTTP connection.
    http.end();
  }
  else
  {
    Serial.println("WiFi not connected");
  }

  delay(1000);  // Kirim data setiap 1 detik
}
