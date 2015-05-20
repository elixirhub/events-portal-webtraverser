# Webtraverser

## Installation

```Shell
npm install elixirhub/events-portal-webtraverser
```


## API

### Variable naming

- `fromUrl` String – is the URL of the page that found the current URL.
- `fromUrlo` Object – is `fromUrl` parsed with the `url` module.
- `currentUrl` String – is the current URL being handled.
- `currentUrlo` Object – is `currentUrl` parsed with the `url` module.
- `newUrl` String – is a new URL to inspect.


### Class: Webtraverser(options)

This is an
[EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter).


#### Required options

- `urlStart` String – is the URL of start.
- `mongoId` String – is the ID of the shared MongoDB client, using the
  [mongo](https://github.com/cydgy/mongo) module.


#### Optional options

###### Maximums

- `maxTotalLinks` Number | Null default=Null – is the maximum number of
  total links to inspect.
- `maxSizeQueue` Number | Null default=Null – is the maximum size of
  the queue.
- `maxConcurrent` Number | Null default=6 – is the maximum number of
  links to inspect concurrently.


###### Checks

- `checkProtocol` Boolean default=true – check before inspecting that
  the protocol of the link is either `http` or `https`.
- `checkHostname` Boolean default=true – check before inspecting that
  the hostname of the link equal to the hostname of the page on which the link
  is.
- `checkLastcheck` Boolean default=true – check before inspecting that
  the link has not been checked for at least the value of
  `checkLastcheckMinutes`.
- `checkLastcheckMinutes` Number default=10 – is the number of minutes.


###### Functions

- `functions` Array default=[] – is an array containing the inspection
  functions.


#### Webtraverser.start()

Start the Webtraverser.


#### Webtraverser.interval(options)

Handle the queue.

- `options` Objects with the following properties:
  - `ms` Number default=5000


#### Webtraverser.removeCollections(callback)

The callback is passed one argument `(result)`, where `result` is the result of
the dropCollection method.

`'error'` will be emitted if an error occurs.


#### Inspection functions

Inspections functions are executed in series, and are added that way:
```Javascript
myWebtraverser.functions.push(myFunction);
```

The parameters passed to your functions are `(fromUrlo, currentUrlo,
htmlReceived, statusCode, callback)`.

### Events


## License

Webtraverser is licensed under the MIT license.
