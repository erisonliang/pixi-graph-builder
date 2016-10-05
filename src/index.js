exports.version = '0.0.3';
exports.create = function (config) {
    var view = require('./view'),
        model = require('./model'),
        config = require('./defaultConfig')(config);

    var graph = {
            config: config,
            view: new view(config.view),
            nodeTypes: config.nodeTypes
        },
        keyNodes = {};

    graph.model = new model(graph, keyNodes);

    graph.view.graph.interactive = true;

    if (config.view.controls) {
        require('./controls')(graph, keyNodes);
    }
    require('./render')(graph);

    return graph;
};