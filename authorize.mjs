import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

let creds = {
		client_id:process.env.CLIENT_ID,
		client_secret:process.env.CLIENT_SECRET,
		grant_type:process.env.GRANT_TYPE
};

let request = {
    method:'POST',
    headers:{ "Content-Type": "application/json" },
    body:JSON.stringify(creds)
};

console.log(request);

fetch(process.env.AUTH_URL,request)
    .then (res => res.json())
    .then (text => console.log(text))
    .then (data => {
    	console.log(data['data'][0]['access_token'])
    	process.env.TOKEN = "Bearer "+data['data'][0]['access_token'];
    })
    
