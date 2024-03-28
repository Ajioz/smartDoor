//*****************************************************************************//
//  Name          : Electronic Door Lock                                       //
//  Author        : Turyn                                                      //
//  Modified      : Ajiroghene Sunday                                          //
//  Version       : 2.0                                                        // 
//  Notes         : An electronic door lock using a matrix keypad and lcd      //
//                : display that controls an electric door strike              //           
//*****************************************************************************//

#ifndef KEY_H
#define KEY_H

// Arduino versioning.
#if defined(ARDUINO) && ARDUINO >= 100
#include "Arduino.h"  // for digitalRead, digitalWrite, etc
#else
#include "WProgram.h"
#endif

#define OPEN LOW
#define CLOSED HIGH

typedef unsigned int uint;
typedef enum{ IDLE, PRESSED, HOLD, RELEASED } KeyState;

const char NO_KEY = '\0';

class Key {
public:
  // members
  char kchar;
  int kcode;
  KeyState kstate;
  boolean stateChanged;

  // methods
  Key();
  Key(char userKeyChar);
  void key_update(char userKeyChar, KeyState userState, boolean userStatus);

private:

};

#endif

// default constructor
Key::Key() {
  kchar = NO_KEY;
  kstate = IDLE;
  stateChanged = false;
}

// constructor
Key::Key(char userKeyChar) {
  kchar = userKeyChar;
  kcode = -1;
  kstate = IDLE;
  stateChanged = false;
}


void Key::key_update (char userKeyChar, KeyState userState, boolean userStatus) {
  kchar = userKeyChar;
  kstate = userState;
  stateChanged = userStatus;
}

#ifndef KEYPAD_H
#define KEYPAD_H

//#include "utility/Key.h"

// Arduino versioning.
#if defined(ARDUINO) && ARDUINO >= 100
#include "Arduino.h"
#else
#include "WProgram.h"
#endif

// bperrybap - Thanks for a well reasoned argument and the following macro(s).
// See http://arduino.cc/forum/index.php/topic,142041.msg1069480.html#msg1069480
#ifndef INPUT_PULLUP
#warning "Using  pinMode() INPUT_PULLUP AVR emulation"
#define INPUT_PULLUP 0x2
#define pinMode(_pin, _mode) _mypinMode(_pin, _mode)
#define _mypinMode(_pin, _mode)  \
do {               \
  if(_mode == INPUT_PULLUP)  \
    pinMode(_pin, INPUT);  \
    digitalWrite(_pin, 1);   \
  if(_mode != INPUT_PULLUP)  \
    pinMode(_pin, _mode);  \
}while(0)
#endif


#define OPEN LOW
#define CLOSED HIGH

typedef char KeypadEvent;
typedef unsigned int uint;
typedef unsigned long ulong;

// Made changes according to this post http://arduino.cc/forum/index.php?topic=58337.0
// by Nick Gammon. Thanks for the input Nick. It actually saved 78 bytes for me. :)
typedef struct {
    byte rows;
    byte columns;
} KeypadSize;

#define LIST_MAX 10   // Max number of keys on the active list.
#define MAPSIZE 10    // MAPSIZE is the number of rows (times 16 columns)
#define makeKeymap(x) ((char*)x)


//class Keypad : public Key, public HAL_obj {
class Keypad : public Key {
public:

  Keypad(char *userKeymap, byte *row, byte *col, byte numRows, byte numCols);

  virtual void pin_mode(byte pinNum, byte mode) { pinMode(pinNum, mode); }
  virtual void pin_write(byte pinNum, boolean level) { digitalWrite(pinNum, level); }
  virtual int  pin_read(byte pinNum) { return digitalRead(pinNum); }

  uint bitMap[MAPSIZE]; // 10 row x 16 column array of bits. Except Due which has 32 columns.
  Key key[LIST_MAX];
  unsigned long holdTimer;

  char getKey();
  bool getKeys();
  KeyState getState();
  void begin(char *userKeymap);
  bool isPressed(char keyChar);
  void setDebounceTime(uint);
  void setHoldTime(uint);
  void addEventListener(void (*listener)(char));
  int findInList(char keyChar);
  int findInList(int keyCode);
  char waitForKey();
  bool keyStateChanged();
  byte numKeys();

private:
  unsigned long startTime;
  char *keymap;
    byte *rowPins;
    byte *columnPins;
  KeypadSize sizeKpd;
  uint debounceTime;
  uint holdTime;
  bool single_key;

