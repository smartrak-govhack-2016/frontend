/**
* @param {Array} points - (flat) point array: [x1, y1, x2, y2, ..., xn, yn]
* @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
* @param {Number} [numOfSeg=25] - number of segments between two points (line resolution)
* @param {Boolean} [close=false] - Close the ends making the line continuous
* @returns {Float32Array} - the spline points. [x1, y1, x2, y2, ..., xn, yn] 
*/
declare function cardinalSpline(points: Array<number>, tension?: number, numOfSeg?: number, close?: boolean): Float32Array;

declare module "cardinal-spline" {
    export = cardinalSpline;
}