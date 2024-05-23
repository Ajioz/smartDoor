//#include <SoftwareSerial.h>
//#include <Adafruit_Fingerprint.h>  
#include <Keypad.h>
#include <SPIFFS.h>


//SoftwareSerial mySerial(2,15);        // pin #2 is IN from sensor (GREEN wire) and pin #5 is OUT from arduino (WHITE wire)
//HardwareSerial serialPort(2); // use UART2
//Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

//Define hardware IO
//#define greenPin 5
//#define redPin 6
//#define button 7

void readKeypad();
void keyPadReset();
void myReset();
int oldCodeCheck();
int doorlockCheck();

//bool compareStrings(String input, String passCode);
boolean checkCode(char *a, char *b);

void askForCode(){
  //prints when the user wants to enter the code
   myReset();
   Serial.println("Enter Pin code");
}

void doorOpen(){
//  Door open info, open logic can go in here
  Serial.println("Door Open");
}

uint8_t readnumber(void) {
  uint8_t num = 0;
  while (num == 0) {
    while (! Serial.available());
    num = Serial.parseInt();
  }
  return num;
}

const byte ROWS = 4; /* four rows */
const byte COLS = 4; /* four columns */

char input[] = {'0','0','0','0','0','0',};                  // an array that will contain the digits that are input
//char storedPasscode[7];                                     //Array to store passcode once retrieve
//const char* passCodePath = "/passcode.txt";

uint8_t id;
int menu = 0;               //this controls the menu settings 
int n=0;                    // variable used to point to the bits in the keypad input array
int check=0;
int block=0;
bool humanFound = false;

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
  // Check if the string is empty
  if (inputString.length() == 0) {
    return false; // Return false for an empty string
  }
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
  Serial.begin(115200);
  initSPIFFS();
  
  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }
  
  // button Code - If the Button is Pressed while setup run (powered on) it programs into the fingerprint memory
  programMode();
  finger.getTemplateCount();
  Serial.print("Total Finger contained ");Serial.print(finger.templateCount); Serial.println(" templates");  
  
  //Load values saved in SPIFFS
  readMemory(passCodePath);
  
  if(storedPasscode != "123456"){
    writeFile(SPIFFS, passCodePath, "123456");
    Serial.println("StoredPasscode is empty"); 
  }else{
    Serial.print("Previous Pin is:  "); 
    Serial.println(storedPasscode);
  }
  
  Serial.println(""); 
  Serial.println("Tap A/B to Begin"); 
  //Serial.println(isNumeric(" "));  // Should print true
}