  void scanKeys();
  bool updateList();
  void nextKeyState(byte n, boolean button);
  void transitionTo(byte n, KeyState nextState);
  void (*keypadEventListener)(char);
};

#endif


// <<constructor>> Allows custom keymap, pin configuration, and keypad sizes.
Keypad::Keypad(char *userKeymap, byte *row, byte *col, byte numRows, byte numCols) {
  rowPins = row;
  columnPins = col;
  sizeKpd.rows = numRows;
  sizeKpd.columns = numCols;

  begin(userKeymap);

  setDebounceTime(10);
  setHoldTime(500);
  keypadEventListener = 0;

  startTime = 0;
  single_key = false;
}

// Let the user define a keymap - assume the same row/column count as defined in constructor
void Keypad::begin(char *userKeymap) {
    keymap = userKeymap;
}

// Returns a single key only. Retained for backwards compatibility.
char Keypad::getKey() {
  single_key = true;

  if (getKeys() && key[0].stateChanged && (key[0].kstate==PRESSED))
    return key[0].kchar;
  
  single_key = false;

  return NO_KEY;
}

// Populate the key list.
bool Keypad::getKeys() {
  bool keyActivity = false;

  // Limit how often the keypad is scanned. This makes the loop() run 10 times as fast.
  if ( (millis()-startTime)>debounceTime ) {
    scanKeys();
    keyActivity = updateList();
    startTime = millis();
  }

  return keyActivity;
}

// Private : Hardware scan
void Keypad::scanKeys() {
  // Re-intialize the row pins. Allows sharing these pins with other hardware.
  for (byte r=0; r<sizeKpd.rows; r++) {
    pin_mode(rowPins[r],INPUT_PULLUP);
  }

  // bitMap stores ALL the keys that are being pressed.
  for (byte c=0; c<sizeKpd.columns; c++) {
    pin_mode(columnPins[c],OUTPUT);
    pin_write(columnPins[c], LOW);  // Begin column pulse output.
    for (byte r=0; r<sizeKpd.rows; r++) {
      bitWrite(bitMap[r], c, !pin_read(rowPins[r]));  // keypress is active low so invert to high.
    }
    // Set pin to high impedance input. Effectively ends column pulse.
    pin_write(columnPins[c],HIGH);
    pin_mode(columnPins[c],INPUT);
  }
}

// Manage the list without rearranging the keys. Returns true if any keys on the list changed state.
bool Keypad::updateList() {

  bool anyActivity = false;

  // Delete any IDLE keys
  for (byte i=0; i<LIST_MAX; i++) {
    if (key[i].kstate==IDLE) {
      key[i].kchar = NO_KEY;
      key[i].kcode = -1;
      key[i].stateChanged = false;
    }
  }

  // Add new keys to empty slots in the key list.
  for (byte r=0; r<sizeKpd.rows; r++) {
    for (byte c=0; c<sizeKpd.columns; c++) {
      boolean button = bitRead(bitMap[r],c);
      char keyChar = keymap[r * sizeKpd.columns + c];
      int keyCode = r * sizeKpd.columns + c;
      int idx = findInList (keyCode);
      // Key is already on the list so set its next state.
      if (idx > -1) {
        nextKeyState(idx, button);
      }
      // Key is NOT on the list so add it.
      if ((idx == -1) && button) {
        for (byte i=0; i<LIST_MAX; i++) {
          if (key[i].kchar==NO_KEY) {   // Find an empty slot or don't add key to list.
            key[i].kchar = keyChar;
            key[i].kcode = keyCode;
            key[i].kstate = IDLE;   // Keys NOT on the list have an initial state of IDLE.
            nextKeyState (i, button);
            break;  // Don't fill all the empty slots with the same key.
          }
        }
      }
    }
  }

  // Report if the user changed the state of any key.
  for (byte i=0; i<LIST_MAX; i++) {
    if (key[i].stateChanged) anyActivity = true;
  }

  return anyActivity;
}

