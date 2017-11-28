# loglevel-plugin-server

Plugin for sending logs to the remote server

## Installation

```shell
> npm install loglevel-plugin-server --save
```

## Usage

```javascript
loglevelPlugin(loglevel, options);
```

### Parameters

`loglevel` - the root logger, imported from [`https://raw.githubusercontent.com/pimterry/loglevel`][loglevel] package

`options` - plugin config object

| options parameter | type | description | default value |
| ----------------- | ---- | ----------- | ------------- |
| url | string | url to log server | http://localhost:8080/log |
| callOriginal | boolean | true | call original loglevel method (console.log) |
| level | string | trace | loglevel level (trace, debug, info, warn, error). See loglevel documentation |
| format | function | see below | function for formatting message before sending to the server |

*Default format function*
```javascript
const format = ({message, methodName, logLevel, loggerName}) => {
    return JSON.stringify({
        message: message,
        level: {
            label: (methodName || '').toUpperCase(),
            value: logLevel
        },
        logger: loggerName || '',
        timestamp: new Date().toISOString()
    });
};
```

## ES6 usage example

```javascript
import loglevelPlugin from '../loglevel-plugin-server/lib/loglevel-plugin-server.min';
import loglevel from 'loglevel';



const options = {
    url: 'http://localhost:8080/'
};
loglevelPlugin(loglevel, options);
logger.info('it is easy to use loglevel-plugin-server');
```

## License

This software is distributed under an MIT licence.

Copyright 2017 © Zoreslav Goral