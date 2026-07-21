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
const char *backendUrl = "http://10.121.159.188:3000/api/led/status/raw";
const char *actionUrl = "http://10.121.159.188:3000/api/action";

const unsigned long syncInterval = 1000; // Poll backend every 1 second

// ============================
// FreeRTOS shared resources
// ============================

QueueHandle_t buttonQueue;           // Button presses from Core 1 → Core 0
SemaphoreHandle_t i2cMutex;          // Protect I2C bus (shared by both cores)
String lastState = "";               // Cache to skip redundant I2C syncs


// ============================
// Send SYNC to LED Arduino
// Caller MUST hold i2cMutex
// ============================

void sendSync(String rawState) {
  // Skip if state hasn't changed
  if (rawState == lastState) return;
  lastState = rawState;

  String msg = "SYNC," + rawState;

  Wire.beginTransmission(LED_ARDUINO_ADDRESS);
  Wire.write((uint8_t *)msg.c_str(), msg.length());
  Wire.endTransmission();

  Serial.print("Synced: ");
  Serial.println(msg);
}


// ============================
// HTTP Task (runs on Core 0)
//
// Handles ALL network I/O so
// button reading is never blocked
// ============================

void httpTask(void *param) {
  unsigned long lastSync = millis();

  while (true) {
    // --- 1. Process any pending button press ---
    byte btn;
    if (xQueueReceive(buttonQueue, &btn, 0) == pdTRUE) {
      if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        http.begin(client, actionUrl);
        http.addHeader("Content-Type", "application/json");
        http.setTimeout(2000);

        String json = "{\"button_id\":" + String(btn) + "}";
        int code = http.POST(json);

        if (code == 200) {
          String payload = http.getString();
          if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(50))) {
            sendSync(payload);
            xSemaphoreGive(i2cMutex);
          }
          lastSync = millis(); // Reset poll timer — we just got fresh state
        } else {
          Serial.printf("Action error: %d\n", code);
        }
        http.end();
      }
    }

    // --- 2. Periodic backend poll ---
    if (millis() - lastSync > syncInterval) {
      if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        http.begin(client, backendUrl);
        http.setTimeout(1500);
        int code = http.GET();

        if (code == 200) {
          String payload = http.getString();
          if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(50))) {
            sendSync(payload);
            xSemaphoreGive(i2cMutex);
          }
        } else {
          Serial.printf("Poll error: %d\n", code);
        }
        http.end();
      }
      lastSync = millis();
    }

    vTaskDelay(pdMS_TO_TICKS(10)); // Yield to system
  }
}


// ============================
// SETUP
// ============================

void setup() {
  Serial.begin(115200);
  Wire.begin(SDA_PIN, SCL_PIN);

  // Create shared resources
  buttonQueue = xQueueCreate(8, sizeof(byte));   // Up to 8 queued presses
  i2cMutex = xSemaphoreCreateMutex();

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

  // Launch HTTP task on Core 0 (WiFi/network core)
  xTaskCreatePinnedToCore(
    httpTask,   // Task function
    "HTTP",     // Name
    8192,       // Stack size (bytes)
    NULL,       // Parameter
    1,          // Priority
    NULL,       // Task handle (not needed)
    0           // Core 0
  );

  Serial.println("Ready — button scan on Core 1, HTTP on Core 0");
}


// ============================
// LOOP (runs on Core 1)
//
// Only reads buttons via I2C.
// NEVER blocked by HTTP.
// ============================

void loop() {
  if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(10))) {
    Wire.requestFrom(BUTTON_ARDUINO_ADDRESS, 1);
    if (Wire.available()) {
      byte btn = Wire.read();
      if (btn != 255) {
        Serial.printf("Button %d pressed\n", btn);
        xQueueSend(buttonQueue, &btn, 0); // Non-blocking enqueue
      }
    }
    xSemaphoreGive(i2cMutex);
  }

  delay(5); // Scan ~200 times/sec
}