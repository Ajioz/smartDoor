#include <Keypad.h>
#include <Adafruit_Fingerprint.h>  
#include <SoftwareSerial.h>
#include <SPIFFS.h>



SoftwareSerial mySerial(10,9);        // pin #10 is IN from sensor (GREEN wire) and pin #9 is OUT from arduino (WHITE wire)
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

//Define hardware IO
#define greenPin 2
#define redPin 3
#define button 8

const byte ROWS = 4; /* four rows */
const byte COLS = 4; /* four columns */


char input[6];             // an array that will contain the digits that are input
char password[6];
byte value[6];
char storedPasscode[100];   //Array to store passcode once retrieve
const char* passCodePath = "/passcode.txt";

uint8_t id;
int menu = 0;               //this controls the menu settings 
int cursorColumn = 0;       //this controls the cursor postition
int n=0;                    // variable used to point to the bits in the keypad input array
int check=0;
int block=0;


/* define the symbols on the buttons of the keypads */
char hexaKeys[ROWS][COLS] = {
  {'1','2','3', 'A'},
  {'4','5','6', 'B'},
  {'7','8','9', 'C'},
  {'*','0','#', 'D'}
};

//Keypad hardware IO
byte rowPins[ROWS] = {13, 12, 14, 27};                                              /* connect to the row pinouts of the keypad */
byte colPins[COLS] = {26, 25, 33, 32};                                              /* connect to the column pinouts of the keypad */

Keypad customKeypad = Keypad( makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);  /* initialize an instance of class NewKeypad */

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

// Initialize SPIFFS
void initSPIFFS() {
  if (!SPIFFS.begin(true)){
    Serial.println("An error has occurred while mounting SPIFFS");
    return;
  }
  Serial.println("SPIFFS mounted successfully");
}

//Read spiff location to retrieve data
void readMemory(const char* path){ 
  // Open the connectID file for reading, for the purpose of formating it corectly as a publish topic
  File file = SPIFFS.open(path, "r");
  if (!file) {
    Serial.println("Failed to open file for reading"); return;
  }
  // Read the file content
  size_t bytes_read = file.readBytes(storedPasscode, sizeof(storedPasscode) - 1);
  storedPasscode[bytes_read] = '\0';                                                // Add null terminator manually
  file.close();                                                                   // Close the file
}

// Write file to SPIFFS
void writeFile(fs::FS &fs, const char * path, const char * message){
  Serial.printf("Writing file: %s\r\n", path);

  File file = fs.open(path, FILE_WRITE);
  if(!file){
    Serial.println("- failed to open file for writing");
    return;
  }
  if(file.print(message)){
    Serial.println("- file written");
  } else {
    Serial.println("- write failed");
  }
}
// Example usage:
void setup() {
  pinMode(button, INPUT);
  pinMode(greenPin,OUTPUT);    
  pinMode(redPin,OUTPUT);      //set the pin used for the red and green LED's as outputs
  
  digitalWrite(button, LOW);
  digitalWrite(redPin,HIGH);   // intially activate the Red LED to indicate that the door is locked  
  digitalWrite(greenPin,LOW);    
  
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB
  }

  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }
  
  //button Code - If the Button is Pressed while setup run (powered on) it programs into the fingerprint memory
  programMode();
  finger.getTemplateCount();
  Serial.print("Total Finger contained ");Serial.print(finger.templateCount); Serial.println(" templates");  

  initSPIFFS();

  // Load values saved in SPIFFS
  getTopic(passCodePath);

  if(storedPasscode != 123456){
//    writeFile(SPIFFS, ssidPath, ssid.c_str());
    writeFile(SPIFFS, passCodePath, 12345);
  }else{
    Serial.print("Previous Pin is:  "); 
    Serial.Println(storedPasscode);
  }
    
  Serial.println(""); 
  Serial.println("Tap A/B to Begin");

  Serial.println(isNumeric("12345"));  // Should print true
  Serial.println(isNumeric("123a45")); // Should print false
}

