#include <HTTPClient.h>
#include <WiFi.h>

const char *ssid = "Station_ESP32s";
const char *password = "12345678";

// Change this to your computer's IP address
const char *server_host = "192.168.4.4";
const uint16_t server_port = 3000;

HardwareSerial ArduinoUART(2);

void setup() {

  Serial.begin(115200);

  // UART2
  // RX = GPIO16
  // TX = GPIO17
  ArduinoUART.begin(9600, SERIAL_8N1, 16, 17);

  Serial.println();
  Serial.println("Connecting WiFi...");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {

  if (ArduinoUART.available()) {

    String msg = ArduinoUART.readStringUntil('\n');
    msg.trim();

    if (msg.length() > 0) {
      Serial.print("Calliope: ");
      Serial.println(msg);

      if (WiFi.status() == WL_CONNECTED) {
        int firstComma = msg.indexOf(',');
        int secondComma = msg.indexOf(',', firstComma + 1);

        if (firstComma > 0 && secondComma > 0) {
          String device_code = msg.substring(0, firstComma);
          String nearest_device = msg.substring(firstComma + 1, secondComma);
          String rssi_str = msg.substring(secondComma + 1);

          // Backend logic expects "X" for no nearest device
          if (nearest_device == "NONE") {
            nearest_device = "X";
          }

          String jsonPayload = "{\"device_code\":\"" + device_code +
                               "\",\"nearest_device\":\"" + nearest_device +
                               "\",\"rssi\":" + rssi_str + "}";

          HTTPClient http;
          String url = "http://" + String(server_host) + ":" +
                       String(server_port) + "/api/ingest";
          http.begin(url);
          http.addHeader("Content-Type", "application/json");

          int httpResponseCode = http.POST(jsonPayload);

          if (httpResponseCode > 0) {
            Serial.print("HTTP Response: ");
            Serial.println(httpResponseCode);
          } else {
            Serial.print("HTTP Error: ");
            Serial.println(http.errorToString(httpResponseCode).c_str());
          }
          http.end();
        } else {
          Serial.println("Invalid message format format, expected: P1,A,-65");
        }
      }
    }
  }
}
