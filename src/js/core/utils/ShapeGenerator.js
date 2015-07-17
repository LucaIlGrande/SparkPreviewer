﻿console.log("ShapeGenetator.js included");

var ShapeGenerator = {};

ShapeGenerator.createTriangle = function() {
    return [
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];
};

ShapeGenerator.createCube = function() {
    var vertices = [
		-1.0, -1.0, -1.0, // 0
		 1.0, 1.0, -1.0, // 2
		 1.0, -1.0, -1.0, // 1
		-1.0, -1.0, -1.0, // 0
		-1.0, 1.0, -1.0, // 3
		 1.0, 1.0, -1.0, // 2

		// Y-
		-1.0, -1.0, -1.0, // 0
		 1.0, -1.0, -1.0, // 1
		 1.0, -1.0, 1.0, // 5
		-1.0, -1.0, -1.0, // 0
		 1.0, -1.0, 1.0, // 5
		-1.0, -1.0, 1.0, // 4

		// X+
		 1.0, -1.0, -1.0, // 1
		 1.0, 1.0, -1.0, // 2
		 1.0, 1.0, 1.0, // 6
		 1.0, -1.0, -1.0, // 1
		 1.0, 1.0, 1.0, // 6
		 1.0, -1.0, 1.0, // 5

		// Y+
		 1.0, 1.0, -1.0, // 2
		-1.0, 1.0, 1.0, // 7
		 1.0, 1.0, 1.0, // 6
		 1.0, 1.0, -1.0, // 2
		-1.0, 1.0, -1.0, // 3
		-1.0, 1.0, 1.0, // 7

		// X-
		-1.0, 1.0, -1.0, // 3
		-1.0, -1.0, 1.0, // 4
		-1.0, 1.0, 1.0, // 7
		-1.0, 1.0, -1.0, // 3
		-1.0, -1.0, -1.0, // 0
		-1.0, -1.0, 1.0, // 4

		// Z+		 
		-1.0, -1.0, 1.0, // 4
		 1.0, -1.0, 1.0, // 5
		 1.0, 1.0, 1.0, // 6
		-1.0, -1.0, 1.0, // 4
		 1.0, 1.0, 1.0, // 6
		-1.0, 1.0, 1.0, // 7
    ];

    return { verts: vertices,};
};