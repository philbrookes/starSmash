var renderer;
$(document).ready(function(){
	renderer = new Renderer("canvas");
	game = new Game();
	client = new Client(game);
	renderTick();

	$("#set-name").click(function(){
		client.setName($("#name").val());
	});
});
function renderTick(){
	renderer.render(game)
	requestAnimationFrame(renderTick);
}