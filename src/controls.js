module.exports = function (graph, config, keyNodes) {
    var isDragging = false,
        prevX, prevY, scale = 1;

    graph.view.stage.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);
    graph.view.stage.interactive = true;
    graph.view.stage.on('mousedown', function (move) {
        var pos = move.data.global;
        prevX = pos.x;
        prevY = pos.y;
        isDragging = true;
    });
    graph.view.stage.on('mousemove', function (move) {
        var pos = move.data.global,
            local = move.data.getLocalPosition(graph.view.graph);
        if (keyNodes.draggable) {
            keyNodes.draggable.fixed = true;
            keyNodes.draggable.px = local.x;
            keyNodes.draggable.py = local.y;
            graph.model.force.start();
            return;
        }
        if (!isDragging) {
            return;
        }
        graph.model.force.start();

        graph.view.graph.position.x += pos.x - prevX;
        graph.view.graph.position.y += pos.y - prevY;
        prevX = pos.x;
        prevY = pos.y;
    });
    graph.view.stage.on('mouseup', function () {
        keyNodes.draggable = undefined;
        isDragging = false;
    });
    onWheel({deltaY: 0});

    graph.view.renderer.view.addEventListener("wheel", onWheel);
    function onWheel(e) {
        var min = config.zoom && config.zoom.min || .01,
            max = config.zoom && config.zoom.max || 3;
        if (e.deltaY > 0) scale -= graph.view.graph.scale.x * .05;
        else scale += graph.view.graph.scale.x * .05;

        if (scale <= min) {
            scale = min;
        }
        if (scale >= max) {
            scale = max;
        }
        graph.model.data.nodes.forEach(function (item) {
            item.$node.scale.x = item.$node.scale.y = (max + graph.initialConfig.nodeTypes[item.type].scale || 0.3) - scale;
        });
        graph.view.graph.scale.x = graph.view.graph.scale.y = scale;
    }

    graph.view.renderer.view.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });
};