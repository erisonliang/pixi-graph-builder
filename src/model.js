module.exports = function (graph, keyNodes) {
    this.data = {
        "nodes": [],
        "links": []
    };
    var d = this.data;

    this.force = d3.layout.force()
        .nodes(this.data.nodes)
        .links(this.data.links)
        .gravity(0.002)
        .charge(-100)
        .linkDistance(35);

    this.addNode = function (data) {
        if (this.findNode(data.id)) {
            return;
        }
        var nodeType = graph.nodeTypes[data.type],
            node = PIXI.Sprite.fromImage(nodeType.texture);

        node.scale.x = nodeType.scale || 1;
        node.scale.y = nodeType.scale || 1;
        node.anchor.x = 0.5;
        node.anchor.y = 0.5;

        graph.view.graph.addChild(node);

        var index = this.data.nodes.push({
            id: data.id,
            data: data.data,
            fixed: data.fixed || false,
            x: data.pos ? data.pos.x : undefined,
            y: data.pos ? data.pos.y : undefined,
            multiId: data.multiId,
            type: data.type,
            $node: node
        });

        node.interactive = true;

        node.on('mousedown', function (move) {
            keyNodes.draggable = nodeType.draggable ? d.nodes[index - 1] : undefined;
        });
        node.on('rightclick', function (move) {
            d.nodes[index - 1].fixed = false;
        });
        for (var key in nodeType.events) {
            node.on(key, function (move) {
                nodeType.events[key](move, d.nodes[index - 1]);
            });
        }
        for (var key in graph.config.events) {
            node.on(key, function (move) {
                graph.config.events[key](move, d.nodes[index - 1]);
            });
        }
        this.force.start();

        return this.data.nodes[index - 1];
    };

    this.addLink = function (source, target, value) {
        var source = this.findNode(source),
            target = this.findNode(target),
            link = new PIXI.Graphics();

        if (graph.config.links.directed) {
            var arrowHead = PIXI.Sprite.fromImage(graph.config.links.directed.arrow);
            arrowHead.scale.x = graph.config.links.directed.scale || 1;
            arrowHead.scale.y = graph.config.links.directed.scale || 1;
            arrowHead.anchor.x = 0.5;
            arrowHead.anchor.y = 0.5;
            link.addChild(arrowHead);
        }

        graph.view.links.addChild(link);

        this.data.links.push({
            "source": source,
            "target": target,
            "value": value,
            "$link": link
        });

        this.force.start();
    };

    this.findNode = function (id) {
        for (var i in this.data.nodes) {
            if (this.data.nodes[i]["id"] === id) {
                return this.data.nodes[i];
            }
        }
    };
};