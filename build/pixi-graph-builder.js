var GB =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	exports.version = '0.0.3';
	exports.create = function (config) {
	    var view = __webpack_require__(1),
	        model = __webpack_require__(2),
	        config = __webpack_require__(3)(config);

	    var graph = {
	            config: config,
	            view: new view(config.view),
	            nodeTypes: config.nodeTypes
	        },
	        keyNodes = {};

	    graph.model = new model(graph, keyNodes);

	    graph.view.graph.interactive = true;

	    if (config.view.controls) {
	        __webpack_require__(4)(graph, keyNodes);
	    }
	    __webpack_require__(5)(graph);

	    return graph;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function (cfg) {
	    this.width = cfg.width;
	    this.height = cfg.height;

	    this.renderer = new PIXI.WebGLRenderer(
	        this.width,
	        this.height,
	        {
	            transparent: cfg.transparent
	        });
	    this.stage = new PIXI.Container();
	    this.graph = new PIXI.Container();
	    this.links = new PIXI.Graphics();

	    this.graph.position.x = this.width / 2;
	    this.graph.position.y = this.height / 2;

	    this.graph.addChild(this.links);
	    this.stage.addChild(this.graph);

	    document.getElementById(cfg.element).appendChild(this.renderer.view);
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function (config) {
	    var defaultConfig = {
	            links: {
	                width: 10,
	                color: 0x3498db,
	                opacity: .5,
	                directed: false
	            },
	            view: {
	                transparent: true,
	                width: window.innerWidth,
	                height: window.innerHeight,
	                controls: {
	                    autoScale: true,
	                    zoom: {
	                        max: 1.5,
	                        min: .1
	                    }
	                }
	            }
	        },
	        defaultNodeType = {
	            draggable: true,
	            scale: 1
	        };

	    function extend(obj1, obj2) {
	        Object.keys(obj2).forEach(function (key) {
	            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
	                obj1[key] = extend(obj1[key], obj2[key]);
	            } else {
	                obj1[key] = obj2[key];
	            }
	        });
	        return obj1;
	    }

	    Object.keys(config.nodeTypes).forEach(function (key) {
	        config.nodeTypes[key] = extend(JSON.parse(JSON.stringify(defaultNodeType)), config.nodeTypes[key]);
	    });
	    return extend(defaultConfig, config);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function (graph, keyNodes) {
	    var isDragging = false,
	        prevX, prevY;

	    graph.view.stage.hitArea = new PIXI.Rectangle(0, 0, graph.view.width, graph.view.height);
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
	        var min = graph.config.view.controls.zoom && graph.config.view.controls.zoom.min || .01,
	            max = graph.config.view.controls.zoom && graph.config.view.controls.zoom.max || 3,
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

	        if (graph.config.view.controls.autoScale) {
	            graph.model.data.nodes.forEach(function (item) {
	                item.$node.scale.x = item.$node.scale.y = ((max + 1) + graph.config.nodeTypes[item.type].scale || 0.3) - s;
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function (graph) {
	    animate();
	    function animate() {

	        graph.model.data.nodes.forEach(function (i) {
	            i.$node.position.x = i.x;
	            i.$node.position.y = i.y;
	        });
	        graph.model.data.links.forEach(function (i) {
	            i.$link.clear();
	            i.$link.lineStyle(
	                graph.config.links.width,
	                graph.config.links.color,
	                graph.config.links.opacity);
	            i.$link.moveTo(i.target.x, i.target.y);
	            i.$link.lineTo(i.source.x, i.source.y);

	            if (i.$link.children[0]) {
	                i.$link.children[0].position.x = (i.target.x + i.source.x) / 2;
	                i.$link.children[0].position.y = (i.target.y + i.source.y) / 2;
	                i.$link.children[0].rotation = Math.atan2(i.target.y - i.source.y, i.target.x - i.source.x);
	            }
	        });
	        requestAnimationFrame(animate);
	        graph.view.renderer.render(graph.view.stage);
	    }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=pixi-graph-builder.js.map