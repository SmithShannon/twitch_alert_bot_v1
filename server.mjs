import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import http from 'http';
import fs from 'fs';
import path from 'path';
import async from 'async';
import money from 'money';

let m = []

//let locked = false;

http.createServer (function(req,res){
	let __dirname = path.resolve();
	let data = 0;
	
	//res headers
	console.log(req.headers)
	res.setHeader('Retry-After','1');
	if (req.url.includes('media')){
		if (req.url.includes('mp3')){
			res.writeHead(200,{'Content-Type':'audio/mp3'});
		} else {
			res.writeHead(200,{'Content-Type':'video/webm'});
		}
	}
	else if (req.headers['twitch-eventsub-message-id']!=null || req.headers['user-agent'].includes("Stripe/1.0")){
		res.setHeader ('Content-Type', 'application/json');
	} else {
		res.setHeader ('Content-Type','text/html');
	}
	
	req.on ('data',chunk => {
		try{
			data = JSON.parse(chunk);
			console.log(data);
			let username = "";
			let media = "";
			let duration = 0;
			let type = "";
			if (req.headers['user-agent'].includes("Stripe/1.0")){
				type = data.object.object;
			} else if (req.headers['twitch-eventsub-message-id']!=null){
				type = data.subscription.type;
			} else {
				type = data.type;
			}

			switch (type){
				case 'channel.follow':
					username = data.event.user_name;
					media = "\"<audio "
						+ "id='alert' "
						+ "src='/media/follow_overlay.mp3' "
						+ "type='audio/mp3' "
						+ "onended='window.setTimeout(location.reload(),4000)'"
						+ "></audio>"
						+ "<p>Welcome to the family "+username+".</p>\"";
				break;
			    	case 'channel.raid':
			    		username = data.event.from_broadcaster_user_name;
			    	   	let raiders = data.event.viewers;
			    	   	if (raiders==1){
			    	   		media = "\"<video "
				    	   	    + "id='alert' "
				    	   	    + "width='480' " 
				    	   	    + "height='270' "
				    	   	    + "src='/media/host.webm' "
				    	   	    + "type='video/webm' "
				    	   	    + "onended='window.location.reload()'"
				    	   	    + "></video>"
				    	   	    + "<p>"+username+" is hosting!  Spread the love while offline!</p>\"";
			    	   	} else {
				    	   	media = "\"<video "
				    	   	    + "id='alert' "
				    	   	    + "width='480' " 
				    	   	    + "height='270' "
				    	   	    + "src='/media/raid_clip.webm' "
				    	   	    + "type='video/webm'"
				    	   	    + "onended='window.location.reload()'"
				    	   	    + "></video>"
				    	   	    + "<p>"+username+" has raided us with "+raiders+".  Praise these pilgrams!</p>\"";
			    	   	}
			    	break;
			    	case 'channel.goal.progress':
			    		process.env.GOAL_CURRENT = data.event.current_amount;
			    		process.env.GOAL_TARGET = data.event.target_amount;
			    		process.env.GOAL_TITLE = data.event.description;
			    	break;
			    	case 'channel.goal.end':
			    		media = "\"<video "
			    			+ "id='alert' "
			    			+ "width='1080' "
			    			+ "height='720' "
			    			+ "src'/media/fireworks.webm' "
			    			+ "type='video/webm' " 
			    			+ "onended='window.location.reload()'"
			    			+ "></video>\""
			    	break;
			    	case 'chat.lurk':
					username = data['display-name'];
					media = "\"<audio "
						+ "id='alert' "
						+ "src='/media/lurk.mp3' "
						+ "type='audio/mp3' "
						+ "autoplay "
						+ "onended='window.location.reload();'"
						+ "> </audio>"
						+ "<p>"+username+" is lurking.</p>\"";
			    	break;
			    	case 'chat.unlurk':
					username = data['display-name'];
					media = "\"<audio "
						+ "id='alert' "
						+ "src='/media/unlurk.mp3' "
						+ "type='audio/mp3' "
						+ "onended='window.location.reload();'"
						+ "> </audio>"
						+ "<p>"+username+" has returned.</p>\"";
			    	break;
			    	case 'checkout_session':
			    		let number = money.convert(data.object.amount_total,{from:data.object.currency,to:"CAD"});
			    		username = data.object.customer;
			    		switch (number){
			    			case 2.19:
				    			media = "\"<video "
					    	   	    + "id='alert' "
					    	   	    + "width='480' " 
					    	   	    + "height='270' "
					    	   	    + "src='/media/tea.webm' "
					    	   	    + "type='video/webm'"
					    	   	    + "onended='window.location.reload()'"
					    	   	    + "></video>"
					    	   	    + "<p>"+username+" bought me a tea!  Thanks!</p>\"";
			    			break;
			    			case 8.15:
				    			media = "\"<video "
					    	   	    + "id='alert' "
					    	   	    + "width='480' " 
					    	   	    + "height='270' "
					    	   	    + "src='/media/beer_dono_tier.webm' "
					    	   	    + "type='video/webm'"
					    	   	    + "onended='window.location.reload()'"
					    	   	    + "></video>"
					    	   	    + "<p>"+username+" bought me a beer at the bar!  Thank you for the alcolhol.</p>\"";
			    			break;
			    			case 25.30:
				    			media = "\"<video "
					    	   	    + "id='alert' "
					    	   	    + "width='480' " 
					    	   	    + "height='270' "
					    	   	    + "src='/media/dinner.webm' "
					    	   	    + "type='video/webm'"
					    	   	    + "onended='window.location.reload()'"
					    	   	    + "></video>"
					    	   	    + "<p>"+username+" bought me a prime meat dinner. So tasty!  Will enjoy!  Thank you!</p>\"";
			    			break;
			    			default:
			    				media = "<p>"+username+" donated $CAD"+number+".  Thank you for your support.</p>";
			    			break;
			    		}
			    	break;
			}
			m.push([media,duration]);
			res.write(media);
			
			res.end();
		} catch (err){
			console.log(err);
			data = 0;
		}
	});
	
	req.on ('end', () => {
		if (req.url.includes('media')){
			fs.readFile(path.join(__dirname+req.url),function(err,data){
				res.write(data);
				res.end();
			});
		} else if (req.url.includes('goals')){
			let ticks = process.env.GOAL_CURRENT/process.env.GOAL_TARGET*100;
			let green = "l".repeat(ticks);
			let red = "l".repeat(100-ticks);
			let html = "<!DOCTYPE html>"
				+ "<html>"
				+ "<head>"
				+ "<style>"
				+ "div#holder {"
				+ "margin: auto;}"
				+ "h3 {-webkit-text-stroke:2px black; "
				+ "font-family: cursive; "
				+ "color: red;"
				+ "font-size: 50px;"
				+ "text-align: right;"
				+ "line-height: 0.3}"
				+ "p {font-family:sans-serif;"
				+ "font-size: 40px;"
				+ "text-align:right;"
				+ "letter-spacing: -6px;"
				+ "border: 1px;}"
				+ "span.green {"
				+ "color: green;}"
				+ "span.red {"
				+ "color: red;}"
				+ "</style>"
				+ "</head>"
				+ "<body><div id='holder'>"
				+ "<h3>"+process.env.GOAL_TITLE+"</h3>"
				+ "<h3>"+process.env.GOAL_CURRENT+"/"+process.env.GOAL_TARGET+"</h3>"
				+ "<p><span class='green'>"+green+"</span><span class='red'>"+red+"</span></p>"
				+ "</div>"
				+ "<script type='text/javascript'>window.location.reload();</script>"
				+ "</body></html>";
			res.write(html);
			res.end();
		} else {
			let script = "";
			let element = "";
			if (m.length == 0){
				script = "<script type='text/javascript'>"
					+ "window.location.reload();"
					+ "</script>";
			} else {
				element = m[0];
				console.log(element);
				script = "<script type='text/javascript'>"
					+ "const element = "+element[0]+";"
					+ "document.getElementById('holder').innerHTML = element;"
					+ "p = document.getElementById('alert');"
					+ "p.play();"
					+ "</script>";
				setTimeout(function(){m.pop();},1000);
			}
				
				//queue = [];
			let html = "<!DOCTYPE html>"
				+ "<html>"
				+ "<head>"
				+ "<style>"
				+ "div#holder {align-items: center;"
				+ "margin: auto;}"
				+ "#alert{ margin-left: auto;"
				+ "margin-right: auto;"
				+ "display:block;"
				+ "opacity: 0.8;}"
				+ "p {-webkit-text-stroke:1px black; "
				+ "font-family: cursive; "
				+ "color: red;"
				+ "font-size: 50px;"
				+ "text-align: center;}"
				+ "</style>"
				+ "</head>"
				+ "<body><div id='holder'></div>"
				+ script +
				+ "</body></html>"
			res.write(html);
			res.end();
		}
	});
}).listen(8080);
