import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { __agentState__, __speakEvents__, __allEvents__ } from '../api/agentState.js';
import { Tabs, Tab, ListGroup, ListGroupItem, Grid, Row, Col, Button, Nav, NavItem } from 'react-bootstrap';
import Instruction from './Instruction.js'
import '../css/bootstrap.min.css'
import '../api/globals.js'
import '../css/wizardstyle.css'

class Wizard extends Component {
	constructor(props) {
    	super(props);

	}

	componentWillMount(){
		console.log("component will mount");
		document.addEventListener("keydown", this._handleKeyDown.bind(this));
	}


	componentWillUnmount() {
		console.log("component will unmount");
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
	}

	getCurrentAgentState() {
		var doc = __agentState__.findOne({"key": "agentState"});
		if (doc) {
			return doc.value;
		}
	    return "unloaded";
	}

	updateState(newState) {

		var oldState = this.getCurrentAgentState();
		// var oldState = "inactive";
		var doc = __agentState__.findOne({"key": "agentState"});
	 //    // if (doc) {
	 //    	oldState = doc.value;
	    	__agentState__.update({"_id": doc._id}, {$set:{value:newState}});
	    	__allEvents__.insert({event: "wizardChangeState", fromState:oldState, toState: newState, date: Date.now()});
	    	// console.log("Found valid value " + oldState);
	    // }

	    if (newState == AGENT_STATES.countdown) {
	    	setTimeout(function(){
	            console.log("6 seconds elapsed");
	            if (this.props.state == AGENT_STATES.countdown) {
	            	this.updateState(AGENT_STATES.inactive);
	            }
        	}.bind(this), 6000);
	    }
	}

	requestCancelSpeaking() {
		__allEvents__.insert({event: "wizardRequestCancelSpeaking", attended:false, date: Date.now()});
	}


	_handleKeyDown = event => {
		// console.log(event.keyCode);
		if (document.activeElement.id == 'customtext') {
			if (event.keyCode == 13) {
				this.customSay();
			}
			return 
		}

		switch( event.keyCode ) {
			case 27:
				console.log("escape");
				this.updateState(AGENT_STATES.inactive);
				this.requestCancelSpeaking();
				break;

			case 67:
				console.log("pressed c");
				this.updateState(AGENT_STATES.active);
				this.requestCancelSpeaking();

			case 65:
				console.log("active");
				this.updateState(AGENT_STATES.active);
				break;

			case 87:
				console.log("countdown");
				if (this.getCurrentAgentState() == AGENT_STATES.active) {
					this.updateState(AGENT_STATES.countdown);	
				}
				break;

			default: 
				break;
		}
	};


	getInstructions(sectionName) {
		for (var section in myinstructions) {			
			secName = myinstructions[section]["sectionName"];
			if (secName == sectionName) {
				return myinstructions[section]["instructions"];
			}
		}
    	return [];
  	}

	renderInstructions(sectionName) {
		return this.getInstructions(sectionName).map((instr)  => (
			<Instruction key={instr._id} instr={instr} state={this.props.state}/>
		));
	}

	renderInstructions1(instructions) {
		return instructions.map((instr)  => (
			<Instruction key={instr._id} instr={instr} state={this.props.state}/>
		));
	}


	renderSubsections(sectionName) {
		var subsections = []
		for (var section in myinstructions) {			
			secName = myinstructions[section]["sectionName"];
			if (secName == sectionName) {
				subsections = myinstructions[section]["subsections"];
			}
		}

		return subsections.map((subsection) => (
			this.renderSubsection(subsection)
		));
	}


	renderSubsection(subsectionJson) {
		return (
			<div key={subsectionJson["_id"]}>
				<h1>{subsectionJson["subsectionname"]}</h1>
				{this.renderInstructions1(subsectionJson["instructions"])}
			</div>
		);
	}

	handleSelect(k) {
	  console.log(k);
	}


	renderNavbar() {
	    return (
			<div className="container">
				<div className="row">
					<ul className="nav nav-tabs">
						<li className="active"><a data-toggle="tab" href="#routine" onClick={this.handleSelect(this)}>Routine</a></li>
						<li><a data-toggle="tab" href="#elonmusk">Elon Musk</a></li>
						<li><a data-toggle="tab" href="#migraines">Migraines</a></li>
						<li><a data-toggle="tab" href="#sorting">Sorting machine</a></li>
						<li><a data-toggle="tab" href="#cube">Cube</a></li>
						<li><a data-toggle="tab" href="#recipe">Recipe</a></li>
					</ul>
				</div>
			</div>
	    	);
	  	}