void loop(){
   readKeypad(); 
//  if(digitalRead(button)){
//    programMode();
//  } 
//  if(humanFound){
//    fingerCheck();
//    getFingerprintIDez();         //For fingerPrint
//  }
                   // Handles the Keypad object and switch case to read the inputs and decides the output state and leds based on the input   
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
          input[n]='0';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("0");
          input[n]='0';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          input[n]='0';
          n=n+1;
        }
        break;
        
      case '1':
        if(menu == 1){
        Serial.print("*");
          input[n]='1';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("1");
          input[n]='1';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          input[n]='1';
          n=n+1;
        }
        break;
        
      case '2':
        if(menu == 1){
          Serial.print("*");
          input[n]='2';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("2");
          input[n]='2';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          input[n]='2';
          n=n+1;
        }
        break;
        
      case '3':
        if(menu == 1){
          Serial.print("*");
          input[n]='3';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("3");
          input[n]='3';
          n=n+1;
        } 
        else if(menu == 4){
          Serial.print("*");
          input[n]='3';
          n=n+1;
        }
        break;
        
      case '4':
        if(menu == 1){
          Serial.print("*");
          input[n]='4';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("4");
          input[n]='4';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          input[n]='4';
          n=n+1;
        }
        break;
        
      case '5':
        if(menu == 1){
          Serial.print("*");
          input[n]='5';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("5");
          input[n]='5';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          input[n]='5';
          n=n+1;
        }
        break;
        
      case '6':
        if(menu == 1){
          Serial.print("*");
          input[n]='6';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("6");
          input[n]='6';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          input[n]='6';
          n=n+1;
        }
        break;
        
      case '8':
        if(menu == 1){
          Serial.print("*");
          input[n]='8';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("8");
          input[n]='8';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          input[n]='8';
          n=n+1;
        }
        break;
        
      case '9':
        if(menu == 1){
          Serial.print("*");
          input[n]='9';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("9");
          input[n]='9';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
          input[n]='9';
          n=n+1;
        }
        break; 
          
      case '7':
        if(menu == 1){
          Serial.print("*");
          input[n]='7';
          n=n+1;
        }
        else if(menu == 3){
          Serial.print("7");
          input[n]='7';
          n=n+1;
        }
        else if(menu == 4){
          Serial.print("*");
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
        myReset();
        break;  
         
      case 'D':
        myReset();
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
  
  if(menu==1 && n > 5){                             //If the menu is in setting 1 and the input array has been filled with 4 digits then...
    Serial.println("n is : ");
     Serial.println(n);delay(2000);
    doorlockCheck();                                //calls the function to check whether the code that was input matches the code that is stored
  }
  
  else if(menu==3 && n > 5){
    oldCodeCheck();  
  }
  
  else if(menu==4 && n > 5){
    changeToNewCode(storedPasscode,input);
    delay(250);
    writeFile(SPIFFS, passCodePath, storedPasscode);
    delay(500); readMemory(passCodePath);
    Serial.println(" "); 
    Serial.println("Code Changed");
    delay(1000);
    myReset();
  }
  
  if(checkCode(storedPasscode,input) == true){
      doorOpen();
    delay(50);
  }
}


boolean checkCode(char *a, char *b){                   //The function to check whether the contents of the first parameter,an array, match the 
  if(n>5){
  int p;                                              //match the contents of the second parameter, also an array.
  for(p=0; p<6; p++) 
    if(a[p]!=b[p]) return false;
    return true;
  }
  return false;
}


int changeToNewCode(char *a, char *b){
  int p = 0;
  for(p=0; p<6; p++){
    a[p]=b[p];
  } 
  n=0;
}

int doorlockCheck(){
  if(n>5){
   if(checkCode(storedPasscode,input) == true){
     delay(250);
     Serial.print("doorlockCheck: "); 
     Serial.println("Correct"); 
     Serial.print("n is: ");Serial.println(n);
     block=0;
   }else{
     delay(250);
     Serial.println(""); 
     Serial.println("Invalid Code");
     block++; 
     delay(2000); 
     if(block<3){ myReset(); }else{ Serial.println("You've been blocked"); while(block==3){ } }
   }  
   n=0;
   delay(3000); myReset();
  }
}

int oldCodeCheck(){
  if(n>5){
   if(checkCode(storedPasscode,input) == true){
     delay(250);  
     Serial.print("oldCodeCheck: "); 
     Serial.println("Correct");  
     Serial.println("Enter new Code"); 
     menu=4;
   }else{
     delay(250);
     Serial.println(""); 
     Serial.println("Invalid Code!");  
     delay(2000);
     myReset();
   } 
   n=0; 
  }
  return n;
}

void myReset(){
  Serial.println("Resetting...");delay(2000);
  int i;
  menu=0;
  n=0;
  Serial.println("Comparing...");delay(2000);
  if (strcmp("123444", "123444") == 0) {
    Serial.println("code Correct");
  } else {
      Serial.println("Invalid");
  }
  Serial.println("Tap A/B to Begin");  
  strcpy(input, "0000000");
  for (int i = 0; i < 6; i++) {
    input[i] = '0';
  }
//  digitalWrite(redPin,HIGH);
//  digitalWrite(greenPin,LOW);

}

void keyPadReset(){
  writeFile(SPIFFS, passCodePath, "123456");
  Serial.println("System Formatted, Contact Admin!");
  while(1){
  }
}

/*
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
*/

/*
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
  myReset();
  return finger.fingerID; 
}
*/

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
