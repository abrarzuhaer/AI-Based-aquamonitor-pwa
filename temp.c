

#include <Wire.h>
#include <SparkFun_AS7265X.h>
#include <math.h>

AS7265X as;  


const uint8_t  NUM_AVG     = 5;    
const uint16_t SETTLE_MS   = 50;   
const bool     USE_BULB    = true; 



float blank[18];      bool hasBlank = false;
float sampleV[18];   
float absorb[18];    


const char* CH[18] = {
  "A","B","C","D","E","F","G","H","I",
  "J","K","L","M","N","O","P","Q","R"
};


bool captureAveraged(float out18[18]);
void printVector(const char* title, const float v[18], uint8_t decimals=3);
void computeAbsorbance(const float sample18[18], const float blank18[18], float outAbs[18]);
void printAbsorbanceRank(const float abs18[18]);

void setup() {
  Serial.begin(115200);
  while (!Serial) {}

  Serial.println(F("\n=== AS7265x DO Colorimetry Unit Test ==="));
  Serial.println(F("Commands:"));
  Serial.println(F("  b  -> capture BLANK (reference) with bulb"));
  Serial.println(F("  s  -> capture SAMPLE + compute absorbance"));
  Serial.println(F("  w  -> toggle bulb ON/OFF (for debugging)"));
  Serial.println(F("  r  -> reprint last results\n"));

  Wire.begin(); 

  if (!as.begin()) {
    Serial.println(F("[ERR] AS7265x not detected. Check Qwiic cable/power (3.3V) and I2C wires."));
    while (1) { delay(500); Serial.print("."); }
  }


  as.setIntegrationTime(50);

  as.setGain(AS7265X_GAIN_64X);

  as.setMeasurementMode(AS7265X_MEASUREMENT_MODE_6CHAN);


  as.disableIndicator();

  if (USE_BULB) as.enableBulb(); else as.disableBulb();

  Serial.println(F("[OK] AS7265x ready."));
  Serial.println(F("Place CLEAR water, type 'b' + Enter to store BLANK."));
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();

    if (c == 'b' || c == 'B') {
      Serial.println(F("\n[BLANK] Capturing reference..."));
      if (captureAveraged(blank)) {
        hasBlank = true;
        printVector("BLANK (avg, calibrated)", blank, 3);
      } else {
        Serial.println(F("[ERR] Failed to read BLANK."));
      }
    }

    else if (c == 's' || c == 'S') {
      if (!hasBlank) {
        Serial.println(F("[WARN] No BLANK yet. Type 'b' first."));
      } else {
        Serial.println(F("\n[SAMPLE] Capturing sample..."));
        if (captureAveraged(sampleV)) {
          printVector("SAMPLE (avg, calibrated)", sampleV, 3);
          computeAbsorbance(sampleV, blank, absorb);
          printVector("ABSORBANCE (-log10(sample/blank))", absorb, 4);
          printAbsorbanceRank(absorb);
          Serial.println(F("Tip: Pick top 1–3 channels for DO calibration vs. lab values."));
        } else {
          Serial.println(F("[ERR] Failed to read SAMPLE."));
        }
      }
    }

    else if (c == 'w' || c == 'W') {

      static bool bulbOn = USE_BULB;
      bulbOn = !bulbOn;
      if (bulbOn) { as.enableBulb();  Serial.println(F("[BULB] ON")); }
      else        { as.disableBulb(); Serial.println(F("[BULB] OFF")); }
    }

    else if (c == 'r' || c == 'R') {
      if (hasBlank) {
        printVector("BLANK (last)", blank, 3);
      } else {
        Serial.println(F("No BLANK stored yet."));
      }
      printVector("SAMPLE (last)", sampleV, 3);
      printVector("ABSORBANCE (last)", absorb, 4);
    }
  }
}


bool captureAveraged(float out18[18]) {

  float acc[18]; for (int i=0;i<18;i++) acc[i]=0;


  for (uint8_t n=0; n<NUM_AVG; n++) {

    as.takeMeasurementsWithBulb();


    float v[18] = {
      as.getCalibratedA(), as.getCalibratedB(), as.getCalibratedC(),
      as.getCalibratedD(), as.getCalibratedE(), as.getCalibratedF(),
      as.getCalibratedG(), as.getCalibratedH(), as.getCalibratedI(),
      as.getCalibratedJ(), as.getCalibratedK(), as.getCalibratedL(),
      as.getCalibratedM(), as.getCalibratedN(), as.getCalibratedO(),
      as.getCalibratedP(), as.getCalibratedQ(), as.getCalibratedR()
    };

    for (int i=0;i<18;i++) {
      if (!isfinite(v[i]) || v[i] < 0) v[i] = 0;
      acc[i] += v[i];
    }

    delay(SETTLE_MS);
  }

  for (int i=0;i<18;i++) out18[i] = acc[i] / (float)NUM_AVG;


  int nz=0; for (int i=0;i<18;i++) if (out18[i] > 0.0001f) nz++;
  return (nz > 0);
}


void computeAbsorbance(const float sample18[18], const float blank18[18], float outAbs[18]) {
  for (int i=0;i<18;i++) {
    float s = sample18[i];
    float b = blank18[i];
    if (!isfinite(s) || s<=0 || !isfinite(b) || b<=0) {
      outAbs[i] = 0; // undefined -> 0 to keep it simple
    } else {
      outAbs[i] = -log10f(s / b);
    }
  }
}


void printVector(const char* title, const float v[18], uint8_t decimals) {
  Serial.println(title);
  for (int i=0;i<18;i++) {
    Serial.print("  ");
    Serial.print(CH[i]);
    Serial.print(": ");
    Serial.println(v[i], decimals);
  }
}

void printAbsorbanceRank(const float abs18[18]) {

  int idx[18]; for (int i=0;i<18;i++) idx[i]=i;

  for (int i=0;i<18;i++) {
    for (int j=i+1;j<18;j++) {
      if (abs18[idx[j]] > abs18[idx[i]]) { int t=idx[i]; idx[i]=idx[j]; idx[j]=t; }
    }
  }
  Serial.println(F("Top channels by absorbance (most sensitive):"));
  for (int k=0;k<5;k++) {
    int i = idx[k];
    Serial.print("  ");
    Serial.print(CH[i]);
    Serial.print(" : ");
    Serial.println(abs18[i], 4);
  }
}