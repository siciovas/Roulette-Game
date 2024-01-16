# Roulette Game 

* API URL input field: There should be a reactive input field for that. (https://dev-games-backend.advbet.com/v1/ab-roulette/{id})
This backend URL should be used to make all requests to the API.
* Statistics block: last 200 roulette spins (how many times roulette landed on particular numbers). Information needed can be retrieved using `/{wheelID}/stats` endpoint. These statistics should be used for informational purposes showing the number of occurrences for this particular result.
  - HOT/COLD/NEUTRAL(5 numbers with most/least/others hits) numbers from statistics should be marked differently so clients could identify them.
  - All roulette numbers should be painted accordingly using information from `/{wheelID}/configuration` endpoint for example 0 should be green, others black and red.Colors for numbers should be taken from `/{wheelID}/configuration` colors property.
* Upcoming spin timer:
Helpful notes:
* Start from getting the next game `/{wheelID}/nextGame`
* Use next game fakeStartDelta property value to show timer until next spin will take place
startDelta indicates When results should be ready.
Spinning should take place until result is present from `/{wheelID}/game/{uuid}`
Display next game countdown
* Spin history:
Display of last-resulted spins that happened from application start.
* Game Board: wheel or board that would display all available numbers in european wheel sequence order which can be found using `/{wheelID}/configuration` positionToId property. Also after the result for current spin is available via `/{wheelID}/game/{uuid}` endpoint it should somehow indicate on the board for a few seconds(for example blink).
* Actions Log: show action log of all what happens with timeStamp. For example:
```
2020-10-15T08:54:00.804Z Loading game board
2020-10-15T08:54:00.805Z GET .../configuration
2020-10-15T08:54:00.805Z Checking for new game
2020-10-15T08:54:00.806Z GET .../nextGame
2020-10-15T08:54:00.887Z GET .../stats?limit=200
2020-10-15T08:54:00.887Z sleeping for fakeStartDelta 69 sec
2020-10-15T08:55:09.888Z Spinning the wheel
2020-10-15T08:55:09.890Z GET .../game/1552694
2020-10-15T08:55:09.941Z Still no result continue spinning
2020-10-15T08:55:10.943Z Spinning the wheel
2020-10-15T08:55:10.943Z Wheel is already spinning ;
2020-10-15T08:55:10.943Z GET .../game/1552694
2020-10-15T08:55:10.993Z Still no result continue spinning
2020-10-15T08:55:11.995Z Spinning the wheel
2020-10-15T08:55:11.995Z Wheel is already spinning ;
2020-10-15T08:55:11.995Z GET .../game/1552694
```
...

[Backend API documentation](http://petstore.swagger.io/?url=https://dev-games-backend.advbet.com/v1/ab-roulette/static/swagger.yaml)

[Backend Address (for requests use wheelID=1 value)](https://dev-games-backend.advbet.com/v1/ab-roulette/)

[Already completed Task example](https://origin.advbet.com/static.advbet.com/frontend-task/)
