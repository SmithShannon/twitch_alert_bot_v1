# twitch_alert_bot_v1

Hello, and thank you for looking at this rep.  It sums up a project that I have done as part of my channel on Twitch.  It handles an alert system and the chatbot for my channel.

You may use the code for yourself, just remember:
1. It uses nodejs, so install that on your main machine
2. Install via 'npm install' to get all the needed libraries
3. Get a client ID and secret from Twitch, edit .env with this information, and run authenticate.mjs to get an OAUTH token
4. Use https://github.com/BarryCarlyon/twitch_misc to authenticate your channel for the event webhook subscriptions, then run webhook_subscriptions.mjs
5. Twitch uses webhooks, and you need an external endpoint to recieve them.  I use Hookdeck
6. Once set up and running, have your streaming software point to localhost:8080
7. Lastly, known issue, event do not queue.

