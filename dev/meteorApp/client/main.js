import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import Agent from '../imports/ui/Agent.js';
import Wizard from '../imports/ui/Wizard.js';
import '../imports/api/globals.js'
 
Meteor.startup(() => {

  	// render(<Agent state='inactive'/>, document.getElementById('render-target'));
});

FlowRouter.route( '/', {
  name: 'blank',
  action() {
    console.log('routed to blank');
  }
});


FlowRouter.route( '/agent', {
  name: 'agent',
   action() {
    console.log('routed to agent');
    $(document).ready(function () {
    	$.getScript('http://code.responsivevoice.org/responsivevoice.js', function(){
    		render(<Agent voice={responsiveVoice} audioMode={AUDIO_MODES.onoff}/>, document.getElementById('render-target'));
    	});
    	
    });
  }
});



FlowRouter.route( '/wizard', {
  name: 'wizard',
  action() {
    console.log('routed to wizard');
    $(document).ready(function () {
    	// get url params and participant number
    	// pull the audio mode for this participant
    	// pass in the mode, and let agent know about it
    	render(<Wizard />, document.getElementById('render-target'));
    });
  }
});