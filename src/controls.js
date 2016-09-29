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

    graph.view.renderer.view.addEventListener("wheel", function onWheel(e) {
        if (e.deltaY > 0) scale -= graph.view.graph.scale.x * 0.05;
        else scale += graph.view.graph.scale.x * 0.05;
        //zoom beetwen 0.01 and 10
        if (scale <= (config.zoom.min || 0.01)) {
            scale = config.zoom.min || 0.01;
        }
        if (scale >= (config.zoom.max || 10)) {
            scale = config.zoom.max || 10;
        }
        graph.view.graph.scale.x = graph.view.graph.scale.y = scale;
    });
    graph.view.renderer.view.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });
};