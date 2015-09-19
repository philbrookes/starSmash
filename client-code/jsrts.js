var renderer, game, client, ui;

$(document).ready(function(){
	ui = new Ui("canvas");
	renderer = new Renderer("canvas");
	renderer.bgColor = "3D3D3D";
	game = new Game(ui);
	client = new Client(game);
	renderTick();
});
function renderTick(){
	renderer.render(game);
	requestAnimationFrame(renderTick);
}