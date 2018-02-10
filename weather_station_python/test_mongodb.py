import pymongo
import datetime
from pymongo import version

print version
uri = "mongodb://hulm2701:trq0vpNfuvIA2R7AbKGPV2lhpmJFSktZVnQrycVHFfvu8GfRvGDHea04YBN5n7HYXEEC3GLaSQfFX8ER1rgbYA==" \
      "@hulm2701.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"
client = pymongo.MongoClient()
db = client.weather_station
measurements = db.measurements
measurement = {
    'temperature': 24,
    'brightness': 52,
    'room': 'chamber',
    'date': datetime.datetime.utcnow()
}
bills_post = measurements.find_one({'room': 'chamber'})
print(bills_post)
#result = measurements.insert_one(measurement)
#print('One post: {0}'.format(result.inserted_id))



