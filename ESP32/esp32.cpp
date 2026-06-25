#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ── WiFi ──────────────────────────────────────────────
const char* SSID     = "GuGuGaGa";
const char* PASSWORD = "12345678";

// ── Backend ───────────────────────────────────────────
const char* BACKEND_URL = "http://10.247.77.188:3000/api/ingest";

// ── Serial2 (Calliope → ESP32) ────────────────────────
// Default: RX=GPIO16, TX=GPIO17  — change if needed
#define CAL_RX 16
#define CAL_TX 17
#define CAL_BAUD 9600

// ── Onboard LED ───────────────────────────────────────
#define LED_PIN 2   // most ESP32 dev boards; change to 8 for ESP32-C3/S3

// ── Globals ───────────────────────────────────────────
WiFiClient    wifiClient;
HTTPClient    http;
unsigned long lastWifiCheck = 0;

// ─────────────────────────────────────────────────────
void flashLed(int times, int onMs = 80, int offMs = 80) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(onMs);
    digitalWrite(LED_PIN, LOW);
    if (i < times - 1) delay(offMs);
  }
}

// ─────────────────────────────────────────────────────
void connectWifi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.printf("[WiFi] Connecting to %s", SSID);
  WiFi.begin(SSID, PASSWORD);

  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 30) {
    delay(500);
    Serial.print(".");
    tries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] Connected — IP: %s\n",
                  WiFi.localIP().toString().c_str());
    flashLed(3, 100, 100);   // 3 quick flashes = connected
  } else {
    Serial.println("\n[WiFi] FAILED — will retry");
    flashLed(1, 800);        // 1 long flash = failed
  }
}

// ─────────────────────────────────────────────────────
void postPayload(const char* device_code,
                 const char* nearest_device,
                 int rssi) {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] Skip — no WiFi");
    return;
  }

  // Build JSON
  StaticJsonDocument<128> doc;
  doc["device_code"]    = device_code;
  doc["nearest_device"] = nearest_device;
  doc["rssi"]           = rssi;
  doc["zone_code"]      = nearest_device;   // mirrors RPi logic

  char body[128];
  serializeJson(doc, body, sizeof(body));

  http.begin(BACKEND_URL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(2000);   // 2 s — same as RPi

  unsigned long t0 = millis();
  int code = http.POST(body);
  unsigned long elapsed = millis() - t0;

  if (code > 0) {
    Serial.printf("[HTTP] %d (%lu ms)\n", code, elapsed);
    if (code != 200) {
      Serial.printf("[BACKEND] %s\n", http.getString().c_str());
    }
    flashLed(1, 40);         // tiny blip = success
  } else {
    Serial.printf("[HTTP ERROR] %s\n", http.errorToString(code).c_str());
    flashLed(2, 200, 100);   // 2 medium flashes = HTTP error
  }

  http.end();
}

// ─────────────────────────────────────────────────────
void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  Serial.begin(115200);           // USB debug — open Serial Monitor here
  Serial2.begin(CAL_BAUD, SERIAL_8N1, CAL_RX, CAL_TX);

  Serial.println("\n[BOOT] ESP32 Calliope bridge starting");

  connectWifi();
}

// ─────────────────────────────────────────────────────
void loop() {
  // ── Periodic WiFi watchdog (every 10 s) ─────────────
  if (millis() - lastWifiCheck > 10000) {
    lastWifiCheck = millis();
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WiFi] Reconnecting...");
      connectWifi();
    }
  }

  // ── Read a line from Calliope ─────────────────────
  if (!Serial2.available()) return;

  String line = Serial2.readStringUntil('\n');
  line.trim();
  if (line.length() == 0) return;

  Serial.printf("[SERIAL] %s\n", line.c_str());

  // ── Parse  DEVICE_CODE,NEAREST_DEVICE,RSSI ────────
  int c1 = line.indexOf(',');
  int c2 = line.lastIndexOf(',');

  if (c1 < 0 || c2 <= c1) {
    Serial.printf("[PARSE ERROR] Unexpected format: %s\n", line.c_str());
    return;
  }

  String device_code    = line.substring(0, c1);
  String nearest_device = line.substring(c1 + 1, c2);
  String rssi_str       = line.substring(c2 + 1);

  // Validate RSSI is numeric
  bool valid = rssi_str.length() > 0;
  for (char ch : rssi_str) {
    if (!isdigit(ch) && ch != '-') { valid = false; break; }
  }
  if (!valid) {
    Serial.printf("[PARSE ERROR] Invalid RSSI: %s\n", line.c_str());
    return;
  }

  int rssi = rssi_str.toInt();

  postPayload(device_code.c_str(), nearest_device.c_str(), rssi);
}