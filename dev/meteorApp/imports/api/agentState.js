import { Mongo } from 'meteor/mongo';
 
export const __agentState__ = new Mongo.Collection('AGENT_STATE');

export const __speakEvents__ = new Mongo.Collection('SPEAK_EVENTS');

export const __allEvents__ = new Mongo.Collection('ALL_EVENTS');
