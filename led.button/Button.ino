#include <Wire.h>


#define I2C_ADDRESS 0x09


// =======================
// Button pins
// Landmark 1-6
// =======================

#define BUTTON_COUNT 6


byte buttonPins[BUTTON_COUNT] ={2,3,4,5,6,7};

// =======================
// Button state
// =======================

volatile byte selectedButton = 255;
int lastButtonState[BUTTON_COUNT] = {HIGH, HIGH, HIGH, HIGH, HIGH, HIGH};
int buttonState[BUTTON_COUNT] = {HIGH, HIGH, HIGH, HIGH, HIGH, HIGH};
unsigned long lastDebounceTime[BUTTON_COUNT] = {0, 0, 0, 0, 0, 0};
const unsigned long debounceDelay = 15;


// =======================
// Send data to ESP32
// =======================

void requestEvent()
{
 Wire.write(selectedButton);

 // clear after sending
 selectedButton = 255;
}


// =======================
// Scan buttons
// =======================

void scanButtons()
{
 for(int i=0;i<BUTTON_COUNT;i++)
 {
   int reading = digitalRead(buttonPins[i]);

   // If the switch changed, due to noise or pressing
   if (reading != lastButtonState[i]) {
     lastDebounceTime[i] = millis();
   }

   if ((millis() - lastDebounceTime[i]) > debounceDelay) {
     // Whatever the reading is at, it's been there for longer than the debounce delay,
     // so take it as the actual current state:

     if (reading != buttonState[i]) {
       buttonState[i] = reading;

       // Only register a press if the new debounced state is LOW
       if (buttonState[i] == LOW) {
         selectedButton = i;
         Serial.print("Button pressed : Landmark ");
         Serial.println(i+1);
       }
     }
   }

   lastButtonState[i] = reading;
 }
}



// =======================
// Setup
// =======================

void setup()
{

 Serial.begin(115200);


 for(int i=0;i<BUTTON_COUNT;i++)
 {

   pinMode(buttonPins[i],INPUT_PULLUP);

 }



 Wire.begin(I2C_ADDRESS);


 Wire.onRequest(requestEvent);



 Serial.println("=================");
 Serial.println("Button Arduino Ready");
 Serial.println("I2C Address : 0x09");
 Serial.println("=================");

}



// =======================
// Loop
// =======================

void loop()
{

 scanButtons();

}