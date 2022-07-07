﻿"use strict";

var canvas;
var gl;

var numDivisions = 5;

var index = 0;

var points = [];

var modelViewMatrix = [];
var projectionMatrix = [];

var modelViewMatrixLoc;
var projectionMatrixLoc;

var patch;
var temp;

var numTeapotVertices = 306;

var normals = [];

var lightPosition = vec4(0.0, 0.0, 5.0, 0.0);   // move it out of scene
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = [
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(1.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0)
];

var materialDiffuse = [
    vec4(0.8, 0.0, 0.0, 1.0),
    vec4(1.0, 0.8, 0.0, 1.0),
    vec4(0.0, 0.8, 0.0, 1.0),
    vec4(0.0, 0.0, 0.8, 1.0),
    vec4(1.0, 0.0, 0.8, 1.0),
    vec4(0.0, 1.0, 0.8, 1.0)
];

var materialSpecular = [
    vec4(0.8, 0.0, 0.0, 1.0),
    vec4(1.0, 0.8, 0.0, 1.0),
    vec4(0.0, 0.8, 0.0, 1.0),
    vec4(0.0, 0.0, 0.8, 1.0),
    vec4(1.0, 0.0, 0.8, 1.0),
    vec4(0.0, 1.0, 0.8, 1.0)
];

var materialShininess = 100.0;

var ambientProduct;
var diffuseProduct;
var specularProduct;

var ambientProductLoc;
var diffuseProductLoc;
var specularProductLoc;

var lightPositionLoc;
var materialShininessLoc;

var cindex = 0;

var theta = 0.0;
var phi = 0.0;

const at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var eye;

var lightAng = 0;
var lightRad = 5;

