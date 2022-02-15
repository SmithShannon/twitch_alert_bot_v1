import dotenv from 'dotenv';
dotenv.config();
import tmi from 'tmi.js';
import fetch from 'node-fetch';

let opts = {
	identity: {
		username:/*bot username*/,
		password: process.env.BOT_AUTH
	},
	channels: [
		//your channel as a string here
	]
};

let client = new tmi.client(opts);

client.on('message',onMessageHandler);
client.on('connected',onConnectedHandler);

client.connect();

function onMessageHandler(target,context,msg,self){
	if (self) {return;}
	
	console.log(target);
	console.log(context);
	console.log(msg);
	console.log(self);
	
	let commandName = msg.trim();
	//This is where the magic happens.  Change it for your channel
	if (commandName == '!discord'){
		client.say(target,"Join the discord at: https://discord.gg/2er2ss6pTg and hang with Mikodite and co after stream!")
	} else if (commandName == '!donate'){
		client.say(target,"Support the stream at any of the following tiers:"
		+ "\nBuy me a tea: https://buy.stripe.com/3cs28x1980wz5MYaEE"
		+ "\nBuy me a beer: https://buy.stripe.com/28oeVj8BAa79fnydQR"
		+ "\nBuy me dinner: https://buy.stripe.com/8wMbJ70540wzfny5km"
		+ "\nCustom amount: https://buy.stripe.com/fZeaF30541ADa3e28c");
	} else if (commandName == '!lurk'){
		context['type'] = "chat.lurk";
		fetch("http://localhost:8080/webhooks", {
			method:"POST",
			headers: {'Content-Type':'application/json'},
			body:JSON.stringify(context)
		});
		client.say(target,context['display-name']+" is lurking.  Their view is as good as anyones.")
	} else if (commandName == '!unlurk'){
		context['type'] = "chat.unlurk";
		fetch("http://localhost:8080", {
			method:"POST",
			headers: {'Content-Type':'application/json'},
			body:JSON.stringify(context)
		});
		client.say(target,context['display-name']+" has returned.  Praise them!")	
	}
}

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  //this is how to do reoccuring messages that are not responses to chatters.
  setInterval(function (){
  	client.say("#mikodite_yvette","Hello and welcome to the chat.  Chat commands are !discord, !donate, !lurk and !unlurk.  Mikodite does read chat so don't be afriad to say hello if you are not lurking.  Thank you and have fun!")},3600000);
}
