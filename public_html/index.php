<html>
	<head>
		<script type="text/javascript" src="/js/jquery-1.9.1.js"></script>
		<script type="text/javascript" src="/js/jsrts.js"></script>
		<script type="text/javascript" src="/js/Renderer.js"></script>
		<script type="text/javascript" src="/js/Game.js"></script>
		<script type="text/javascript" src="/js/Client.js"></script>
		<script type="text/javascript" src="/js/Item.js"></script>
		<script type="text/javascript" src="/js/Position.js"></script>
		<script type="text/javascript" src="/js/Style.js"></script>
		<link rel="stylesheet" href="./style/style.css" />
	</head>
	<body>
		<div id="game-area">
			<canvas 
				id="canvas" 
				width="640" 
				height="480" 
				style="
					border: 1px solid #565656; 
					width: 640px; 
					height: 480px;"
			></canvas>
			<div id="modal-border" style="display: block;">
				<div id="modal">
					<span class="modal-header">Set name: </span>
					<span class="modal-error" id="modal-error"></span>
					<span class="text"><input type="text" id="name" /></span>
					<span class="modal-button" id="set-name">set</span>
				</div>
			</div>
		</div>
	</body>
</html>