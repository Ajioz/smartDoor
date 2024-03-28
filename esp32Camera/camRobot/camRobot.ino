#include <Servo.h>

// Servo object creation
Servo RoboCam1;                              //Create a servo object to control Camera angle
Servo RoboCam2;                              //Create a servo object to control Camera angle 

//Pin (Hardware) for Motion and Servocontroller declaration
const int RoboCamCtr1 = 3;
const int RoboCamCtr2 = 4;
const int PirPin1     = 5;
const int PirPin2     = 6;
const int PirPin3     = 7;
const int PirPin4     = 8;
const int PirPin5     = 9;
const int PirPin6     = 10;
const int PirPin7     = 11;
const int PirPin8     = 12;
const int PirLed      = 13; 

//Variable Declaration

int calibrationTime           = 10;                                           //  Declaration of array to take the time we give the sensor to calibrate (10-60 secs according to the datasheet)
long unsigned int lowIn[8];                                                   //  Declaration of array to take the time when the sensor outputs a low impulse
long unsigned int pause       = 5000;                                         //  the amount of milliseconds the sensor has to be low before we assume all motion has stopped
boolean lockLow[8]            = {true,true,true,true,true,true,true,true};    //  Declaration of a boolean array that will be defined in the LOOP Function

boolean takeLowTime[8];


void setup (){
  
  Serial.begin(9600);                           //  Set BaudRate to default baud rate 9600 for both computer and GSM
  
  RoboCam1.attach(RoboCamCtr1);
  RoboCam2.attach(RoboCamCtr2);
  
  pinMode(PirPin1, INPUT);
  pinMode(PirPin2, INPUT);
  pinMode(PirPin3, INPUT);
  pinMode(PirPin4, INPUT);
  pinMode(PirPin5, INPUT);
  pinMode(PirPin6, INPUT);
  pinMode(PirPin7, INPUT);
  pinMode(PirPin8, INPUT);
  pinMode(PirLed, OUTPUT);
  
  digitalWrite(PirPin1, LOW);
  digitalWrite(PirPin2, LOW);
  digitalWrite(PirPin3, LOW);
  digitalWrite(PirPin4, LOW);
  digitalWrite(PirPin5, LOW);
  digitalWrite(PirPin6, LOW);
  digitalWrite(PirPin7, LOW);
  digitalWrite(PirPin8, LOW);
  
  digitalWrite(PirLed, LOW);

  //give the sensor some time to calibrate
  Serial.print("calibrating sensor ");
  for (int i = 0; i < calibrationTime; i++) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("SENSOR ACTIVE");
  delay(50);
}

void loop(){
  MotionOne();MotionTwo();MotionThree();MotionFour();MotionSix();MotionSeven();MotionEight();
  if(!takeLowTime[0] && !takeLowTime[1] && !takeLowTime[2] && !takeLowTime[3] && !takeLowTime[4] && !takeLowTime[5] && !takeLowTime[6] && !takeLowTime[7]){
     digitalWrite(PirLed, LOW);               //No more motion, in any angle therefore turn off LED
  }
}
 
 
void MotionOne(){
 if (digitalRead(PirPin1) == HIGH) {                //if pin 5 of the micocontroller is high
          digitalWrite(PirLed, HIGH);               //motion detected, turn on LED
          if (lockLow[0]) {
              lockLow[0] = false;                      //makes sure we wait for a transition to LOW before any further output is made:
              RoboCam1.write(45);
              Serial.println("---");
              Serial.print("motion detected @ Location_one at ");
              Serial.print(millis() / 1000);
              Serial.println(" sec");
              delay(100);
              
          }
          takeLowTime[0] = true;
    }
    if (digitalRead(PirPin1) == LOW) {
        if (takeLowTime[0]) {
            lowIn[0] = millis();                       //save the time of the transition from high to LOW  
            takeLowTime[0] = false;
        }
        //if the sensor is low for more than the given pause, we assume that no more motion is going to happen  
        if (!lockLow[0] && millis() - lowIn[0] > pause) {
            //makes sure this block of code is only executed again after a new motion sequence has been detected
            lockLow[0] = true;
            Serial.print("motion ended at ");
            Serial.print((millis() - pause) / 1000);
            Serial.println(" sec");
            delay(100);
        }
    }
    delay(1000);
}

