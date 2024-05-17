#include "secret.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include "esp_camera.h"

// Camera and MQTT configuration
#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"
#define ESP32CAM_PUBLISH_TOPIC "eGas/IoTcam_1"
#define BUFFER_SIZE 1024 * 30 // Adjust buffer size as needed

// WiFi and MQTT Client
WiFiClientSecure net;
MQTTClient client(BUFFER_SIZE);

// Function declarations
void connectToWiFi();
void connectToAWS();
void initializeCamera();
void publishImage();

// Replace with your network credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  initializeCamera();
  connectToAWS();
}

void loop() {
  if (!client.connected()) {
    connectToAWS();
  }
  client.loop();
  if (client.connected()) {
    publishImage();
  }
}

void connectToWiFi() {
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected.");
}

void connectToAWS() {
  // Check if already connected
  if (client.connected()) {
    return;
  }

  Serial.println("Connecting to AWS IoT...");
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  while (!client.connect(THINGNAME)) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nAWS IoT Connected!");
}

void initializeCamera() {
  camera_config_t config = {};
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  // ... (rest of the pin assignments)
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 12;
  config.fb_count = 2;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
}

void publishImage() {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }
  if (fb->len >= BUFFER_SIZE) {
    Serial.println("Image too large for buffer");
    esp_camera_fb_return(fb);
    return;
  }
  if (client.publish(ESP32CAM_PUBLISH_TOPIC, fb->buf, fb->len)) {
    Serial.println("Image published successfully");
  } else {
    Serial.println("Image publish failed");
  }
  esp_camera_fb_return(fb);
}
