#include <Wire.h>

#define I2C_ADDRESS 0x08

#define ROWS 4
#define COLS 3

// ======================
// Matrix Pins
// ======================

byte rowPins[ROWS] = {2, 3, 4, 5};

byte colPins[COLS] = {8, 9, 10};

// ======================
// Landmark Data
//
// owner
// 0 = empty
// 1 = player1
// 2 = player2
// ======================

byte landmarkOwner[2][3] = {{0, 0, 0}, {0, 0, 0}};

// Battle state

bool battleState[2][3] = {{false, false, false}, {false, false, false}};

// LED Matrix

byte ledState[ROWS][COLS];

// Command

String command = "";

// Blink

bool blinkState = false;

unsigned long blinkTimer = 0;

// ======================
// Receive I2C
// ======================

void receiveEvent(int bytes) {

  command = "";

  while (Wire.available()) {
    command += (char)Wire.read();
  }

  Serial.print("Receive : ");

  Serial.println(command);

  parseCommand();
}

// ======================
// Create LED Matrix
// ======================

void updateMatrix() {

  // clear

  for (int r = 0; r < ROWS; r++) {
    for (int c = 0; c < COLS; c++) {
      ledState[r][c] = 0;
    }
  }

  // Physical mappings for logical indices 0 to 5
  // Index: 0=Mahanakhon, 1=Asiatique, 2=Giant Swing, 3=Wat Arun, 4=Stadium, 5=Townhall
  // RowGroup: 0 = Top rows (0,1), 1 = Bottom rows (2,3)
  const int physRowGroup[6] = {0, 1, 1, 0, 1, 0}; 
  const int physCol[6]      = {1, 1, 0, 0, 2, 2};

  for (int i = 0; i < 6; i++) {
    int logicalR = i / 3;
    int logicalC = i % 3;
    
    int pRowGroup = physRowGroup[i];
    int pCol = physCol[i];
    
    // -----------------
    // Battle
    // -----------------
    if (battleState[logicalR][logicalC]) {
      if (blinkState) {
        // Player1 (Blue)
        ledState[pRowGroup * 2][pCol] = 1;
        // Player2 (Red)
        ledState[(pRowGroup * 2) + 1][pCol] = 1;
      }
    }
    // -----------------
    // Normal Owner
    // -----------------
    else {
      if (landmarkOwner[logicalR][logicalC] == 1) {
        ledState[pRowGroup * 2][pCol] = 1; // Player1
      } else if (landmarkOwner[logicalR][logicalC] == 2) {
        ledState[(pRowGroup * 2) + 1][pCol] = 1; // Player2
      }
    }
  }
}

// ======================
// Parse Command
// ======================

void parseCommand() {
  //---------------------
  // LANDMARK,r,c,player
  //---------------------

  if (command.startsWith("LANDMARK")) {
    int p1 = command.indexOf(',');
    int p2 = command.indexOf(',', p1 + 1);
    int p3 = command.indexOf(',', p2 + 1);

    int r = command.substring(p1 + 1, p2).toInt();
    int c = command.substring(p2 + 1, p3).toInt();
    int player = command.substring(p3 + 1).toInt();

    if (r >= 0 && r < 2 && c >= 0 && c < 3) {
      landmarkOwner[r][c] = player;
      battleState[r][c] = false;
      updateMatrix();

      Serial.print("Capture Landmark [");
      Serial.print(r);
      Serial.print(",");
      Serial.print(c);
      Serial.print("] Owner Player ");
      Serial.println(player);
    }
  }

  //---------------------
  // BATTLE,r,c
  //---------------------

  else if (command.startsWith("BATTLE")) {
    int p1 = command.indexOf(',');
    int p2 = command.indexOf(',', p1 + 1);

    int r = command.substring(p1 + 1, p2).toInt();
    int c = command.substring(p2 + 1).toInt();

    if (r >= 0 && r < 2 && c >= 0 && c < 3) {
      battleState[r][c] = true;
      updateMatrix();

      Serial.print("Battle Start L[");
      Serial.print(r);
      Serial.print(",");
      Serial.print(c);
      Serial.println("]");
    }
  }

  //---------------------
  // SYNC,o0,o1,o2,o3,o4,o5
  //---------------------
  else if (command.startsWith("SYNC")) {
    int p = command.indexOf(',');
    for (int i = 0; i < 6; i++) {
      int nextP = command.indexOf(',', p + 1);
      int owner;
      if (nextP == -1) {
        owner = command.substring(p + 1).toInt();
      } else {
        owner = command.substring(p + 1, nextP).toInt();
      }

      if (owner == 3) {
        battleState[i / 3][i % 3] = true;
      } else {
        landmarkOwner[i / 3][i % 3] = owner;
        battleState[i / 3][i % 3] = false;
      }
      p = nextP;
    }
    updateMatrix();
    Serial.println("SYNC Complete");
  }
}

// ======================
// Blink Controller
// ======================

void updateBlink() {

  if (millis() - blinkTimer > 300) {

    blinkTimer = millis();

    blinkState = !blinkState;

    updateMatrix();
  }
}

// ======================
// Matrix Scan
// ======================

void scanMatrix() {
  for (int r = 0; r < ROWS; r++) {

    // disable rows

    for (int i = 0; i < ROWS; i++) {
      digitalWrite(rowPins[i], LOW);
    }

    digitalWrite(rowPins[r], HIGH);

    for (int c = 0; c < COLS; c++) {
      if (ledState[r][c]) {

        digitalWrite(colPins[c], LOW);

      }

      else {

        digitalWrite(colPins[c], HIGH);
      }
    }

    delay(2);
  }
}

// ======================
// Send Status ESP32
// ======================

void requestEvent() {

  for (int r = 0; r < 2; r++) {
    for (int c = 0; c < 3; c++) {
      Wire.write(landmarkOwner[r][c]);
    }
  }
}

void setup() {

  Serial.begin(115200);

  for (int i = 0; i < ROWS; i++) {

    pinMode(rowPins[i], OUTPUT);
  }

  for (int i = 0; i < COLS; i++) {

    pinMode(colPins[i], OUTPUT);
  }

  updateMatrix();

  Wire.begin(I2C_ADDRESS);

  Wire.onReceive(receiveEvent);

  Wire.onRequest(requestEvent);

  Serial.println("LED Matrix Ready");
}

void loop() {

  updateBlink();

  scanMatrix();
}