	renderPanes() {
		return (
			<div className="container fullpagewidth">
				<div className="row fullpagewidth">
					<Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">

					  <Tab eventKey={1} title="Practice task">
					  	<Row>
						  	<Col md={6}>
						    	{this.renderSubsections("practice")}
						    </Col>

						    <Col md={3}>
						    	{this.renderSubsections("commonphrases")}  
						    </Col>
						    <Col md={3}>
						    	{this.renderSubsections("feedback")}  
						    </Col>
					  	</Row>
					  </Tab>

					  <Tab eventKey={2} title="Commands">
					  	<Row>
						  	<Col md={6}>
						    	{this.renderSubsections("commands")}
						    </Col>

						    <Col md={3}>
						    	{this.renderSubsections("commonphrases")}  
						    </Col>
						    <Col md={3}>
						    	{this.renderSubsections("feedback")}  
						    </Col>
					  	</Row>
					    
					  </Tab>

					<Tab eventKey={3} title="Elon Musk">
					  	<Row>
						  	<Col md={6}>
						    	{this.renderSubsections("elonmusk")}
						    </Col>

						    <Col md={3}>
						    	{this.renderSubsections("commonphrases")}  
						    </Col>
						    <Col md={3}>
						    	{this.renderSubsections("feedback")}  
						    </Col>
					  	</Row>
					  </Tab>


					   <Tab eventKey={4} title="Recipe">
					  	<Row>
						  	<Col md={6}>
						    	{this.renderSubsections("recipe")}
						    </Col>

						    <Col md={3}>
						    	{this.renderSubsections("commonphrases")}  
						    </Col>
						    <Col md={3}>
						    	{this.renderSubsections("feedback")}  
						    </Col>
					  	</Row>
					  </Tab>

					  <Tab eventKey={5} title="Cube">
					  	<Row>
						  	<Col md={6}>
						    	{this.renderSubsections("cube")}
						    </Col>

						    <Col md={3}>
						    	{this.renderSubsections("commonphrases")}  
						    </Col>
						    <Col md={3}>
						    	{this.renderSubsections("feedback")}  
						    </Col>
					  	</Row>
					    
					  </Tab>

					  <Tab eventKey={6} title="Migraines">
					  	<Row>
						  	<Col md={6}>
						    	{this.renderSubsections("migraines")}
						    </Col>

						    <Col md={3}>
						    	{this.renderSubsections("commonphrases")}  
						    </Col>
						    <Col md={3}>
						    	{this.renderSubsections("feedback")}  
						    </Col>
					  	</Row>
					  </Tab>



					</Tabs>
				</div>
			</div>
		);
	}


	customSay() {
		// console.log('test');
		if (this.getCurrentAgentState() == AGENT_STATES.inactive) {
			console.log("Can't speak from inactive state");
			return;
		}
		
		customText = document.getElementById("customtext").value;
		console.log(customText);
		__speakEvents__.insert({"text": customText, "status": "unspoken", 
			"date": Date.now()});
		document.getElementById("customtext").value = '';
	}


	renderControls() {

		return (
			<div>
				<ul>
					<li>Press 'a' to activate.</li>
					<li>Press Esc to cancel speaking and go inactive</li>
					<li>Press 'c' to stop talking but stay active.</li>
					<li>Press 'w' to go into countdown.</li>
				</ul>
			</div>
		);
	}


	render() {
		return (
			<div>
				<header>
					<div className="freezeNavbar">
						<Grid>
							<Row>
							  	<Col md={6}>
									<h1>State: {this.props.state}</h1>
									<input id="customtext" /> <Button onClick={this.customSay.bind(this)}>Say this.</Button>	    	
							    </Col>
							    <Col md={6}>
									{this.renderControls()}	    	
							    </Col>
							</Row>
						</Grid>	
					</div>
				</header>
				
				<div className="offsetTop">
					<Grid>
						{this.renderPanes()}
					</Grid>
				</div>
				
			</div>
		);
	}
}





export default withTracker(() => {

	var stateProp = 'inactiveUnloaded';
	var doc = __agentState__.findOne({'key': 'agentState'});
    if (doc) {
    	stateProp = doc.value;
    }
	
	return {
    	state: stateProp,
  	};
})(Wizard);