var vertices = [

    vec3(1.4, 0.0, 2.4),
    vec3(1.4, -0.784, 2.4),
    vec3(0.784, -1.4, 2.4),
    vec3(0.0, -1.4, 2.4),
    vec3(1.3375, 0.0, 2.53125),
    vec3(1.3375, -0.749, 2.53125),
    vec3(0.749, -1.3375, 2.53125),
    vec3(0.0, -1.3375, 2.53125),
    vec3(1.4375, 0.0, 2.53125),
    vec3(1.4375, -0.805, 2.53125),
    vec3(0.805, -1.4375, 2.53125),
    vec3(0.0, -1.4375, 2.53125),
    vec3(1.5, 0.0, 2.4),
    vec3(1.5, -0.84, 2.4),
    vec3(0.84, -1.5, 2.4),
    vec3(0.0, -1.5, 2.4),
    vec3(-0.784, -1.4, 2.4),
    vec3(-1.4, -0.784, 2.4),
    vec3(-1.4, 0.0, 2.4),
    vec3(-0.749, -1.3375, 2.53125),
    vec3(-1.3375, -0.749, 2.53125),
    vec3(-1.3375, 0.0, 2.53125),
    vec3(-0.805, -1.4375, 2.53125),
    vec3(-1.4375, -0.805, 2.53125),
    vec3(-1.4375, 0.0, 2.53125),
    vec3(-0.84, -1.5, 2.4),
    vec3(-1.5, -0.84, 2.4),
    vec3(-1.5, 0.0, 2.4),
    vec3(-1.4, 0.784, 2.4),
    vec3(-0.784, 1.4, 2.4),
    vec3(0.0, 1.4, 2.4),
    vec3(-1.3375, 0.749, 2.53125),
    vec3(-0.749, 1.3375, 2.53125),
    vec3(0.0, 1.3375, 2.53125),
    vec3(-1.4375, 0.805, 2.53125),
    vec3(-0.805, 1.4375, 2.53125),
    vec3(0.0, 1.4375, 2.53125),
    vec3(-1.5, 0.84, 2.4),
    vec3(-0.84, 1.5, 2.4),
    vec3(0.0, 1.5, 2.4),
    vec3(0.784, 1.4, 2.4),
    vec3(1.4, 0.784, 2.4),
    vec3(0.749, 1.3375, 2.53125),
    vec3(1.3375, 0.749, 2.53125),
    vec3(0.805, 1.4375, 2.53125),
    vec3(1.4375, 0.805, 2.53125),
    vec3(0.84, 1.5, 2.4),
    vec3(1.5, 0.84, 2.4),
    vec3(1.75, 0.0, 1.875),
    vec3(1.75, -0.98, 1.875),
    vec3(0.98, -1.75, 1.875),
    vec3(0.0, -1.75, 1.875),
    vec3(2.0, 0.0, 1.35),
    vec3(2.0, -1.12, 1.35),
    vec3(1.12, -2.0, 1.35),
    vec3(0.0, -2.0, 1.35),
    vec3(2.0, 0.0, 0.9),
    vec3(2.0, -1.12, 0.9),
    vec3(1.12, -2.0, 0.9),
    vec3(0.0, -2.0, 0.9),
    vec3(-0.98, -1.75, 1.875),
    vec3(-1.75, -0.98, 1.875),
    vec3(-1.75, 0.0, 1.875),
    vec3(-1.12, -2.0, 1.35),
    vec3(-2.0, -1.12, 1.35),
    vec3(-2.0, 0.0, 1.35),
    vec3(-1.12, -2.0, 0.9),
    vec3(-2.0, -1.12, 0.9),
    vec3(-2.0, 0.0, 0.9),
    vec3(-1.75, 0.98, 1.875),
    vec3(-0.98, 1.75, 1.875),
    vec3(0.0, 1.75, 1.875),
    vec3(-2.0, 1.12, 1.35),
    vec3(-1.12, 2.0, 1.35),
    vec3(0.0, 2.0, 1.35),
    vec3(-2.0, 1.12, 0.9),
    vec3(-1.12, 2.0, 0.9),
    vec3(0.0, 2.0, 0.9),
    vec3(0.98, 1.75, 1.875),
    vec3(1.75, 0.98, 1.875),
    vec3(1.12, 2.0, 1.35),
    vec3(2.0, 1.12, 1.35),
    vec3(1.12, 2.0, 0.9),
    vec3(2.0, 1.12, 0.9),
    vec3(2.0, 0.0, 0.45),
    vec3(2.0, -1.12, 0.45),
    vec3(1.12, -2.0, 0.45),
    vec3(0.0, -2.0, 0.45),
    vec3(1.5, 0.0, 0.225),
    vec3(1.5, -0.84, 0.225),
    vec3(0.84, -1.5, 0.225),
    vec3(0.0, -1.5, 0.225),
    vec3(1.5, 0.0, 0.15),
    vec3(1.5, -0.84, 0.15),
    vec3(0.84, -1.5, 0.15),
    vec3(0.0, -1.5, 0.15),
    vec3(-1.12, -2.0, 0.45),
    vec3(-2.0, -1.12, 0.45),
    vec3(-2.0, 0.0, 0.45),
    vec3(-0.84, -1.5, 0.225),
    vec3(-1.5, -0.84, 0.225),
    vec3(-1.5, 0.0, 0.225),
    vec3(-0.84, -1.5, 0.15),
    vec3(-1.5, -0.84, 0.15),
    vec3(-1.5, 0.0, 0.15),
    vec3(-2.0, 1.12, 0.45),
    vec3(-1.12, 2.0, 0.45),
    vec3(0.0, 2.0, 0.45),
    vec3(-1.5, 0.84, 0.225),
    vec3(-0.84, 1.5, 0.225),
    vec3(0.0, 1.5, 0.225),
    vec3(-1.5, 0.84, 0.15),
    vec3(-0.84, 1.5, 0.15),
    vec3(0.0, 1.5, 0.15),
    vec3(1.12, 2.0, 0.45),
    vec3(2.0, 1.12, 0.45),
    vec3(0.84, 1.5, 0.225),
    vec3(1.5, 0.84, 0.225),
    vec3(0.84, 1.5, 0.15),
    vec3(1.5, 0.84, 0.15),
    vec3(-1.6, 0.0, 2.025),
    vec3(-1.6, -0.3, 2.025),
    vec3(-1.5, -0.3, 2.25),
    vec3(-1.5, 0.0, 2.25),
    vec3(-2.3, 0.0, 2.025),
    vec3(-2.3, -0.3, 2.025),
    vec3(-2.5, -0.3, 2.25),
    vec3(-2.5, 0.0, 2.25),
    vec3(-2.7, 0.0, 2.025),
    vec3(-2.7, -0.3, 2.025),
    vec3(-3.0, -0.3, 2.25),
    vec3(-3.0, 0.0, 2.25),
    vec3(-2.7, 0.0, 1.8),
    vec3(-2.7, -0.3, 1.8),
    vec3(-3.0, -0.3, 1.8),
    vec3(-3.0, 0.0, 1.8),
    vec3(-1.5, 0.3, 2.25),
    vec3(-1.6, 0.3, 2.025),
    vec3(-2.5, 0.3, 2.25),
    vec3(-2.3, 0.3, 2.025),
    vec3(-3.0, 0.3, 2.25),
    vec3(-2.7, 0.3, 2.025),
    vec3(-3.0, 0.3, 1.8),
    vec3(-2.7, 0.3, 1.8),
    vec3(-2.7, 0.0, 1.575),
    vec3(-2.7, -0.3, 1.575),
    vec3(-3.0, -0.3, 1.35),
    vec3(-3.0, 0.0, 1.35),
    vec3(-2.5, 0.0, 1.125),
    vec3(-2.5, -0.3, 1.125),
    vec3(-2.65, -0.3, 0.9375),
    vec3(-2.65, 0.0, 0.9375),
    vec3(-2.0, -0.3, 0.9),
    vec3(-1.9, -0.3, 0.6),
    vec3(-1.9, 0.0, 0.6),
    vec3(-3.0, 0.3, 1.35),
    vec3(-2.7, 0.3, 1.575),
    vec3(-2.65, 0.3, 0.9375),
    vec3(-2.5, 0.3, 1.125),
    vec3(-1.9, 0.3, 0.6),
    vec3(-2.0, 0.3, 0.9),
    vec3(1.7, 0.0, 1.425),
    vec3(1.7, -0.66, 1.425),
    vec3(1.7, -0.66, 0.6),
    vec3(1.7, 0.0, 0.6),
    vec3(2.6, 0.0, 1.425),
    vec3(2.6, -0.66, 1.425),
    vec3(3.1, -0.66, 0.825),
    vec3(3.1, 0.0, 0.825),
    vec3(2.3, 0.0, 2.1),
    vec3(2.3, -0.25, 2.1),
    vec3(2.4, -0.25, 2.025),
    vec3(2.4, 0.0, 2.025),
    vec3(2.7, 0.0, 2.4),
    vec3(2.7, -0.25, 2.4),
    vec3(3.3, -0.25, 2.4),
    vec3(3.3, 0.0, 2.4),
    vec3(1.7, 0.66, 0.6),
    vec3(1.7, 0.66, 1.425),
    vec3(3.1, 0.66, 0.825),
    vec3(2.6, 0.66, 1.425),
    vec3(2.4, 0.25, 2.025),
    vec3(2.3, 0.25, 2.1),
    vec3(3.3, 0.25, 2.4),
    vec3(2.7, 0.25, 2.4),
    vec3(2.8, 0.0, 2.475),
    vec3(2.8, -0.25, 2.475),
    vec3(3.525, -0.25, 2.49375),
    vec3(3.525, 0.0, 2.49375),
    vec3(2.9, 0.0, 2.475),
    vec3(2.9, -0.15, 2.475),
    vec3(3.45, -0.15, 2.5125),
    vec3(3.45, 0.0, 2.5125),
    vec3(2.8, 0.0, 2.4),
    vec3(2.8, -0.15, 2.4),
    vec3(3.2, -0.15, 2.4),
    vec3(3.2, 0.0, 2.4),
    vec3(3.525, 0.25, 2.49375),
    vec3(2.8, 0.25, 2.475),
    vec3(3.45, 0.15, 2.5125),
    vec3(2.9, 0.15, 2.475),
    vec3(3.2, 0.15, 2.4),
    vec3(2.8, 0.15, 2.4),
    vec3(0.0, 0.0, 3.15),
    vec3(0.0, -0.002, 3.15),
    vec3(0.002, 0.0, 3.15),
    vec3(0.8, 0.0, 3.15),
    vec3(0.8, -0.45, 3.15),
    vec3(0.45, -0.8, 3.15),
    vec3(0.0, -0.8, 3.15),
    vec3(0.0, 0.0, 2.85),
    vec3(0.2, 0.0, 2.7),
    vec3(0.2, -0.112, 2.7),
    vec3(0.112, -0.2, 2.7),
    vec3(0.0, -0.2, 2.7),
    vec3(-0.002, 0.0, 3.15),
    vec3(-0.45, -0.8, 3.15),
    vec3(-0.8, -0.45, 3.15),
    vec3(-0.8, 0.0, 3.15),
    vec3(-0.112, -0.2, 2.7),
    vec3(-0.2, -0.112, 2.7),
    vec3(-0.2, 0.0, 2.7),
    vec3(0.0, 0.002, 3.15),
    vec3(-0.8, 0.45, 3.15),
    vec3(-0.45, 0.8, 3.15),
    vec3(0.0, 0.8, 3.15),
    vec3(-0.2, 0.112, 2.7),
    vec3(-0.112, 0.2, 2.7),
    vec3(0.0, 0.2, 2.7),
    vec3(0.45, 0.8, 3.15),
    vec3(0.8, 0.45, 3.15),
    vec3(0.112, 0.2, 2.7),
    vec3(0.2, 0.112, 2.7),
    vec3(0.4, 0.0, 2.55),
    vec3(0.4, -0.224, 2.55),
    vec3(0.224, -0.4, 2.55),
    vec3(0.0, -0.4, 2.55),
    vec3(1.3, 0.0, 2.55),
    vec3(1.3, -0.728, 2.55),
    vec3(0.728, -1.3, 2.55),
    vec3(0.0, -1.3, 2.55),
    vec3(1.3, 0.0, 2.4),
    vec3(1.3, -0.728, 2.4),
    vec3(0.728, -1.3, 2.4),
    vec3(0.0, -1.3, 2.4),
    vec3(-0.224, -0.4, 2.55),
    vec3(-0.4, -0.224, 2.55),
    vec3(-0.4, 0.0, 2.55),
    vec3(-0.728, -1.3, 2.55),
    vec3(-1.3, -0.728, 2.55),
    vec3(-1.3, 0.0, 2.55),
    vec3(-0.728, -1.3, 2.4),
    vec3(-1.3, -0.728, 2.4),
    vec3(-1.3, 0.0, 2.4),
    vec3(-0.4, 0.224, 2.55),
    vec3(-0.224, 0.4, 2.55),
    vec3(0.0, 0.4, 2.55),
    vec3(-1.3, 0.728, 2.55),
    vec3(-0.728, 1.3, 2.55),
    vec3(0.0, 1.3, 2.55),
    vec3(-1.3, 0.728, 2.4),
    vec3(-0.728, 1.3, 2.4),
    vec3(0.0, 1.3, 2.4),
    vec3(0.224, 0.4, 2.55),
    vec3(0.4, 0.224, 2.55),
    vec3(0.728, 1.3, 2.55),
    vec3(1.3, 0.728, 2.55),
    vec3(0.728, 1.3, 2.4),
    vec3(1.3, 0.728, 2.4),
    vec3(0.0, 0.0, 0.0),
    vec3(1.5, 0.0, 0.15),
    vec3(1.5, 0.84, 0.15),
    vec3(0.84, 1.5, 0.15),
    vec3(0.0, 1.5, 0.15),
    vec3(1.5, 0.0, 0.075),
    vec3(1.5, 0.84, 0.075),
    vec3(0.84, 1.5, 0.075),
    vec3(0.0, 1.5, 0.075),
    vec3(1.425, 0.0, 0.0),
    vec3(1.425, 0.798, 0.0),
    vec3(0.798, 1.425, 0.0),
    vec3(0.0, 1.425, 0.0),
    vec3(-0.84, 1.5, 0.15),
    vec3(-1.5, 0.84, 0.15),
    vec3(-1.5, 0.0, 0.15),
    vec3(-0.84, 1.5, 0.075),
    vec3(-1.5, 0.84, 0.075),
    vec3(-1.5, 0.0, 0.075),
    vec3(-0.798, 1.425, 0.0),
    vec3(-1.425, 0.798, 0.0),
    vec3(-1.425, 0.0, 0.0),
    vec3(-1.5, -0.84, 0.15),
    vec3(-0.84, -1.5, 0.15),
    vec3(0.0, -1.5, 0.15),
    vec3(-1.5, -0.84, 0.075),
    vec3(-0.84, -1.5, 0.075),
    vec3(0.0, -1.5, 0.075),
    vec3(-1.425, -0.798, 0.0),
    vec3(-0.798, -1.425, 0.0),
    vec3(0.0, -1.425, 0.0),
    vec3(0.84, -1.5, 0.15),
    vec3(1.5, -0.84, 0.15),
    vec3(0.84, -1.5, 0.075),
    vec3(1.5, -0.84, 0.075),
    vec3(0.798, -1.425, 0.0),
    vec3(1.425, -0.798, 0.0)
];

