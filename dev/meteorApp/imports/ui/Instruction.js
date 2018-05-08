import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { __speakEvents__ } from '../api/agentState.js';
import { ListGroup, ListGroupItem, Grid, Row, Col, Button, Nav, NavItem } from 'react-bootstrap';
import '../api/globals.js'

class Instruction extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);  // BINDING IS NECESSARY TO ACCESS THIS IN THE CALLBACK
	}

	handleClick() {
		// console.log(this.props.instr.text + " was clicked");

		if (this.props.state == AGENT_STATES.inactive) {
			console.log("Can't speak from inactive state");
			return;
		}

		// update the speak events database
		__speakEvents__.insert({"text": this.props.instr.text, "status": "unspoken", 
			"date": Date.now()});
	}


	render() {
		return (
			<div>
			<ListGroupItem onClick={this.handleClick} >
        		{this.props.instr.text}
      		</ListGroupItem>
				
			</div>
			
      	);
	}
}

export default Instruction;

