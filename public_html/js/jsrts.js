var renderer;
$(document).ready(function(){
	renderer = new Renderer("canvas");
	renderer.bgColor = "3D3D3D";
	game = new Game();
	client = new Client(game);
	renderTick();
});
function renderTick(){
	renderer.render(game)
	requestAnimationFrame(renderTick);
}