var numTeapotPatches = 32;

var indices = new Array(numTeapotPatches);

indices[0] = [
0, 1, 2, 3,
4, 5, 6, 7,
8, 9, 10, 11,
12, 13, 14, 15
];
indices[1] = [
3, 16, 17, 18,
7, 19, 20, 21,
11, 22, 23, 24,
15, 25, 26, 27
];
indices[2] = [
18, 28, 29, 30,
21, 31, 32, 33,
24, 34, 35, 36,
27, 37, 38, 39
];
indices[3] = [
30, 40, 41, 0,
33, 42, 43, 4,
36, 44, 45, 8,
39, 46, 47, 12
];
indices[4] = [
12, 13, 14, 15,
48, 49, 50, 51,
52, 53, 54, 55,
56, 57, 58, 59
];
indices[5] = [
15, 25, 26, 27,
51, 60, 61, 62,
55, 63, 64, 65,
59, 66, 67, 68
];
indices[6] = [
27, 37, 38, 39,
62, 69, 70, 71,
65, 72, 73, 74,
68, 75, 76, 77
];
indices[7] = [
39, 46, 47, 12,
71, 78, 79, 48,
74, 80, 81, 52,
77, 82, 83, 56
];
indices[8] = [
56, 57, 58, 59,
84, 85, 86, 87,
88, 89, 90, 91,
92, 93, 94, 95
];
indices[9] = [
59, 66, 67, 68,
87, 96, 97, 98,
91, 99, 100, 101,
95, 102, 103, 104
];
indices[10] = [
68, 75, 76, 77,
98, 105, 106, 107,
101, 108, 109, 110,
104, 111, 112, 113
];
indices[11] = [
77, 82, 83, 56,
107, 114, 115, 84,
110, 116, 117, 88,
113, 118, 119, 92
];
indices[12] = [
120, 121, 122, 123,
124, 125, 126, 127,
128, 129, 130, 131,
132, 133, 134, 135
];
indices[13] = [
123, 136, 137, 120,
127, 138, 139, 124,
131, 140, 141, 128,
135, 142, 143, 132
];
indices[14] = [
132, 133, 134, 135,
144, 145, 146, 147,
148, 149, 150, 151,
68, 152, 153, 154
];
indices[15] = [
135, 142, 143, 132,
147, 155, 156, 144,
151, 157, 158, 148,
154, 159, 160, 68
];
indices[16] = [
161, 162, 163, 164,
165, 166, 167, 168,
169, 170, 171, 172,
173, 174, 175, 176
];
indices[17] = [
164, 177, 178, 161,
168, 179, 180, 165,
172, 181, 182, 169,
176, 183, 184, 173
];
indices[18] = [
173, 174, 175, 176,
185, 186, 187, 188,
189, 190, 191, 192,
193, 194, 195, 196
];
indices[19] = [
176, 183, 184, 173,
188, 197, 198, 185,
192, 199, 200, 189,
196, 201, 202, 193
];
indices[20] = [
203, 203, 203, 203,
206, 207, 208, 209,
210, 210, 210, 210,
211, 212, 213, 214
];
indices[21] = [
203, 203, 203, 203,
209, 216, 217, 218,
210, 210, 210, 210,
214, 219, 220, 221
];
indices[22] = [
203, 203, 203, 203,
218, 223, 224, 225,
210, 210, 210, 210,
221, 226, 227, 228
];
indices[23] = [
203, 203, 203, 203,
225, 229, 230, 206,
210, 210, 210, 210,
228, 231, 232, 211
];
indices[24] = [
211, 212, 213, 214,
233, 234, 235, 236,
237, 238, 239, 240,
241, 242, 243, 244
];
indices[25] = [
214, 219, 220, 221,
236, 245, 246, 247,
240, 248, 249, 250,
244, 251, 252, 253
];
indices[26] = [
221, 226, 227, 228,
247, 254, 255, 256,
250, 257, 258, 259,
253, 260, 261, 262
];
indices[27] = [
228, 231, 232, 211,
256, 263, 264, 233,
259, 265, 266, 237,
262, 267, 268, 241
];
indices[28] = [
269, 269, 269, 269,
278, 279, 280, 281,
274, 275, 276, 277,
270, 271, 272, 273
];
indices[29] = [
269, 269, 269, 269,
281, 288, 289, 290,
277, 285, 286, 287,
273, 282, 283, 284
];
indices[30] = [
269, 269, 269, 269,
290, 297, 298, 299,
287, 294, 295, 296,
284, 291, 292, 293
];
indices[31] = [
269, 269, 269, 269,
299, 304, 305, 278,
296, 302, 303, 274,
293, 300, 301, 270
];

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    buildTeapot();

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    projectionMatrix = ortho(-2, 2, -2, 2, -20, 20);
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");


    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    ambientProduct = mult(lightAmbient, materialAmbient[cindex]);
    diffuseProduct = mult(lightDiffuse, materialDiffuse[cindex]);
    specularProduct = mult(lightSpecular, materialSpecular[cindex]);

    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
    gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));

    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));

    specularProductLoc = gl.getUniformLocation(program, "specularProduct");
    gl.uniform4fv(specularProductLoc, flatten(specularProduct));

    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    gl.uniform4fv(lightPositionLoc, flatten(lightPosition));

    materialShininessLoc = gl.getUniformLocation(program, "shininess");
    gl.uniform1f(materialShininessLoc, materialShininess);

    document.addEventListener("keydown",
        function (event) {
            if (event.keyCode == 65 || event.keyCode == 37) {   // Left A
                theta += 0.1;
            }
            if (event.keyCode == 68 || event.keyCode == 39) {   // Right D
                theta -= 0.1;
            }
            if (event.keyCode == 87 || event.keyCode == 38) {   // Up W
                phi += 0.1;
            }
            if (event.keyCode == 83 || event.keyCode == 40) {   // Down S
                phi -= 0.1;
            }
        }, false);

    document.getElementById("subs").onchange =
        function (event) {
            numDivisions = Number(event.target.value);

            index = 0;
            points = [];
            normals = [];

            buildTeapot();

            gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
        };

    document.getElementById("colors").onchange =
        function (event) {
            cindex = Number(event.target.value);

            ambientProduct = mult(lightAmbient, materialAmbient[cindex]);
            diffuseProduct = mult(lightDiffuse, materialDiffuse[cindex]);
            specularProduct = mult(lightSpecular, materialSpecular[cindex]);

            gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
            gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
            gl.uniform4fv(specularProdcutLoc, flatten(specularProduct));
        };



    render();
}


