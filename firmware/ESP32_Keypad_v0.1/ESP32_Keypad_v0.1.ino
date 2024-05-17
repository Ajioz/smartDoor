#include <Keypad.h>

const byte ROWS = 4; /* four rows */
const byte COLS = 4; /* four columns */
/* define the symbols on the buttons of the keypads */
char hexaKeys[ROWS][COLS] = {
  {'1','2','3', 'A'},
  {'4','5','6', 'B'},
  {'7','8','9', 'C'},
  {'*','0','#', 'D'}
};

byte rowPins[ROWS] = {13, 12, 14, 27}; /* connect to the row pinouts of the keypad */
byte colPins[COLS] = {26, 25, 33, 32}; /* connect to the column pinouts of the keypad */

/* initialize an instance of class NewKeypad */
Keypad customKeypad = Keypad( makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS); 

bool isNumeric(String inputString) {
  // This regex will match any string that contains anything other than digits
  // In Arduino C++, regular expressions are not natively supported, so we'll use a different approach

  for (unsigned int i = 0; i < inputString.length(); i++) {
    if (!isDigit(inputString[i])) {
      // If the character is not a digit, return false
      return false;
    }
  }
  // If all characters are digits, return true
  return true;
}

// Example usage:
void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB
  }

  Serial.println(isNumeric("12345"));  // Should print true
  Serial.println(isNumeric("123a45")); // Should print false
}


void loop(){
  char customKey = customKeypad.getKey();

  if (customKey){
Serial.println(customKey);
  }
}
