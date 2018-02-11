# Arduino/MangoDB/NodeJS Weather Station
## Project
This Arduino-based Wetaher Station permits to retrieve temperature and brightness (for now) on a local network trough your smartphone.
## Architecture
![alt text](https://github.com/MaxenceHull/Weather-Station-MongoDB/blob/master/architecture.png "Architecture")
## Software Technologies
* [PyMongo](https://api.mongodb.com/python/current/) (transfer data from the Python script to the database)
* [Mongoose](http://mongoosejs.com) (retrieve data from MongoDB using Javascript) 
* [MangoDB](https://www.mongodb.com) NoSQL database
* [Express](https://expressjs.com) Application Framework
* [PySerial](https://pythonhosted.org/pyserial/) Access the serial port (USB)
* I used a RESTful architecture on the webserver side
## Arduino
![alt_text](https://github.com/MaxenceHull/Weather-Station-MongoDB/blob/master/IMG_3895.jpg "Arduino")
The weather station only contains two sensors at the moment but will soon be improved with many more!
## Website
![alt_text](https://github.com/MaxenceHull/Weather-Station-MongoDB/blob/master/website.png "website")



