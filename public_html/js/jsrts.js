var renderer;
$(document).ready(function(){
	renderer = new Renderer("canvas");
	game = new Game();
	client = new Client(game);
	renderTick();
});
function renderTick(){
	renderer.render(game)
	requestAnimationFrame(renderTick);
}