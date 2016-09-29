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

	exports.version = '0.0.1';
	exports.create = function (config) {
	    var view = __webpack_require__(1),
	        model = __webpack_require__(2);

	    var graph = {
	            view: new view(config.view),
	            nodeTypes: config.nodeTypes
	        },
	        keyNodes = {};

	    graph.model = new model(graph.view, graph.nodeTypes, keyNodes);

	    if (config.view.controls) {
	        __webpack_require__(3)(graph, config.view.controls, keyNodes);
	    }
	    __webpack_require__(4)(graph);

	    return graph;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function (cfg) {
	    this.width = cfg.width || window.innerWidth;
	    this.height = cfg.height || window.innerWidth;

	    this.renderer = new PIXI.WebGLRenderer(
	        this.width,
	        this.height,
	        {
	            transparent: cfg.transparent || false
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

	module.exports = function (view, nodeTypes, keyNodes) {
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
	    // .size([s.view.width, s.view.height]);

	    this.addNode = function (data) {
	        if (this.findNode(data.id)) {
	            return;
	        }
	        var nodeType = nodeTypes[data.type],
	            node = PIXI.Sprite.fromImage(nodeType.texture);

	        node.scale.x = nodeType.scale || 1;
	        node.scale.y = nodeType.scale || 1;
	        node.anchor.x = 0.5;
	        node.anchor.y = 0.5;

	        view.graph.addChild(node);

	        var index = this.data.nodes.push({
	            id: data.id,
	            data: data.data,
	            fixed: data.fixed || false,
	            x: data.pos ? data.pos.x : undefined,
	            y: data.pos ? data.pos.y : undefined,
	            multiId: data.multiId,
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
	        this.force.start();

	        return this.data.nodes[index - 1];
	    };

	    this.addLink = function (source, target, value, cone) {
	        var source = this.findNode(source),
	            target = this.findNode(target),
	            link = new PIXI.Graphics();

	        view.links.addChild(link);

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

/***/ },
/* 4 */
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
	            i.$link.lineStyle(3, 0x2980b9, 1);
	            i.$link.moveTo(i.target.x, i.target.y);
	            i.$link.lineTo(i.source.x, i.source.y);
	        });
	        requestAnimationFrame(animate);
	        graph.view.renderer.render(graph.view.stage);
	    }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=pixi-graph-builder.js.map