function buildTeapot() {
    points = [];
    normals = [];

    var h = 1.0 / numDivisions;
    var patch = new Array(numTeapotPatches);
    for (var i = 0; i < numTeapotPatches; i++)
        patch[i] = new Array(16);
    for (var i = 0; i < numTeapotPatches; i++)
        for (j = 0; j < 16; j++) {
            patch[i][j] = vec4([vertices[indices[i][j]][0],
            vertices[indices[i][j]][2],
            vertices[indices[i][j]][1], 1.0]);
        }

    for (var n = 0; n < numTeapotPatches; n++) {
        var data = new Array(numDivisions + 1);
        for (var j = 0; j <= numDivisions; j++)
            data[j] = new Array(numDivisions + 1);
        for (var i = 0; i <= numDivisions; i++)
            for (var j = 0; j <= numDivisions; j++) {
                data[i][j] = vec4(0, 0, 0, 1);
                var u = i * h;
                var v = j * h;
                var t = new Array(4);
                for (var ii = 0; ii < 4; ii++)
                    t[ii] = new Array(4);
                for (var ii = 0; ii < 4; ii++)
                    for (var jj = 0; jj < 4; jj++)
                        t[ii][jj] = bezier(u)[ii] * bezier(v)[jj];

                for (var ii = 0; ii < 4; ii++) for (var jj = 0; jj < 4; jj++) {
                    var temp = vec4(patch[n][4 * ii + jj]);
                    temp = scale(t[ii][jj], temp);
                    data[i][j] = add(data[i][j], temp);
                }
            }

        for (var i = 0; i < numDivisions; i++)
            for (var j = 0; j < numDivisions; j++) {
                points.push(data[i][j]);
                points.push(data[i + 1][j]);
                points.push(data[i + 1][j + 1]);
                points.push(data[i][j]);
                points.push(data[i + 1][j + 1]);
                points.push(data[i][j + 1]);

                var t1 = subtract(data[i + 1][j], data[i][j]);
                var t2 = subtract(data[i + 1][j + 1], data[i][j]);
                var normal = cross(t1, t2);
                normal[3] = 0;

                normals.push(normal);
                normals.push(normal);
                normals.push(normal);
                normals.push(normal);
                normals.push(normal);
                normals.push(normal);
            }
    }
}

