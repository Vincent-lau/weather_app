# Weather alert service

To run this service, create a .env file and add the following line to it

```text
WEATHER_API_KEY=<your-open-weather-api-key>
````

And the run `npm start` to start the server, it will be listening to port 3000.

And you can test it using curl (or any other clients that can send http request)

```sh
curl -X POST http://localhost:3000/subscribe -H "Content-Type: application/json" -d '{"phone": "+1234567890", "city": "New York"}'

curl http://localhost:3000/weather-alerts
```