void MotionTwo(){
 if (digitalRead(PirPin2) == HIGH) {                //if pin 6 of the micocontroller is high
          digitalWrite(PirLed, HIGH);               //motion detected, turn on LED
          if (lockLow[1]) {
              lockLow[1] = false;                      //makes sure we wait for a transition to LOW before any further output is made:
              RoboCam1.write(90);
              Serial.println("---");
              Serial.print("motion detected @ Location_two at ");
              Serial.print(millis() / 1000);
              Serial.println(" sec");
              delay(100);
              
          }
          takeLowTime[1] = true;
    }
    if (digitalRead(PirPin2) == LOW) {
        if (takeLowTime[1]) {
            lowIn[1] = millis();                       //save the time of the transition from high to LOW  
            takeLowTime[1] = false;
        }
        //if the sensor is low for more than the given pause, we assume that no more motion is going to happen  
        if (!lockLow[1] && millis() - lowIn[1] > pause) {
            //makes sure this block of code is only executed again after a new motion sequence has been detected
            lockLow[1] = true;
            Serial.print("motion ended at ");
            Serial.print((millis() - pause) / 1000);
            Serial.println(" sec");
            delay(100);
            
        }
    }
    delay(1000);
}

void MotionThree(){
 if (digitalRead(PirPin3) == HIGH) {                //if pin 7 of the micocontroller is high
          digitalWrite(PirLed, HIGH);               //motion detected, turn on LED
          if (lockLow[2]) {
              lockLow[2] = false;                      //makes sure we wait for a transition to LOW before any further output is made:
              RoboCam1.write(135);
              Serial.println("---");
              Serial.print("motion detected @ Location_three at ");
              Serial.print(millis() / 1000);
              Serial.println(" sec");
              delay(100);
              
          }
          takeLowTime[2] = true;
    }
    if (digitalRead(PirPin3) == LOW) {
        if (takeLowTime[2]) {
            lowIn[2] = millis();                       //save the time of the transition from high to LOW  
            takeLowTime[2] = false;
        }
        //if the sensor is low for more than the given pause, we assume that no more motion is going to happen  
        if (!lockLow[2] && millis() - lowIn[2] > pause) {
            //makes sure this block of code is only executed again after a new motion sequence has been detected
            lockLow[2] = true;
            Serial.print("motion ended at ");
            Serial.print((millis() - pause) / 1000);
            Serial.println(" sec");
            delay(100);
            
        }
    }
    delay(1000);
}

void MotionFour(){
 if (digitalRead(PirPin4) == HIGH) {                //if pin 8 of the micocontroller is high
          digitalWrite(PirLed, HIGH);               //motion detected, turn on LED
          if (lockLow[3]) {
              lockLow[3] = false;                      //makes sure we wait for a transition to LOW before any further output is made:
              RoboCam1.write(180);
              Serial.println("---");
              Serial.print("motion detected @ Location_four at ");
              Serial.print(millis() / 1000);
              Serial.println(" sec");
              delay(100);
              
          }
          takeLowTime[3] = true;
    }
    if (digitalRead(PirPin4) == LOW) {
        if (takeLowTime[3]) {
            lowIn[3] = millis();                       //save the time of the transition from high to LOW  
            takeLowTime[3] = false;
        }
        //if the sensor is low for more than the given pause, we assume that no more motion is going to happen  
        if (!lockLow[3] && millis() - lowIn[3] > pause) {
            //makes sure this block of code is only executed again after a new motion sequence has been detected
            lockLow[3] = true;
            Serial.print("motion ended at ");
            Serial.print((millis() - pause) / 1000);
            Serial.println(" sec");
            delay(100);
            
        }
    }
    delay(1000);
}

void MotionFive(){
 if (digitalRead(PirPin5) == HIGH) {                //if pin 9 of the micocontroller is high
          digitalWrite(PirLed, HIGH);               //motion detected, turn on LED
          if (lockLow[4]) {
              lockLow[4] = false;                      //makes sure we wait for a transition to LOW before any further output is made:
              RoboCam2.write(45);
              Serial.println("---");
              Serial.print("motion detected @ Location_five at ");
              Serial.print(millis() / 1000);
              Serial.println(" sec");
              delay(100);
              
          }
          takeLowTime[4] = true;
    }
    if (digitalRead(PirPin5) == LOW) {
        if (takeLowTime[4]) {
            lowIn[4] = millis();                       //save the time of the transition from high to LOW  
            takeLowTime[4] = false;
        }
        //if the sensor is low for more than the given pause, we assume that no more motion is going to happen  
        if (!lockLow[4] && millis() - lowIn[4] > pause) {
            //makes sure this block of code is only executed again after a new motion sequence has been detected
            lockLow[4] = true;
            Serial.print("motion ended at ");
            Serial.print((millis() - pause) / 1000);
            Serial.println(" sec");
            delay(100);
            
        }
    }
    delay(1000);
}

