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