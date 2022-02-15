import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import open from 'open';

//get broadcaster id


let request = {
    method:'GET',
    headers: {
	'Client-ID': process.env.CLIENT_ID,
	'Authorization': process.env.TOKEN,
	'Content-Type': 'application/json'
	}
};

console.log(request);

let id = await fetch('https://api.twitch.tv/helix/users?login=mikodite_yvette',request)
    .then (res => res.json())
    .then(data=>{ 
    	return data['data'][0]['id'];
    })
    
console.log(id);


let sublist = [
	"channel.follow",
	"channel.subscribe",
	"channel.subscription.gift",
	"channel.subscription.message",
	"channel.raid",
	"channel.cheer",
	"extension.bits_transaction.create",
	'channel.goal.begin',
	"channel.goal.progress",
	"channel.goal.end",
	"channel.ban",
	"channel.unban"
];

let subs = sublist.map(function (x) {
	let sub = {
	  version: "1",
	  type: x,
	  condition: {
	    broadcaster_user_id: id,
	    to_broadcaster_user_id:id
	  },
	  transport: {
	    method: "webhook",
	    callback: "https://events.hookdeck.com/e/src_mnIcaKuCZVjRaKLupNqFCjOq",
	    secret: process.env.SUB_SECRET
	  }
	};
	fetch ("https://api.twitch.tv/helix/eventsub/subscriptions", {
	  method:'POST',
    	  headers: {
		'Client-ID': process.env.CLIENT_ID,
		'Authorization': process.env.TOKEN,
		'Content-Type': 'application/json'
	  },
	  body:JSON.stringify(sub)
	  
  }  )
  .then(res => res.json())
  .then(data => console.log(data));
});


console.log(process.env.SUB_SECRET);
    
//let broad_id = res['id'];

//console.log(broad_id);
