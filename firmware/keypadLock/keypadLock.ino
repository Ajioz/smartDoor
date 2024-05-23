//*****************************************************************************//
//  Name          : Electronic Door Lock                                       //
//  Author        : Ajiroghene Sunday                                          //
//  Modified      : Ajiroghene Sunday                                          //
//  Version       : 1.0                                                        // 
//  Notes         : An electronic door lock using a keypad, mobile interface   //
//                : esp32 that controls an electric door strike - IoT enabled  //           
//*****************************************************************************//


#include <Keypad.h>
#include <SPIFFS.h>

void readKeypad();
boolean checkCode(char password[], char input[]);
int oldCodeCheck();
void doorlockCheck();
int changeToNewCode(byte *a, byte *b);


const byte ROWS = 4; /* four rows */
const byte COLS = 4; /* four columns */


char input[] = {'0','0','0','0','0','0'};  
char storedPassCode[] = "123456";
const char* passCodePath = "/passcode.txt";
int menu = 0;                                 //this controls the menu settings 
int n=0;                                      // variable used to point to the bits in the keypad input array
int check=0;
int block = 0;
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
byte colPins[COLS] = {26, 25, 33, 32};  

Keypad customKeypad = Keypad( makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);


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
  size_t bytes_read = file.readBytes(storedPassCode, sizeof(storedPassCode) - 1);
  storedPassCode[bytes_read] = '\0';                                                // Add null terminator manually
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


void askForCode(){
  //prints when the user wants to enter the code
   Serial.println("Enter Pin code");
}
             
void doorOpen(){
//  Door open info, open logic can go in here
  Serial.println("Door Open");
}

void myReset(){
  delay(2000);
  menu=0;
  n=0;
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



void setup() {
  Serial.begin(115200);
  initSPIFFS();

  //Load values saved in SPIFFS
  readMemory(passCodePath);
    
  Serial.println(""); 
  Serial.println("Tap A/B to Begin"); 
}

void loop() {
    readKeypad(); 
}


void readKeypad(){
  char key = customKeypad.getKey();
  if(key){                                      // Check for a valid key.
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
          check=0;
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
     doorlockCheck();
  }else if(menu==3 && n > 5){
     oldCodeCheck();
  }else if(menu==4 && n > 5){
    changeToNewCode(storedPassCode,input);
    delay(1000);
    writeFile(SPIFFS, passCodePath, storedPassCode);
    delay(1000); readMemory(passCodePath);
    Serial.println(" "); 
    Serial.println("Code Changed successfully!");
    delay(1000);
    myReset();
  }
}

boolean checkCode(char password[], char input[]) {
  Serial.println("");Serial.println("Validating..."); delay(2000);
  int comparisonResult = strcmp(password, input);
  if (comparisonResult == 0) {
      return true; // Explicitly return true for successful comparison
  } else {
      return false; // Explicitly return false for failed comparison
  }
}


void doorlockCheck(){
  if(n>5){
   //calls the function to check whether the code that was input matches the code that is stored    
   if(checkCode(storedPassCode, input)){
     Serial.print("Code Correct | "); Serial.println("Oepening Door");  
     delay(2500);
     Serial.println("Door Opened!");
     block=0;
     myReset();
   }else{
     delay(250);
     Serial.println("Invalid Code");
     block++; 
     delay(2000); 
     
     if(block<=3){
        myReset(); 
     }else{ 
        Serial.println("You've been blocked"); 
        while(block==3){ } 
     }  
   }  
  }
}


int oldCodeCheck(){
  if(n>5){
   if(checkCode(storedPassCode, input)){
     Serial.println("Correct"); delay(2000);
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

int changeToNewCode(char *a, char *b){
  Serial.println(""); Serial.println("Wait while we do the change!");
  delay(2500);
  int p = 0;
  for(p=0; p<6; p++){
    a[p]=b[p];
  } 
  n=0;
  return n;
}
