chronosJS
==================

ChronosJS is a simple, generic, uncoupled undo/redo manager for web apps (not tied to URL or History Interface)

## Dependencies

* [jQuery](http://jquery.com/) 
* [jQuery Tiny Pub/Sub](https://github.com/cowboy/jquery-tiny-pubsub)


## Setup

1. Add undo/redo buttons in your HTML:  

        <button onclick="Chronos.undo()" id="undo">undo</button>
        <button onclick="Chronos.redo()" id="redo">redo</button>

    We could/should add them using JS, but decided to keep the script at its simplest.

2. (Optionally) modify undo/redo ID's in your HTML then also in chronos.js file:  

        Chronos = {
    		…
    		undoElm : "#undo",
    		redoElm : "#redo",
    		…
 
3. Link the scripts at the end of your HTML. Or concatenate them using your preferred build tool (again, left this module at its simplest on purpose).  

        <script src="js/jq.js"></script>
        <script src="js/pubsub.js"></script>
        <script src="js/chronos.js"></script>


4. Chronos initializes itself, you just need to define two channels: what to do when something is "saved" as a state, and what to do when something is "loaded" from saved states. 

## "save" channel

When `Chronos.init()` runs (it executes automatically) it basically sets up **Chronos to LISTEN for your app** to send messages to Chronos states array. You basically need to define what these messages are **in your app module**. Typically you will send object properties previously converted to string with JSON.stringify… For instance, define:

        $.publish("save.chronostate", {
            "title": "new action", 
            "content": "my content for this state"
        }); 

This piece of code in your app sends a message to Chronos, which is subscribed to channel `save.chronostate`. Whenever your app sends that message (**you decide when to save a state**), Chronos will listen to it, and will handle an internal callback to add a new entry to Chronos states array. You should not need to modify that callback nor the logic behind it. 


## "load" channel

We also need a second channel for this undo/redo thing to work. Your **app will LISTEN for Chronos** to send it messages in order to retrieve states info. To achieve this, you will need to subscribe to the load channel **in your app "init" method** and generate a function than handles that callback:

        App.init = function() {
            … 
        	$.subscribe("load.chronostate", loadRecord); 
        	…
        
This piece of code in your app subscribes to channel `load.chronostate`. **User actions on undo/redo buttons makes chronos send messages through this channel**. You decide what to do with that info, so you need to **add a callback in your app** to manage the new state retrieved from chronos:
        
        loadRecord : function( e, JSON ){
            // e not used, needed as per "jQuery Tiny Pub/Sub" requirement / jQuery design
            // do what you want here to handle this state, render a view, …
            // console.log("PUBSUB SYSTEM - LOAD FROM CHRONO STATE", JSON.title, JSON.content);
        }


## Status
Use at your own risk.

## Todo

* [ ] more magic

## License
[FreeBSD](http://github.com/zigotica/chronosjs/blob/master/LICENSE.txt)
