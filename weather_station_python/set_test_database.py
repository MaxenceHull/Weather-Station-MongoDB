import pymongo
from datetime import datetime, timedelta
from random import randint
import copy

client = pymongo.MongoClient()
db = client.weather_station
measurements = db.measurements

temp_min = 10
temp_max = 40
brightness_min = 10
brightness_max = 70
delta_time_min = 20
delta_time_max = 30

first_date = datetime(2017, 8, 1, 0, 5)
last_date = datetime(2017, 12, 31, 0, 0)


datetime_cursor = copy.deepcopy(first_date)

#insert 4 consecutive months of measurements
#one measurement every 25 minutes
while datetime_cursor <= last_date:
    measurement = {
        'temperature': float(randint(temp_min, temp_max)),
        'brightness': randint(brightness_min, brightness_max),
        'room': 'chamber',
        'date': datetime_cursor
    }
    measurements.insert_one(measurement)
    print measurement
    datetime_cursor = datetime_cursor + timedelta(minutes=25)

first_date = datetime(2018, 2, 1, 0, 0)
last_date = datetime(2018, 4, 1, 0, 0)
datetime_cursor = copy.deepcopy(first_date)

while datetime_cursor <= last_date:
    measurement = {
        'temperature': float(randint(temp_min, temp_max)),
        'brightness': randint(brightness_min, brightness_max),
        'room': 'chamber',
        'date': datetime_cursor
    }
    measurements.insert_one(measurement)
    print measurement
    datetime_cursor = datetime_cursor + timedelta(minutes=25)