// Private
// This function is a state machine but is also used for debouncing the keys.
void Keypad::nextKeyState(byte idx, boolean button) {
  key[idx].stateChanged = false;

  switch (key[idx].kstate) {
    case IDLE:
      if (button==CLOSED) {
        transitionTo (idx, PRESSED);
        holdTimer = millis(); }   // Get ready for next HOLD state.
      break;
    case PRESSED:
      if ((millis()-holdTimer)>holdTime)  // Waiting for a key HOLD...
        transitionTo (idx, HOLD);
      else if (button==OPEN)        // or for a key to be RELEASED.
        transitionTo (idx, RELEASED);
      break;
    case HOLD:
      if (button==OPEN)
        transitionTo (idx, RELEASED);
      break;
    case RELEASED:
      transitionTo (idx, IDLE);
      break;
  }
}

// New in 2.1
bool Keypad::isPressed(char keyChar) {
  for (byte i=0; i<LIST_MAX; i++) {
    if ( key[i].kchar == keyChar ) {
      if ( (key[i].kstate == PRESSED) && key[i].stateChanged )
        return true;
    }
  }
  return false; // Not pressed.
}

// Search by character for a key in the list of active keys.
// Returns -1 if not found or the index into the list of active keys.
int Keypad::findInList (char keyChar) {
  for (byte i=0; i<LIST_MAX; i++) {
    if (key[i].kchar == keyChar) {
      return i;
    }
  }
  return -1;
}

// Search by code for a key in the list of active keys.
// Returns -1 if not found or the index into the list of active keys.
int Keypad::findInList (int keyCode) {
  for (byte i=0; i<LIST_MAX; i++) {
    if (key[i].kcode == keyCode) {
      return i;
    }
  }
  return -1;
}

// New in 2.0
char Keypad::waitForKey() {
  char waitKey = NO_KEY;
  while( (waitKey = getKey()) == NO_KEY );  // Block everything while waiting for a keypress.
  return waitKey;
}

// Backwards compatibility function.
KeyState Keypad::getState() {
  return key[0].kstate;
}

// The end user can test for any changes in state before deciding
// if any variables, etc. needs to be updated in their code.
bool Keypad::keyStateChanged() {
  return key[0].stateChanged;
}

// The number of keys on the key list, key[LIST_MAX], equals the number
// of bytes in the key list divided by the number of bytes in a Key object.
byte Keypad::numKeys() {
  return sizeof(key)/sizeof(Key);
}

// Minimum debounceTime is 1 mS. Any lower *will* slow down the loop().
void Keypad::setDebounceTime(uint debounce) {
  debounce<1 ? debounceTime=1 : debounceTime=debounce;
}

void Keypad::setHoldTime(uint hold) {
    holdTime = hold;
}

void Keypad::addEventListener(void (*listener)(char)){
  keypadEventListener = listener;
}

void Keypad::transitionTo(byte idx, KeyState nextState) {
  key[idx].kstate = nextState;
  key[idx].stateChanged = true;

  // Sketch used the getKey() function.
  // Calls keypadEventListener only when the first key in slot 0 changes state.
  if (single_key)  {
      if ( (keypadEventListener!=NULL) && (idx==0) )  {
      keypadEventListener(key[0].kchar);
    }
  }
  // Sketch used the getKeys() function.
  // Calls keypadEventListener on any key that changes state.
  else {
      if (keypadEventListener!=NULL)  {
      keypadEventListener(key[idx].kchar);
    }
  }
}

// Adding the necessary libraries to operate the keypad,lcd and Fingerprint sensor--//

#include <Adafruit_Fingerprint.h>
//#include <Keypad.h>     
#include <LiquidCrystal.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>

//include definitions for The LED pins--------------------------------------//

#define button 2
#define redPin 3


SoftwareSerial mySerial(10,9);      // pin #10 is IN from sensor (GREEN wire) and pin #9 is OUT from arduino (WHITE wire)
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

                            
LiquidCrystal lcd(8, 11, 7, 6, 5, 4); // initialize the LCD library with the numbers of the interface pins

