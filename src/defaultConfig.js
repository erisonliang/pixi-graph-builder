module.exports = function (config) {
    var defaultConfig = {
            links: {
                width: 10,
                color: 0x3498db,
                opacity: .5,
                directed: false
            },
            view: {
                transparent: true,
                width: window.innerWidth,
                height: window.innerHeight,
                controls: {
                    autoScale: true,
                    zoom: {
                        max: 1.5,
                        min: .1
                    }
                }
            }
        },
        defaultNodeType = {
            draggable: true,
            scale: 1
        };

    function extend(obj1, obj2) {
        Object.keys(obj2).forEach(function (key) {
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                obj1[key] = extend(obj1[key], obj2[key]);
            } else {
                obj1[key] = obj2[key];
            }
        });
        return obj1;
    }

    Object.keys(config.nodeTypes).forEach(function (key) {
        config.nodeTypes[key] = extend(JSON.parse(JSON.stringify(defaultNodeType)), config.nodeTypes[key]);
    });
    return extend(defaultConfig, config);
};