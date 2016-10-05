setTimeout(function () {
    var config = {
            nodeTypes: {
                circle: {
                    texture: 'textures/circle.png'
                },
                square: {
                    texture: 'textures/square.png'
                }
            },
            links: {
                directed: {
                    arrow: 'textures/arrowhead.png'
                }
            },
            view: {
                element: 'graph'
            }
        },
        graph = GB.create(config), last;

    for (var i = 0; i < 1500; i++) {
        graph.model.addNode({id: i, type: Math.random() >= 0.5 ? 'circle' : 'square'});
        if (last)
            graph.model.addLink(last, i, 1);
        last = i;
    }

    // setInterval(function () {
    //     var now = Math.random();
    //     graph.model.addNode({id: now, type: 'circle'});
    //     if (last)
    //         graph.model.addLink(last, now, 1);
    //     if (graph.model.data.nodes.length > 10 && Math.random() > 0.8)
    //         graph.model.addLink(
    //             graph.model.data.nodes[Math.floor(Math.random() * graph.model.data.nodes.length)].id,
    //             graph.model.data.nodes[Math.floor(Math.random() * graph.model.data.nodes.length)].id,
    //             1);
    //     last = now;
    // }, 50);
    console.log(graph);
}, 200);