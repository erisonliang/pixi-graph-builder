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