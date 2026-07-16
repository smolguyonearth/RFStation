#include <HTTPClient.h>
#include <WiFi.h>
#include <Wire.h>

// ============================
// I2C
// ============================

#define SDA_PIN 21
#define SCL_PIN 22
#define LED_ARDUINO_ADDRESS 0x08
#define BUTTON_ARDUINO_ADDRESS 0x09

// ============================
// WiFi & Backend
// ============================

// UPDATE THESE WITH YOUR ACTUAL LOCAL WIFI DETAILS!
const char *ssid = "GuGuGaGa";
const char *password = "12345678";

// UPDATE THIS WITH YOUR BACKEND'S LOCAL IP ADDRESS (e.g. 192.168.1.50)
const char *backendUrl = "http://10.72.220.188:3000/api/led/status/raw";
const char *actionUrl = "http://10.72.220.188:3000/api/action";

unsigned long lastSyncTime = 0;
const unsigned long syncInterval = 1000; // Poll backend every 1 second

// Button tracking
byte button = 255;

// ============================
// Send SYNC
// ============================

void sendSync(String rawState) {
  // rawState comes from backend like "0,1,2,0,0,0"
  String msg = "SYNC," + rawState;

  Wire.beginTransmission(LED_ARDUINO_ADDRESS);
  Wire.write((uint8_t *)msg.c_str(), msg.length());
  Wire.endTransmission();

  Serial.print("Synced to Arduino: ");
  Serial.println(msg);
}

// ============================
// Fetch State from Backend
// ============================

void pollBackend() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(backendUrl);
    int httpResponseCode = http.GET();

    if (httpResponseCode == 200) {
      String payload = http.getString();
      sendSync(payload); // Push the new state directly to the Arduino
    } else {
      Serial.print("Backend error: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }
}

// ============================
// Read Button
// ============================

void readButton() {
  Wire.requestFrom(BUTTON_ARDUINO_ADDRESS, 1);
  if (Wire.available()) {
    button = Wire.read();
    if (button != 255) {

      Serial.print("Button pressed: ");
      Serial.println(button);

      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(actionUrl);
        http.addHeader("Content-Type", "application/json");
        
        String jsonPayload = "{\"button_id\":" + String(button) + "}";
        int httpResponseCode = http.POST(jsonPayload);
        
        if (httpResponseCode == 200) {
          String payload = http.getString();
          sendSync(payload); // Instant update!
        } else {
          Serial.print("Action POST error: ");
          Serial.println(httpResponseCode);
        }
        
        http.end();
      }
    }
  }
}

// ============================
// SETUP
// ============================

void setup() {
  Serial.begin(115200);
  Wire.begin(SDA_PIN, SCL_PIN);

  // Connect to Local WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  // Force an immediate sync on startup
  pollBackend();
}

// ============================
// LOOP
// ============================

void loop() {
  // Periodically fetch the latest state from the backend
  if (millis() - lastSyncTime > syncInterval) {
    pollBackend();
    lastSyncTime = millis();
  }

  readButton();
  delay(50);
}