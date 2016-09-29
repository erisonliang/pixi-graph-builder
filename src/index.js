exports.version = '0.0.1';
exports.create = function (config) {
    var view = require('./view'),
        model = require('./model');

    var graph = {
            view: new view(config.view),
            nodeTypes: config.nodeTypes
        },
        keyNodes = {};

    graph.model = new model(graph.view, graph.nodeTypes, keyNodes);

    if (config.view.controls) {
        require('./controls')(graph, config.view.controls, keyNodes);
    }
    require('./render')(graph);

    return graph;
};