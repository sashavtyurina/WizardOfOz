# WizardOfOz
An interface to run Wizard of Oz experiments with voice-based virtual assistants. The application is based on Meteor framework. 

# Overview
You might find this app useful, if you are running Wizard of Oz experiments with voice interfaces. The app is based on the [Meteor framework](https://www.meteor.com/). The interface has two web pages: [agent](dev/meteorApp/imports/ui/Agent.js) and [wizard](dev/meteorApp/imports/ui/Wizard.js). 

The Wizard page contains candidate answers you might want to use, they need to be figured out beforehand to make the interaction quick. However, there is also a text field that can be used in emergencies, if you need to deliver an answer, that is not on the soundboard. 

The Agent page only has a visual interface: a ball that changes color and size depending on wether the system state at the moment. There are 3 states: inactive, actively listening and speaking. After reading an answer, the system stays active for 5 seconds and then automatically switches to inactive, unless the Wizard explicitly changes the state. 

The state is maintained through a MongoDB record, that is updated by the Meteor functionality in realtime. All events are also logged to other tables. Python script [dbdump.py](dev/meteorApp/dbdump.py) will dump out the logs from those tables into a local json file. 

To get the application up and running, you should [create a new Meteor app](https://www.meteor.com/tutorials/react/creating-an-app), and install all dependencies. 

If you have any questions about this code, please do not hesitate to contact me at avtyurin at uwaterloo.ca
