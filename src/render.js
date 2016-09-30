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
                graph.initialConfig.links.width || 1,
                graph.initialConfig.links.color || 0x000000,
                graph.initialConfig.links.opacity || 1);
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