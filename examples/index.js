setTimeout(function () {
    var config = {
            nodeTypes: {
                circle: {
                    texture: 'textures/circle.png',
                    scale: 1,
                    draggable: true,
                    events: {
                        rightclick: function (e, d) {
                            console.log(e, d);
                        }
                    }
                },
                square: {
                    texture: 'textures/square.png',
                    scale: 1,
                    draggable: true,
                    events: {}
                }
            },
            view: {
                element: 'graph',
                transparent: true,
                width: window.innerWidth,
                height: window.innerHeight,
                controls: {
                    zoom: {
                        max: 2,
                        min: .3
                    }
                }
            }
        },
        graph = GB.create(config), last;

    for (var i = 0; i < 50; i++) {
        graph.model.addNode({id: i, type: Math.random() >= 0.5 ? 'circle' : 'square'});
    }
    for (var i = 0; i < 30; i++) {
        graph.model.addLink(
            graph.model.data.nodes[Math.floor(Math.random() * 50)].id,
            graph.model.data.nodes[Math.floor(Math.random() * 50)].id,
            1)
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