uint8_t readnumber(void) {
  uint8_t num = 0;
  while (num == 0) {
    while (! Serial.available());
    num = Serial.parseInt();
  }
  return num;
}

void loop(){
  readKeypad();                 // Handles the Keypad object and switch case to read the inputs and decides the output state and leds based on the input   
  if(digitalRead(button)){
    programMode();
  } 
  if(humanFound){
    
  fingerCheck();
  getFingerprintIDez();         //For fingerPrint
  }
}


void askForCode(){
  //lcd.print("Enter Pin code");  //prints when the user wants to enter the code
  Serial.println("Enter Pin code");
  
}

void doorOpen(){
  Serial.println("Door Open");
}
void readKeypad(){
  char key = customKeypad.getKey();
  if(key)                                       // Check for a valid key.
  {
    switch (key)
    {
      case '0':                                 // Each case is a button that is pressed
        if(menu == 1){                          // the value of "menu" determines the setting parameter and what each button does in that setting  
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("0");
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        break;
        
      case '1':
        if(menu == 1){
        Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("1");
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        break;
        
      case '2':
        if(menu == 1){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("2");
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        break;
        
      case '3':
        if(menu == 1){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("3");
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        } 
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        }
        break;
        
      case '4':
        if(menu == 1){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("4");
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        break;
        
      case '5':
        if(menu == 1){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("5");
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        break;
        
      case '6':
        if(menu == 1){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("6");
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        break;
        
      case '8':
        if(menu == 1){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("8");
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        break;
        
      case '9':
        if(menu == 1){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("9");
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        break; 
          
      case '7':
        if(menu == 1){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("7");
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        }  
        break;
         
      case 'A':
        if(menu == 0){
          askForCode();
          menu=menu+1;
        }
        break;
        
      case 'B':
        if(menu == 0){
          Serial.println("Change Code?");
          Serial.println("Press * to Continue");
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
          Serial.println("Enter old code");
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
    Serial.println(" "); 
    Serial.println("Code Changed");
    delay(1000);
    reset();
  }
  
  if(checkCode(password,input) == true){
      doorOpen();
    delay(50);
  }
}


boolean checkCode(byte *a,byte *b){                   //The function to check whether the contents of the first parameter,an array, match the 
  int p;                                              //match the contents of the second parameter, also an array.
  for(p=0; p<4; p++) 
    if(a[p]!=b[p]) return false;
    return true;
}

int changeToNewCode(byte *a, byte *b){
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
     Serial.println(""); 
     Serial.println("Correct"); 
     block=0;
     //This section is written for performance check
     digitalWrite(greenPin,HIGH);
     delay(15000);
     digitalWrite(greenPin,LOW);
   }
  else{
   delay(250);
   Serial.println(""); 
   Serial.println("Invalid Code");
   block++; 
   digitalWrite(greenPin,LOW);
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
     Serial.println(""); 
     Serial.println("Correct");  
     Serial.println("Enter new Code"); 
     menu=4;
   }
  else{
   delay(250);
   Serial.println(""); 
   Serial.println("Invalid Code!");  
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
  Serial.println("Tap A/B to Begin");  
  menu=0;
  n=0;
  for(i=0;i<4;i++){
    input[i]='r';
  }
  digitalWrite(redPin,HIGH);
  digitalWrite(greenPin,LOW);
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
  }
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


void programMode(){
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
  }
  delay(1000);
}

uint8_t getFingerprintEnroll() {
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
}

void fingerCheck(){
  if (finger.verifyPassword()) {
    Serial.println("Found Sensor");
  }
  else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1);
  }
  Serial.println("Waiting...");
  return ;
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
  digitalWrite(greenPin,HIGH);
  digitalWrite(redPin,LOW);
  
  Serial.print("Found ID #"); Serial.print(finger.fingerID); 
  Serial.print(" with confidence of "); Serial.println(finger.confidence); 
  
  delay(5000);
  reset();
  return finger.fingerID; 
}

/*
int8_t getFingerprintID() {
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
*/
