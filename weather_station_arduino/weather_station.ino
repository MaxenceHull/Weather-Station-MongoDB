const int tmpPin = A0;
const int photocellPin = A1;
const float aref_voltage = 3.3;

int photocellReading, tmpReading;
void setup() {
  Serial.begin(9600);
  analogReference(EXTERNAL);
}

void loop() {
  photocellReading = analogRead(photocellPin);

  /*Serial.print("Light Reading = ");
  Serial.println(photocellReading);
  if (photocellReading < 10) {
    Serial.println(" - Dark");
  } else if (photocellReading < 200) {
    Serial.println(" - Dim");
  } else if (photocellReading < 500) {
    Serial.println(" - Light");
  } else if (photocellReading < 800) {
    Serial.println(" - Bright");
  } else {
    Serial.println(" - Very bright");
  }*/

  tmpReading = analogRead(tmpPin);
  float voltage = tmpReading * aref_voltage/1024.0;
  float temperature = (voltage - 0.5) * 100;
  Serial.print(temperature); Serial.print(";"); Serial.println(photocellReading);
  delay(60000);

}
