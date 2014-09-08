/*!
CHRONOS: uncoupled undo/redo manager for web apps
v0.1.0, Sergi Meseguer @zigotica
https://github.com/zigotica/chronosJS/

Depends on:
jQuery http://jquery.com/
jQuery Tiny Pub/Sub https://github.com/cowboy/jquery-tiny-pubsub
*/

Chronos = {
    states  : [],
    current : -1,
    undoElm : "#undo",
    redoElm : "#redo",

    init : function(){
        $.subscribe("save.chronostate", this.save);
        $.subscribe("discard.chronostate", this.discard);
    },

    save : function( e, what ){
        // e not used, needed as per "jQuery Tiny Pub/Sub" requirement
        var ns      = Chronos,
            title   = what.title,
            content = what.content;
        
        // console.log("PUBSUB SYSTEM - SAVE NEW CHRONO STATE", title);
        if(ns.current > -1 && ns.current < ns.states.length - 1) {
            // discard rest since we are rewriting the history from the middle
            ns.states = ns.states.slice( 0, ns.current + 1);
        }
        // now we can add at the end, always correct position 
        ns.current ++;
        ns.states.push( {"id": ns.current, "title": title, "content": content });

        // update button states
        ns.updateButtons();
    },

    discard : function(e, what){
        // e not used, needed as per "jQuery Tiny Pub/Sub" requirement
        var ns      = Chronos,
            title   = what.title,
            content = what.content;

        // console.log("PUBSUB SYSTEM - DISCARD LAST CHRONO STATE", title);
        ns.states[ns.current] = {"id": ns.current, "title": title, "content": content };
    },

    undo : function(){
        // enabled/disable logic at updateButtons()
        this.current --;

        // rewrite from states array
        this.rewrite();
    },

    redo : function(){
        // enabled/disable logic at updateButtons()
        this.current ++;

        // rewrite from states array
        this.rewrite();
    },

    rewrite : function(){
        $.publish("rewrite.chronostate", this.states[this.current]);

        // update button states
        this.updateButtons();
    },

    updateButtons : function(){
        // undo
        if(this.current > 0) {
            $(this.undoElm).prop("disabled", false);
        }
        else {
            $(this.undoElm).prop("disabled", true);
        }
        // redo
        if(this.current > -1 && this.current < this.states.length - 1) {
            $(this.redoElm).prop("disabled", false);
        }
        else {
            $(this.redoElm).prop("disabled", true);
        }
    }
};
Chronos.init();