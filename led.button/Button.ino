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

byte selectedButton = 255;

byte lastButton = 255;

unsigned long lastDebounceTime = 0;

const unsigned long debounceDelay = 50;



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

   int state = digitalRead(buttonPins[i]);


   // INPUT_PULLUP
   // pressed = LOW

   if(state == LOW)
   {

     if(lastButton != i)
     {

       if(millis()-lastDebounceTime > debounceDelay)
       {

         selectedButton = i;


         Serial.print("Button pressed : Landmark ");
         Serial.println(i+1);


         lastDebounceTime = millis();


         lastButton = i;

       }

     }

   }
   else
   {

     // release button
     if(lastButton == i)
     {
       lastButton = 255;
     }

   }

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