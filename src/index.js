exports.version = '0.0.3';
exports.create = function (config) {
    var view = require('./view'),
        model = require('./model');

    var graph = {
            initialConfig: config,
            view: new view(config.view),
            nodeTypes: config.nodeTypes
        },
        keyNodes = {};

    graph.model = new model(graph.view, graph.nodeTypes, keyNodes, config);

    graph.view.graph.interactive = true;

    if (config.view.controls) {
        require('./controls')(graph, config.view.controls, keyNodes);
    }
    require('./render')(graph);

    return graph;
};