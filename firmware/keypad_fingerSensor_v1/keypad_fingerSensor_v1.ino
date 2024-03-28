
//**************************************************************************//
//  Name          : Electronic Door Lock                               
//  Author        : Turyn                                 
//  Version       : 3.0                                             
//  Notes         : An electronic door lock using a matrix keypad and lcd
//                : display that controls an electric door strike                         
//**************************************************************************//

// Adding the necessary libraries to operate the keypad,lcd and Fingerprint sensor--//

//#include <Adafruit_Fingerprint.h>
#include <Key.h>      
#include <Keypad.h>     
#include <LiquidCrystal.h>
#include <SoftwareSerial.h>

//include definitions for The LED pins--------------------------------------//

#define greenPin 2
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
char a='0';                 //variables a,b,c,d are all zero by default and store each digit of the 4 digit passcode
char b='0';
char c='0';
char d='0';

char password[]={a,b,c,d}; //initializing an array called password with variables a,b,c,d that hold the password digits
char input[4];             // an array that will contain the digits that are input
const byte ROWS = 4;       // Four rows
const byte COLS = 4;       // Four columns

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
  // set the data rate for the sensor serial port
  finger.begin(57600);
  
  lcd.begin(16, 2);    // set up the LCD's number of columns and rows:
  lcd.print("Room 0");         // Prints a message to the LCD.

  pinMode(greenPin,OUTPUT);    
  pinMode(redPin,OUTPUT);      //set the pin used for the red and green LED's as outputs
  digitalWrite(redPin,HIGH);   // intially activate the Red LED to indicate that the door is locked  
}

void loop()
{
  readKeypad();                 // Handles the Keypad object and switch case to read the inputs and decides the output state and leds based on the input    
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
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('0');
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('0');
          cursorColumn=cursorColumn+1;
          input[n]='0';
          n=n+1;
        }
        break;
      case '1':
        if(menu == 1){
        lcd.print('1');
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('1');
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('1');
          cursorColumn=cursorColumn+1;
          input[n]='1';
          n=n+1;
        }
        break;
      case '2':
        if(menu == 1){
          lcd.print('2');
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('2');
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('2');
          cursorColumn=cursorColumn+1;
          input[n]='2';
          n=n+1;
        }
        break;
      case '3':
        if(menu == 1){
          lcd.print('3');
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('3');
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        } 
        else if(menu == 4){
          lcd.print('3');
          cursorColumn=cursorColumn+1;
          input[n]='3';
          n=n+1;
        }
        break;
      case '4':
        if(menu == 1){
          lcd.print('4');
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('4');
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('4');
          cursorColumn=cursorColumn+1;
          input[n]='4';
          n=n+1;
        }
        break;
      case '5':
        if(menu == 1){
          lcd.print('5');
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('5');
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('5');
          cursorColumn=cursorColumn+1;
          input[n]='5';
          n=n+1;
        }
        break;
      case '6':
        if(menu == 1){
          lcd.print('6');
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('6');
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('6');
          cursorColumn=cursorColumn+1;
          input[n]='6';
          n=n+1;
        }
        break;
      case '8':
        if(menu == 1){
          lcd.print('8');
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('8');
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('8');
          cursorColumn=cursorColumn+1;
          input[n]='8';
          n=n+1;
        }
        break;
      case '9':
        if(menu == 1){
          lcd.print('9');
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        else if(menu == 3){
          lcd.print('9');
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('9');
          cursorColumn=cursorColumn+1;
          input[n]='9';
          n=n+1;
        }
        break;   
      case '7':
        if(menu == 1){
          lcd.print('7');
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        break;
        }
        else if(menu == 3){
          lcd.print('7');
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        }
        else if(menu == 4){
          lcd.print('7');
          cursorColumn=cursorColumn+1;
          input[n]='7';
          n=n+1;
        }   
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
      case 'C':
  
        break;   
      case 'D':
        reset();
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
    doorlockCheck();    //calls the function to check whether the code that was input matches the code that is stored
  }
  else if(menu==3 && n > 3){
    oldCodeCheck();  
  }
  else if(menu==4 && n > 3){
  changeToNewCode(password,input);
  delay(250); 
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
     fingerCheck(); 
   }
  else{
   delay(250);
   lcd.clear();
   lcd.setCursor(0,0);
   lcd.print("Invalid Code!"); 
   digitalWrite(greenPin,LOW);
   delay(2000); 
   reset();
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
  lcd.print("Room 0");
  menu=0;
  n=0;
  for(i=0;i<4;i++){
    input[i]='r';
  }
  digitalWrite(redPin,HIGH);
  digitalWrite(greenPin,LOW);
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
  digitalWrite(greenPin,HIGH);
  digitalWrite(redPin,LOW);
   
  lcd.clear();
  lcd.print("Found ID #"); lcd.print(finger.fingerID); 
  lcd.setCursor(0,1);
  lcd.print("Confidence "); lcd.print(finger.confidence);
  delay(5000);
  reset();
  return finger.fingerID; 
}