//initialize variables
int getFingerprintIDez();
int cursorColumn = 0;       //this controls the cursor postition
int menu = 0;               //this controls the menu settings 
int n=0;                    // variable used to point to the bits in the keypad input array
int addr=0;
char pswrdElement=0;
int check=0;
int block=0;

uint8_t id;

char password[4];           //={a,b,c,d}; //initializing an array called password with variables a,b,c,d that hold the password digits
byte value[4];

char input[4];              // an array that will contain the digits that are input
const byte ROWS = 4;        // Four rows
const byte COLS = 4;        // Four columns

// Define the Keymap
char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};

// Connect keypad ROW0, ROW1, ROW2 and ROW3 to these Arduino pins.
byte rowPins[ROWS] = { 15, 14, 13, 12 };

// Connect keypad COL0, COL1,COL2 and COL3 to these Arduino pins.
byte colPins[COLS] = { 19, 18, 17, 16 }; 


// Create the Keypad
Keypad kpd = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );


void setup()
{
  finger.begin(57600);                                                            // set the data rate for the sensor serial port
  lcd.begin(16, 2);                                                               // set up the LCD's number of columns and rows:
  Serial.begin(9600);
  pinMode(button, INPUT);
  pinMode(redPin,OUTPUT);                                                         //set the pin used for the red and green LED's as outputs
  digitalWrite(redPin,LOW);                                                      // intially activate the Red LED to indicate that the door is locked  
  
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }
  //button Code - If the Button is Pressed while setup run (powered on) it programs into the fingerprint memory
  //programMode();
  finger.getTemplateCount();
  Serial.print("Total Finger contained "); 
  Serial.print(finger.templateCount); 
  Serial.println(" templates");  
  
  if(EEPROM.read(10) != 125){                                                     // EEPROM address 1 should hold smart number which is '125'
      for(int w=0;w<4;w++){
        EEPROM.update(w, '0');
      }
      Serial.print("Previous Pin is:  "); 
      lcd.print("Previous Pin Is:");                                              // Prints a message to the LCD.
      eeRead(); 
      EEPROM.write(10, 125);                                                      // Write to EEPROM we defined Master Card.
      delay(500);
  }else{
    Serial.print("Previous Pin is:  "); 
    lcd.print("Previous Pin Is:");                                                // Prints a message to the LCD.
    eeRead(); 
  }
  Serial.println(""); 
  lcd.print("Tap A/B to Begin");                                                  // Prints a message to the LCD.
  Serial.println("Tap A/B to Begin");
}

uint8_t readnumber(void) {
  uint8_t num = 0;
  
  while (num == 0) {
    while (! Serial.available());
    num = Serial.parseInt();
  }
  return num;
}

void loop()
{
  readKeypad();
  //programMode();                                                                   // Handles the Keypad object and switch case to read the inputs and decides the output state and leds based on the input    
} 


void askForCode(){
  lcd.print("Enter the code");  //prints when the user wants to enter the code
}

