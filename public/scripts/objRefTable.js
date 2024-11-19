const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.Sprite
	];
};
self.C3_JsPropNameTable = [
	{PlayerSprite: 0},
	{BallSprite: 0}
];

self.InstanceType = {
	PlayerSprite: class extends self.ISpriteInstance {},
	BallSprite: class extends self.ISpriteInstance {}
}