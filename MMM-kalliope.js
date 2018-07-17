/* global Module */

class Message {
    constructor(text) {
        this.text = text;
        this.timestamp = new Date();
    }
}

Module.register('MMM-kalliope',{
    // list of messages to print on the screen
    messages: [],

    // Default module config.
	defaults: {
        max: 5,
        keep_seconds: 5,
        title: "Kalliope"
    },

    start: function() {
        // need to connect to the node helper
        this.sendSocketNotification("CONNECT", null);

        console.log("Starting module: " + this.name);

        //Update DOM every minute so that the time of the call updates and calls get removed after a certain time
		setInterval(() => {
			this.updateDom();
    }, 1000);

        // only clean old messages if keep_seconds is set
        if (this.config.keep_seconds > 0){
            setInterval(() => {
                this.cleanOldMesssage();
            }, 1000);
        }
    },

    cleanOldMesssage: function() {
        var currentDate = new Date();

        for(var i = 0; i < this.messages.length; i++){
            var dif = currentDate.getTime() - this.messages[i].timestamp.getTime();
	          var allMessagesCombined = this.messages.join(" ");
	          var secondsFromCurrentDateToMessageDate = dif / 1000;
            var secondsBetweenDates = Math.abs(secondsFromCurrentDateToMessageDate);
            var allMessagesLength = allMessagesCombined.length
	          if (allMessagesLength > 150){
              var totalSeconds = 10;
              if (secondsBetweenDates > totalSeconds){
                this.messages.splice(i, 1);
              }
              continue;

            }
	    // delete the message if to old
            if (secondsBetweenDates > this.config.keep_seconds){
                this.messages.splice(i, 1);
            }
        }
    },

    // Override dom generator
	getDom: function() {
        var wrapper = document.createElement("div");

        if (this.messages.length  == 0){
            wrapper.innerHTML = "";
            return wrapper
        }

	var title = document.createElement("div");
	var mycroftIcon = document.createElement("img");
	//mycroftIcon.className = "badge";
	mycroftIcon.src = "modules/MMM-kalliope/images/mycrofticon.png";
	title.className = "bright medium light";
	title.innerHTML = this.config.title;
	wrapper.appendChild(mycroftIcon)
	wrapper.appendChild(title);


        var table = document.createElement("table");

        for(var i = 0; i < this.messages.length; i++){

            var row = document.createElement("tr");
            table.appendChild(row);

            var messageCell = document.createElement("td");
			messageCell.innerHTML =  this.messages[i].text
			row.appendChild(messageCell);
        }
        wrapper.appendChild(table);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
	if (notification == "KALLIOPE"){
            // create new message object
            var newMessage = new Message(payload);

            this.messages.push(newMessage);

            // clean old messages if list is too long
            while(this.messages.length > this.config.max){
                this.messages.shift();
            }

        }else{
            // forward the notification to all modules
            this.sendNotification(notification, payload);
        }


    },

    notificationReceived: function(notification, payload, sender) {
        if (sender) {
            Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
            Log.log(payload);
        } else {
            Log.log(this.name + " received a system notification: " + notification);
        }
    }
});