function bezier(u) {
    var b = new Array(4);
    var a = 1 - u;
    b[3] = a * a * a;
    b[2] = 3 * a * a * u;
    b[1] = 3 * a * u * u;
    b[0] = u * u * u;
    return b;
}



function bezier(u) {
    var b = new Array(4);
    var a = 1 - u;
    b[3] = a * a * a;
    b[2] = 3 * a * a * u;
    b[1] = 3 * a * u * u;
    b[0] = u * u * u;
    return b;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (theta < 0)
        theta += 2 * Math.PI;
    if (theta > 2 * Math.PI)
        theta -= 2 * Math.PI;
    if (phi < 0)
        phi += 2 * Math.PI;
    if (phi > 2 * Math.PI)
        phi -= 2 * Math.PI;

    if (phi > Math.PI / 2 && phi < 3 * Math.PI / 2) {
        up = vec3(0.0, -1.0, 0.0);
    }
    else {
        up = vec3(0.0, 1.0, 0.0);
    }

    eye = vec3(Math.sin(theta) * Math.cos(phi),
        Math.sin(phi),
        Math.cos(theta) * Math.cos(phi));

    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    lightAng += 0.02;
    lightPosition[0] = lightRad * Math.sin(lightAng);
    lightPosition[2] = lightRad * Math.cos(lightAng);

    // Offsetting the light to compensate for rotation of eye
    var lightPosition2 = mult(modelViewMatrix, lightPosition);
    gl.uniform4fv(lightPositionLoc, flatten(lightPosition2));

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    requestAnimFrame(render);
}