void readKeypad(){
  char key = kpd.getKey();
  lcd.setCursor(cursorColumn,1);          // set the cursor to column "cursorColumn", line 1
  if(key)                      // Check for a valid key.
  {
    switch (key)
    {
      case '0':                                 // Each case is a button that is pressed
        if(menu == 1){                          // the value of "menu" determines the setting parameter and what each button does in that setting  
          lcd.print('0');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('0');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('0');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        break;
        
      case '1':
        if(menu == 1){
        lcd.print('1');
        Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('1');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('1');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        break;
        
      case '2':
        if(menu == 1){
          lcd.print('2');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('2');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('2');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        break;
        
      case '3':
        if(menu == 1){
          lcd.print('3');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('3');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        } 
        else if(menu == 4){
          lcd.print('3');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        }
        break;
        
      case '4':
        if(menu == 1){
          lcd.print('4');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('4');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('4');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        break;
        
      case '5':
        if(menu == 1){
          lcd.print('5');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('5');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('5');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        break;
        
      case '6':
        if(menu == 1){
          lcd.print('6');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('6');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('6');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        break;
        
      case '8':
        if(menu == 1){
          lcd.print('8');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('8');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('8');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        break;
        
      case '9':
        if(menu == 1){
          lcd.print('9');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('9');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('9');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        break;  
         
      case '7':
        if(menu == 1){
          lcd.print('7');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('7');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('7');
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        } 
        break;
          
      case 'A':
        if(menu == 0){
          lcd.setCursor(0,0);
          askForCode();
          lcd.setCursor(0,1);
          menu=menu+1;
        }
        break;
        
      case 'B':
        if(menu == 0){
          lcd.setCursor(0,0);
          lcd.print("Change Code?");
          lcd.setCursor(0,1);
          menu=menu+2;
        }
        break;
        
       case 'C':
        check=0;
        Serial.println("Format Cancelled!");
        delay(2000);
        reset();
        break; 
          
      case 'D':
        reset();
        break;
        
        case '#':
        if(!check){
          Serial.println("Format?");delay(5000);
          Serial.println("Tap # again or C to Cancel");
          check++;
        }else{
          keyPadReset();check=0;
        }       
        break; 
        
      case '*':
        if(menu == 2){
          lcd.setCursor(0,0);
          lcd.print("Enter old code");
          lcd.setCursor(0,1);
          menu=menu+1;
        }  
      default:
       return; 
    }
  } 
  if(menu==1 && n > 3){                             //If the menu is in setting 1 and the input array has been filled with 4 digits then...
    doorlockCheck();                                //calls the function to check whether the code that was input matches the code that is stored
  }
  else if(menu==3 && n > 3){
    oldCodeCheck();  
  }
  else if(menu==4 && n > 3){
  changeToNewCode(password,input);
  delay(250);
  eeWrite(password);eeRead(); 
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Code Changed");
  delay(1000);
  reset();
  }
  if(checkCode(password,input) == true){
    getFingerprintIDez();
    delay(50);
  }
}


boolean checkCode(char *a,char *b){                   //The function to check whether the contents of the first parameter,an array, match the 
  int p;                                              //match the contents of the second parameter, also an array.
  for(p=0; p<4; p++) 
    if(a[p]!=b[p]) return false;
    return true;
}

int changeToNewCode(char *a, char *b){
  int p = 0;
  for(p=0; p<4; p++){
    a[p]=b[p];
  } 
  n=0;
}

int doorlockCheck(){
  if(n > 3){
   if(checkCode(password,input) == true){
     delay(250);
     lcd.clear();
     lcd.setCursor(0,0);
     lcd.print("Correct!"); 
     block=0;resetAgain();
     fingerCheck(); 
   }
  else{
   delay(250);
   lcd.clear();
   lcd.setCursor(0,0);
   lcd.print("Invalid Code!"); 
   block++; 
   delay(2000);
   if(block<3){
       reset();
   }else{
       Serial.println("You've been blocked"); 
       while(block==3){
        
       }
   }
    }  
   cursorColumn=0;
   n=0;
  }
}

int oldCodeCheck(){
  if(n > 3){
   if(checkCode(password,input) == true){
     delay(250);  
     lcd.clear();
     lcd.setCursor(0,0);
     lcd.print("Correct!"); 
     delay(1000);
     lcd.clear();
     lcd.setCursor(0,0);
     lcd.print("Enter new Code");
     menu=4;
   }
  else{
   delay(250);
   lcd.clear();
   lcd.setCursor(0,0);
   lcd.print("Invalid Code!"); 
   delay(2000);
   reset();
    } 
   n=0; 
   cursorColumn=0;
  }
}

void reset(){
  int i;
  cursorColumn=0;
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Press A to Begin");
  Serial.println("Tap A/B to Begin");  
  menu=0;
  n=0;
  for(i=0;i<4;i++){
    input[i]='r';
  }
  digitalWrite(redPin,HIGH);delay(2000);
  digitalWrite(redPin,LOW);
}

void fingerCheck(){
  if (finger.verifyPassword()) {
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Found sensor!");
  }
  else {
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Did not find fingerprint sensor :(");
    while (1);
  }
  lcd.setCursor(0,1);
  lcd.print("Waiting..."); 
  return ;
}

uint8_t getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }
  
  // OK converted!
  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }   
  
  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID); 
  Serial.print(" with confidence of "); Serial.println(finger.confidence); 
}

// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)  return -1;
  
  // found a match!
  digitalWrite(redPin,LOW);
   
  lcd.clear();
  lcd.print("Found ID #"); lcd.print(finger.fingerID); 
  lcd.setCursor(0,1);
  lcd.print("Confidence "); lcd.print(finger.confidence);
  delay(5000);
  reset();
  return finger.fingerID; 
}

void resetAgain(){
  int i;
  cursorColumn=0;
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Tap 'A/B' again");
  Serial.println("Tap 'A/B' again");  
  menu=0;
  n=0;
  for(i=0;i<4;i++){
    input[i]='r';
  }
  digitalWrite(redPin,HIGH);
}

void eeWrite(byte *a){
  for(int i=0;i<4;i++){
    EEPROM.update(i, a[i]);
  }
  delay(500);
}

void eeRead(){
  for(int i=0; i<4;i++){
     value[i] = EEPROM.read(i);
     delay(300);
  }
  for(int i=0; i<4;i++){
      password[i]= (value[i]);          //convert the decimal value to ascii
      //Serial.print(password[i]);
  }
  lcd.setCursor(0,1);
  lcd.print("Safe With Us!");
  Serial.print("Safe With Us!");
  delay(300);
}

void keyPadReset(){
  EEPROM.update(10,0);
  delay(500);
  Serial.println("System Formatted, Contact Admin!");
  while(1){
    
  }
}

/*void programMode(){
    if (digitalRead(button) == HIGH) {                                              // when button pressed pin should get high, button connected to vcc
    Serial.println(F("Program Button Pressed"));
    Serial.println(F("You have 15 seconds to Cancel"));
    Serial.println(F("This will be add new finger to the system and cannot be undone"));
    delay(15000);                                                                 // Give user enough time to cancel operation
   
    finger.getTemplateCount();
    Serial.print("Sensor contains "); Serial.print(finger.templateCount); Serial.println(" templates");

    if (digitalRead(button) == HIGH) {                                            // If button still be pressed, wipe EEPROM
      Serial.println("Ready to enroll a fingerprint!");
      Serial.println("Please type in the ID # (from 1 to 127) you want to save this finger as...");
      id = readnumber();
      if (id == 0) {                                                              // ID #0 not allowed, try again!
          return;
      }
      Serial.print("Enrolling ID #");
      Serial.println(id);
  
      while (!  getFingerprintEnroll() );
      
    }
    else {Serial.println("ProgramMode Cancelled");}                                // Show some feedback that the wipe button did not pressed for 15 seconds
  }delay(1000);
}*/


/*uint8_t getFingerprintEnroll() {

  int scan = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(id);
  while (scan != FINGERPRINT_OK) {
    scan = finger.getImage();
    switch (scan) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  scan = finger.image2Tz(1);
  switch (scan) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return scan;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return scan;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return scan;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return scan;
    default:
      Serial.println("Unknown error");
      return scan;
  }
  
  Serial.println("Remove finger");
  delay(2000);
  scan = 0;
  while (scan != FINGERPRINT_NOFINGER) {
    scan = finger.getImage();
  }
  Serial.print("ID "); Serial.println(id);
  scan = -1;
  Serial.println("Place same finger again");
  while (scan != FINGERPRINT_OK) {
    scan = finger.getImage();
    switch (scan) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  scan = finger.image2Tz(2);
  switch (scan) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return scan;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return scan;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return scan;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return scan;
    default:
      Serial.println("Unknown error");
      return scan;
  }
  
  // OK converted!
  Serial.print("Creating model for #");  Serial.println(id);
  
  scan = finger.createModel();
  if (scan == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else if (scan == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return scan;
  } else if (scan == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    return scan;
  } else {
    Serial.println("Unknown error");
    return scan;
  }   
  
  Serial.print("ID "); Serial.println(id);
  scan = finger.storeModel(id);
  if (scan == FINGERPRINT_OK) {
    Serial.println("Stored!");
  } else if (scan == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return scan;
  } else if (scan == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    return scan;
  } else if (scan == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return scan;
  } else {
    Serial.println("Unknown error");
    return scan;
  }   
}*/
