import serial
import time
import pymongo
import datetime

port_str = '/dev/cu.usbmodemFD121'
baud_rate = 9600

client = pymongo.MongoClient()
db = client.weather_station
measurements = db.measurements
while True:
    with serial.Serial(port_str, baud_rate, timeout=10) as ser:
        data = ser.readline()
        data = data.split(";")
        measurement = {
            'temperature': float(data[0]),
            'brightness': int(data[1][:-1]),
            'room': 'chamber',
            'date': datetime.datetime.now()
        }
        measurements.insert_one(measurement)
        print measurement
    time.sleep(250)