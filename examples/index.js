setTimeout(function () {
    var config = {
            nodeTypes: {
                circle: {
                    texture: 'textures/circle.png',
                    scale: 1,
                    draggable: true
                },
                square: {
                    texture: 'textures/square.png',
                    scale: 1,
                    draggable: true
                }
            },
            links: {
                width: 10,
                color: 0x3498db,
                opacity: .4,
                directed: {
                    arrow: 'textures/arrowhead.png',
                    scale: 1
                }
            },
            view: {
                element: 'graph',
                transparent: true,
                width: window.innerWidth,
                height: window.innerHeight,
                controls: {
                    autoScale: true,
                    zoom: {
                        start: .1,
                        max: 1,
                        min: .1
                    }
                }
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