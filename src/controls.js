module.exports = function (graph, config, keyNodes) {
    var isDragging = false,
        prevX, prevY;

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

        graph.view.graph.position.x += pos.x - prevX;
        graph.view.graph.position.y += pos.y - prevY;
        prevX = pos.x;
        prevY = pos.y;
    });
    graph.view.stage.on('mouseup', function () {
        keyNodes.draggable = undefined;
        isDragging = false;
    });


    graph.view.renderer.view.addEventListener("wheel", zoom);

    function zoom(e) {
        var min = config.zoom && config.zoom.min || .01,
            max = config.zoom && config.zoom.max || 3,
            s = e.deltaY, x = e.offsetX, y = e.offsetY;

        s = s > 0 ? .9 : 1.1;

        var worldPos = {
            x: (x - graph.view.graph.x) / graph.view.graph.scale.x,
            y: (y - graph.view.graph.y) / graph.view.graph.scale.y
        };
        s = graph.view.graph.scale.y * s;

        if (s <= min) {
            s = min;
        }
        if (s >= max) {
            s = max;
        }

        var newScreenPos = {
            x: (worldPos.x ) * s + graph.view.graph.x,
            y: (worldPos.y) * s + graph.view.graph.y
        };

        if (config.autoScale) {
            graph.model.data.nodes.forEach(function (item) {
                item.$node.scale.x = item.$node.scale.y = ((max + 1) + graph.initialConfig.nodeTypes[item.type].scale || 0.3) - s;
            });
        }

        graph.view.graph.x -= (newScreenPos.x - x);
        graph.view.graph.y -= (newScreenPos.y - y);
        graph.view.graph.scale.x = s;
        graph.view.graph.scale.y = s;
    }

    graph.view.renderer.view.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });
};