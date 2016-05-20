import { Meteor } from 'meteor/meteor';

const Messages = new Meteor.Collection('messages');

Meteor.publish('messages', () => Messages.find());

Meteor.methods({
    getMessage(id) { return Messages.findOne(id) },
    getMessages() { return Messages.find().fetch() },
    addMessage(from, message) { return Messages.insert({from, message}) },
    removeMessage(id) { return Messages.remove(id) }
});

Messages.deny({
    insert() {return true;},
    update() {return true;},
    remove() {return true;}
});
