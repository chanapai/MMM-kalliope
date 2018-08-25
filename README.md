# MMM-kalliope forked to work with Mycroft's magic-mirror-voice-control-skill

Module to bind Mycroft using the magic-mirror-voice-control-skill with your Magic Mirror.

This module allow you to:
- show user utterances and Mycroft's response on the screen
- control your Magic Mirror by sending notification to other active modules

> **Note:** On Kalliope, [a neuron is available](https://github.com/kalliope-project/kalliope_neuron_magic_mirror) to talk with this module directly.

[Video demo with sound here](https://www.youtube.com/watch?v=qoIKgChFubY)

## Installation

Clone this repo into `~/MagicMirror/modules` directory.

Configure your `~/MagicMirror/config/config.js`:

```js
{
    			module: "MMM-kalliope",
    			position: "upper_third",
    			config: {
        			max: "4",
				title: "Mycroft",
				keep_seconds: "0"
    			}
		},
```

## Configuration option

| Option       | Default  | Description                                                                                                |
|--------------|----------|------------------------------------------------------------------------------------------------------------|
| max          | 5        | How many messages should be keept on the screen.                                                           |
| keep_seconds | 5        | Number of seconds received messages will stay displayed. Set to 0 to work with Mycroft |
| title        | Kalliope | The name placed above received messages                                                                    |

## API documentation

#### POST /kalliope/

Query parameters

| Parameter    | Description                                                                                                                                               |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| notification | The notification identifier. If set to "KALLIOPE", the payload will be printed by the module. In other case the notification is sent to all other modules |
| payload      | A notification payload to pass to the module. Can use plain text or JSON.                                                                                 |

## Curl examples

This command will send a message that will be printed by the MMM-kalliope module
```
curl -H "Content-Type: application/json" -X POST -d '{"notification":"KALLIOPE", "payload": "my message"}' http://localhost:8080/kalliope
```


Here the notification is sent to the alert module.
```
curl -H "Content-Type: application/json" -X POST -d '{"notification":"SHOW_ALERT", "payload": {"title": "mytitle", "message": "this is a test", "timer": 5000}}' http://localhost:8080/kalliope
```

## How to control my MM module from this module

All notifications that are not concerned by this module (when the notification name is not "KALLIOPE") will be send to other installed module on your Magic Mirror.

To add a notification receptor to your module, you just need to implement the `notificationReceived` method like bellow.

```js
notificationReceived: function(notification, payload){
		....

		if (notification === "NOTIFICAION_NAME" && payload=="bla"){
			// Do some magic here with your module
		}

		if (notification === "NOTIFICAION_NAME" && payload=="blablabla"){
			// Do some magic here with your module
		}

		....
},
```
