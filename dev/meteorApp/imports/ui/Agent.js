import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { __agentState__, __speakEvents__, __allEvents__ } from '../api/agentState.js';
import '../css/clientstyle.css'
import '../api/globals.js'
import Sound from 'react-sound';
import { Tracker } from 'meteor/tracker'

class Agent extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			timeoutFunc: null,
			currenttime: 0,
		}
		
		this.activeSound = this.renderSound("active-short.wav", "activeSound");
		this.inactiveSound = this.renderSound("inactive.mp3", "inactiveSound");
		this.contSound = this.renderSound("cont_active.mp3", "contSound");

console.log("inside constructor");
		this.oldState = this.props.state;
		// this.startTimer = this.startTimer.bind(this);
		// this.startTimer();

		Tracker.autorun(() => {
		  var doc = __agentState__.findOne({"key": "agentState"});
		  var mystate = "unloaded";
		  if (doc) {
		  	this.callbackStateUpdate(this.oldState, doc.value);
		  }

		});

	}

	callbackStateUpdate(oldState, newState) {
		console.log("inside callbackStateUpdate. Oldstate is " + oldState + ", new state is " + newState);
		this.soundInterface(oldState, newState);
		this.oldState = newState;

	}


	renderSound(filename, elemId) {
		return (<audio id={elemId} src={filename} controls hidden="true"/>);
	}
	
	// startTimer() {
	//       this.timer = setTimeout( function () {
	//       	if (this.state.currenttime != 0) {
	// 	     	this.setState( {
	// 	     		currenttime: this.state.currenttime - 1,
	// 	     	});
	//       	}
	//       	this.startTimer();

	//       }.bind(this), 1000);
	// }


	endSpeakingCallback() {
		console.log("end speaking callback");

		if (this.props.state == AGENT_STATES.inactive) {
			return;
		}

		this.updateAgentState(AGENT_STATES.countdown)
		this.props.countdownReset = false;
		var timeout = setTimeout(function(){
            // console.log("6 seconds elapsed");
            if (this.props.state == AGENT_STATES.countdown) {
            	this.updateAgentState(AGENT_STATES.inactive);
            	this.setState( {
					currenttime: 0,
				});
            }
        }.bind(this), 6000);

		this.setState( {
				timeoutFunc: timeout,
				currenttime: 6,
			});
	}


	startSpeakingCallback() {
		window.clearTimeout(this.state.timeoutFunc);
		this.updateAgentState(AGENT_STATES.speaking);
	}

	soundInterface(oldState, newState) {
		console.log('inside soundInterface');

		switch (this.props.audioMode) {
			case AUDIO_MODES.nosound:
				console.log("no sound");
				break;

			case AUDIO_MODES.onoff:
				console.log("onoff sound");
				if ((oldState == AGENT_STATES.inactive) && (newState == AGENT_STATES.active)){
					console.log("ready to play ON sound");
					document.getElementById('activeSound').play();

				} else if (newState == AGENT_STATES.inactive) {
					console.log("ready to play OFF sound");
					document.getElementById('inactiveSound').play();

				}
				break;

			case AUDIO_MODES.continuous:
				console.log("continuous sound");
				if ((oldState == AGENT_STATES.inactive) && (newState == AGENT_STATES.active)){
					console.log("ready to play ON sound");
					document.getElementById('activeSound').play();
				}

				if (newState == AGENT_STATES.inactive) {
					console.log("ready to play OFF sound");
					document.getElementById('inactiveSound').play();
				}

				if (newState == AGENT_STATES.countdown) {
					console.log("in countdown mode");
					document.getElementById("contSound").loop = true;
					document.getElementById("contSound").play();
				} else {
					document.getElementById("contSound").pause();
					document.getElementById("contSound").currentTime = 0;
				}


				break;

			default:
				break;

		}
	}

	updateAgentState(newState) {
		var doc = __agentState__.findOne({"key": "agentState"});
		var oldState = doc.value;
	    // if (doc) {
	    	__agentState__.update({"_id": doc._id}, {$set:{value:newState}});
	    // }	
	    __allEvents__.insert({event: "agentChangeState", fromState:oldState, toState: newState, date: Date.now()});
	    
	} 



	sayThis(text) {
		var synth = window.speechSynthesis;
		var utterThis = new SpeechSynthesisUtterance(text);
		utterThis.onend = this.endSpeakingCallback.bind(this);
		utterThis.onstart = this.startSpeakingCallback.bind(this);
		synth.speak(utterThis);
	}


	sayThings() {
		if (this.props.state == AGENT_STATES.inactive) {
			console.log("Can't speak from inactive state");
			return;
		}

		if (this.props.utterance) {
			this.sayThis(this.props.utterance.text);
			__speakEvents__.update({ _id: this.props.utterance._id }, {$set:{status:"spoken"}});
		}
	}

	cancelSpeaking() {
		var unsatisfiedRequest = __allEvents__.findOne({event: "wizardRequestCancelSpeaking", attended:false });
		if (unsatisfiedRequest) {
			__allEvents__.update({"_id": unsatisfiedRequest._id}, {$set: {attended:true}});
			var synth = window.speechSynthesis;
			synth.cancel();	
		}
		
	}

	render() {
		this.sayThings();

		var currentState = this.props.state;
		// console.log("currentState is " + currentState);

		var activeCircle = "center circle " + AGENT_STATES.inactive;
		var isHidden = true;

		if ((currentState == AGENT_STATES.active) || (currentState == AGENT_STATES.countdown)) {
			activeCircle = "center circle " + "activeCircle"; // AGENT_STATES.active;
		} 

		if (currentState == AGENT_STATES.speaking) {
			activeCircle = "center circle " + "activeCircle"; // AGENT_STATES.active;
			isHidden = false;
		} 

		// if wizard requests to cancel speaking
		if (!this.props.requestCancelSpeaking) {
			this.cancelSpeaking();
		}


// <h1>{this.state.currenttime}</h1>
		return (
			<div className="background">
				
				<div className={activeCircle} id="overlay_center"></div>
				<div className="center circle pulsating_ring" hidden={isHidden} id="overlay_speaking"></div>

				{this.activeSound}
				{this.inactiveSound}
				{this.contSound}
			</div>
		);
	}
}




export default withTracker(() => {
	// console.log("inside withTracker");

	var stateProp = 'inactiveUnloaded';
	var doc = __agentState__.findOne({'key': 'agentState'});
    if (doc) {
    	stateProp = doc.value;
    }

    var utterance = __speakEvents__.findOne({"status": "unspoken"});

	var doc1 = __allEvents__.findOne({event: "wizardRequestCancelSpeaking", attended:false});
	var requestCancelSpeaking = false;
	if (doc1) {
		requestCancelSpeaking = doc1.attended;	
	}

	

	
	return {
		utterance: utterance,
    	state: stateProp,
    	requestCancelSpeaking: requestCancelSpeaking,

  	};
})(Agent);