void MotionSix(){
 if (digitalRead(PirPin6) == HIGH) {                //if pin 10 of the micocontroller is high
          digitalWrite(PirLed, HIGH);               //motion detected, turn on LED
          if (lockLow[5]) {
              lockLow[5] = false;                      //makes sure we wait for a transition to LOW before any further output is made:
              RoboCam2.write(90);
              Serial.println("---");
              Serial.print("motion detected @ Location_six at ");
              Serial.print(millis() / 1000);
              Serial.println(" sec");
              delay(100);
              
          }
          takeLowTime[5] = true;
    }
    if (digitalRead(PirPin6) == LOW) {
        if (takeLowTime[5]) {
            lowIn[5] = millis();                       //save the time of the transition from high to LOW  
            takeLowTime[5] = false;
        }
        //if the sensor is low for more than the given pause, we assume that no more motion is going to happen  
        if (!lockLow[5] && millis() - lowIn[5] > pause) {
            //makes sure this block of code is only executed again after a new motion sequence has been detected
            lockLow[5] = true;
            Serial.print("motion ended at ");
            Serial.print((millis() - pause) / 1000);
            Serial.println(" sec");
            delay(100);
            
        }
    }
    delay(1000);
}

void MotionSeven(){
 if (digitalRead(PirPin7) == HIGH) {                //if pin 11 of the micocontroller is high
          digitalWrite(PirLed, HIGH);               //motion detected, turn on LED
          if (lockLow[6]) {
              lockLow[6] = false;                      //makes sure we wait for a transition to LOW before any further output is made:
              RoboCam2.write(135);
              Serial.println("---");
              Serial.print("motion detected @ Location_seven at ");
              Serial.print(millis() / 1000);
              Serial.println(" sec");
              delay(100);
              
          }
          takeLowTime[6] = true;
    }
    if (digitalRead(PirPin7) == LOW) {
        if (takeLowTime[6]) {
            lowIn[6] = millis();                       //save the time of the transition from high to LOW  
            takeLowTime[6] = false;
        }
        //if the sensor is low for more than the given pause, we assume that no more motion is going to happen  
        if (!lockLow[6] && millis() - lowIn[6] > pause) {
            //makes sure this block of code is only executed again after a new motion sequence has been detected
            lockLow[6] = true;
            Serial.print("motion ended at ");
            Serial.print((millis() - pause) / 1000);
            Serial.println(" sec");
            delay(100);
            
        }
    }
    delay(1000);
}

void MotionEight(){
 if (digitalRead(PirPin8) == HIGH) {                //if pin 12 of the micocontroller is high
          digitalWrite(PirLed, HIGH);               //motion detected, turn on LED
          if (lockLow[7]) {                         //if the boolean variablelockLow of index 7 is true;
              lockLow[7] = false;                   //makes sure we wait for a transition to LOW before any further output is made:
              RoboCam2.write(180);
              Serial.println("---");
              Serial.print("motion detected @ Location_eight at ");
              Serial.print(millis() / 1000);
              Serial.println(" sec");
              delay(100);
              
          }
          takeLowTime[7] = true;
    }
    if (digitalRead(PirPin8) == LOW) {                 //if pin 12 of the micocontroller is low
        if (takeLowTime[7]) {
            lowIn[7] = millis();                       //save the time of the transition from high to LOW  
            takeLowTime[7] = false;
        }
        //if the sensor is low for more than the given pause, we assume that no more motion is going to happen  
        if (!lockLow[7] && millis() - lowIn[7] > pause) {
            //makes sure this block of code is only executed again after a new motion sequence has been detected
            lockLow[7] = true;
            Serial.print("motion ended at ");
            Serial.print((millis() - pause) / 1000);
            Serial.println(" sec");
            delay(100);
            
        }
    }
    delay(1000);
}
