export const defaultJSONFormat = ({message, methodName, logLevel, loggerName}) => {
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

export default (logger, options) => {

    if (!logger || !logger.methodFactory) {
        throw new Error('loglevel instance has to be specified in order to be extended');
    }

    let pluginLogger = logger,
        pluginUrl = options && options.url || 'http://localhost:8080/log',
        pluginCallOriginal = options && options.callOriginal || false,
        pluginLevel = options && options.level || 'trace',
        pluginFormat = options && options.format || defaultJSONFormat,
        pluginOriginalFactory = pluginLogger.methodFactory,
        pluginSendQueue = [],
        pluginIsSending = false;

    pluginLogger.methodFactory = (methodName, logLevel, loggerName) => {
        let rawMethod = pluginOriginalFactory(methodName, logLevel, loggerName);

        return (message) => {
            const formattedMessage = pluginFormat({
                message: message,
                methodName: methodName,
                logLevel: logLevel,
                loggerName: loggerName
            });

            if (pluginCallOriginal) {
                rawMethod(message);
            }

            pluginSendQueue.push(formattedMessage);
            sendNextMessage();
        };
    };

    pluginLogger.setLevel(pluginLevel);

    const sendNextMessage = () => {
        if (!pluginSendQueue.length || pluginIsSending) {
            return null;
        }

        pluginIsSending = true;

        let msg = pluginSendQueue.shift(),
            req = new XMLHttpRequest();

        req.open('POST', pluginUrl, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                pluginIsSending = false;
                setTimeout(sendNextMessage, 0);
            }
        };
        req.send(msg);
    };
};
