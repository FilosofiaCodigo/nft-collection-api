#!/usr/bin/env node
const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 -w [num] -h [num]')
    .demandOption(['b','w','h'])
    .option('breathPath', {
        description: 'Path to Breath data json.',
        alias: 'b',
        type: 'string'
    })
    .option('width', {
        description: 'Canvas Width in pixels',
        alias: 'w',
        type: 'number'
    })
    .option('height', {
        description: 'Canvas Height in pixels',
        alias: 'h',
        type: 'number'
    })
    .option('imagePath', {
        description: 'Output filename with path. i.e. ./images/1',
        alias: 'p',
        type: 'string'
    })
    .argv;

const p5 = require('node-p5');
const {resolve} = require("path");

let breathData;
let breathFilePath;
let imageFilePath;
try {
    breathFilePath = resolve(argv.breathPath);
    breathData = require(breathFilePath);
    imageFilePath = resolve(argv.imagePath);
} catch (err) {
    console.error(err)
    console.error(`Could not load file on path ${breathFilePath}. Check for correct linux or windows paths.`);
    process.exit(1);
}

// const breath = JSON.parse(argv.breath);
const canvasWidth = argv.width;
const canvasHeight = argv.height;


// DEFINES eCO2 SPRAYS CHARACTERS USED - white stars & tail
const alphabet = ".¨˙•:";
// DEFINES eCO2 SPRAYS SPECIAL CHARACTER - white stars & tail
// Please use long & lat to choose one special character
const alphabet_special = "꙳꙰●ᶧ▪҉҈֍∆∞◊○ꝏꝍ٥□ꙮ▪꙲ꚚꝊ°*+";

// CO-DEFINES UNIQUE PATTERN (shuffels the deck to draw cards)
let seed = 1;
// I think this is broken with RFID?! though hash still works
// please use breath.date_t instead of RFID anyways

const BLACK = 'rgb(0,0,0)';
const BLACKA = 'rgba(0,0,0, 0.1)';
const WHITE = 'rgba(255,255,255, 0.1)';
const WHITE1 = 'rgba(255,255,255, 1)';
const WHITE2 = 'rgba(255,255,255, 0.3)';
const WHITE3 = 'rgba(255,255,255, 0.5)';
const TRANSPARENT = 'rgba(255,255,255, 0)';

const PURPLE = 'rgba(255,0,255, 0.2)';
const ROSA = 'rgba(228,0,255, 0.4)';
const PINK = 'rgba(247,048,136, 0.3)';
const MAGENTA = 'rgba(150,075,250, 0.2)';
const YELLOW = 'rgba(255,255,0, 0.25)';
const PINK1 = 'rgba(252,55,231, 0.3)';
const VIOLET1 = 'rgba(169,18,255, 0.3)';

//DEFINES USED COLOR SET (01-06)
// use temperature or determine color set
//xx,00 - xx,17 use color set 01
//xx,18 - xx,34 use color set 02
//xx,35 - xx,51 use color set 03
//xx,52 - xx,68 use color set 04
//xx,69 - xx,85 use color set 05
//xx,86 - xx,99 use color set 06

//color set 01
const BLUE_H2 = 'rgba(24,62,250, 0.4)'; // H2 CLOUD 006
const CYAN_ETHANOL = 'rgba(0,255,255, 0.2)'; // ETHANOL CLOUD 001 & 002

//color set 02
const CYAN_H2  = 'rgba(0,255,255, 0.3.5)'; // H2 CLOUD 006
const GREEN_ETHANOL = 'rgba(0,255,0, 0.25)'; // ETHANOL CLOUD 001 & 002

//color set 03
const GREEN_H2 = 'rgba(0,255,0, 0.4)'; // H2 CLOUD 006
const YELLOW_ETHANOL = 'rgba(255,255,0, 0.25)'; // ETHANOL CLOUD 001 & 002

//color set 04
const YELLOW_H2 = 'rgba(255,255,0, 0.4)'; // H2 CLOUD 006
const ORANGE_ETHANOL = 'rgba(255, 95, 31, 0.3)'; // ETHANOL CLOUD 001 & 002

//color set 05
const ORANGE_H2 = 'rgba(255, 95, 31, 0.4)' // H2 CLOUD 006
const RED_ETHANOL = 'rgba(247, 33, 25, 0.4)'; // ETHANOL CLOUD 001 & 002

//color set 06
const RED_H2 = 'rgba(247, 33, 25, 0.4)'; // H2 CLOUD 006
const BLUE_ETHANOL = 'rgba(24,62,250, 0.2)' // ETHANOL CLOUD 001 & 002

const chaos = require('./chaosLib')(breathData, canvasWidth, canvasHeight);

// DEFINES STEP SIZE (distance grid points (output:10-18)) basend on CO2 input
let stepSize = chaos.range_scale(breathData.data.ref1.CO2, 400, 5000, 13, 17);


// DEFINE STARTING DRAWING POSITION
const CENTER = false;
let posX, posY;
if (CENTER === true) {
    posX = canvasWidth / 2;
    posY= canvasHeight / 2;
} else {
    posX = 0;
    posY= 0;
}

// Updates module vars
chaos.seed = seed;
chaos.posX = posX;
chaos.posY = posY;
chaos.stepSize = stepSize;

// Updates values for both the chaos and current modules
// REQUIRED AFTER ALL RANDOM CALLS
function _updateCursorPosition() {
    posX = chaos.posX;
    posY = chaos.posY;
    chaos.stepSize = stepSize;
}


function sketch(p) {

    // Paints a random sized square once or twice
    function _draw_rnd_circle(max_size, bkg, color) {
        p.noStroke();
        p.fill(bkg);
        let size = chaos.random_range(max_size);
        p.circle(posX, posY, size);
        if(color){
            p.fill(color);
            p.circle(posX, posY, size);
        }
    }

    // Paint a random character once or twice
    function _draw_rnd_text(text_size, char_set, color, color2, text_size_increment) {
        p.noStroke();
        p.fill(color);
        p.textSize(text_size);
        let selChar = chaos.rand_char(char_set);
        p.text(selChar, posX, posY);
        if(color2){
            p.fill(color2);
            p.textSize(text_size+text_size_increment);
            p.text(selChar, posX, posY);
            p.fill(color2);
            p.textSize(text_size+text_size_increment*text_size_increment);
            p.text(selChar, posX, posY);
        }
    }

    // Draw circles in a cloud pattern
    function drawCloud(dataInput, ratio, dotMaxSize, firstColor, secondColor=undefined, stepIncrease=0, center=false) {
        stepSize += stepIncrease;
        for (let i = 0; i <= (dataInput) * ratio; i++) {
            chaos.drunkard_walk(center);
            _updateCursorPosition();
            _draw_rnd_circle(dotMaxSize, firstColor, secondColor);
        }
    }

    // Draw lines based on dot matrix and distance
    function drawGeometricalLines(dataInput, ratio, strokeWeight, strokeColor, lineMaxDistance=canvasWidth/2, stepSizeMultiX=1, stepSizeMultiY=1, center=false) {
        let matrix = [];
        for (let i = 0; i <= (dataInput) * ratio; i++) {
            chaos.drunkard_walk_weighted(stepSizeMultiX, stepSizeMultiY, center);
            _updateCursorPosition();
            matrix.push([posX, posY]);
            if (matrix.length > 2) {
                let previous = matrix[i - 1];
                let current = matrix[i];
                let distance = Math.hypot(previous[0] - current[0], previous[1] - current[1]);
                if (distance < lineMaxDistance) {
                    p.strokeWeight(strokeWeight);
                    p.stroke(strokeColor);
                    p.line(current[0], current[1], previous[0], previous[1]);
                }
            }
        }
    }

    // Draws waves of sprayed characters with one or two colors
    function drawCharacterSpray(ratioStars, dataInput, textSize, charSet, firstColor, secondColor, textSizeIncrement, center = false) {
        for (let i = 0; i <= ratioStars; i++) {
            chaos.drunkard_walk(center);
            _updateCursorPosition();
            p.rotate(dataInput);
            _draw_rnd_text(textSize, charSet, firstColor, secondColor, textSizeIncrement);
        }
        p.resetMatrix();
    }

    let canvas;

    p.setup = function setup() {
        canvas = p.createCanvas(canvasWidth, canvasHeight);
        p.noLoop();
        p.background(BLACK);
    };

    p.draw = function draw() {

        // DEFINES NUMBER OF CIRCLES (breath.ETHANOL * ratio_clouds & breath.H2 * ratio_clouds)
        //use input parameter (?) to dertermine ratio_clouds (output:1-5) (TVOC?)
        const ratio_clouds = 3.5;
        // DRAWS ETHANOL CLOUDS - colored circles "center"
        let stepIncrease = -1;
        // ETHANOL CLOUD 001
        drawCloud(breathData.data.breath.ethanol, ratio_clouds, 20, WHITE, RED_ETHANOL, stepIncrease, CENTER);
        // ETHANOL CLOUD 002
        drawCloud(breathData.data.breath.ethanol, ratio_clouds, 20, WHITE, RED_ETHANOL, stepIncrease, CENTER);
        drawCloud(breathData.data.breath.ethanol, ratio_clouds, 20, WHITE, YELLOW, stepIncrease, CENTER);
        // DRAWS H2 CLOUDS - colored circles "perimeter"
        drawCloud(breathData.data.breath.h2, ratio_clouds, 20, WHITE, PINK1, stepIncrease, CENTER);
        drawCloud(breathData.data.breath.h2, ratio_clouds, 20, WHITE, PINK, stepIncrease, CENTER);
        drawCloud(breathData.data.breath.h2, ratio_clouds, 20, WHITE, VIOLET1, stepIncrease, CENTER);
        drawCloud(breathData.data.breath.h2, ratio_clouds, 20, WHITE, PURPLE, stepIncrease, CENTER);
        drawCloud(breathData.data.breath.h2, ratio_clouds, 20, WHITE, ROSA, 6, CENTER);
        drawCloud(breathData.data.breath.h2, ratio_clouds, 20, WHITE, ORANGE_H2, 4, CENTER);

        //DEFINES NUMBER OF WHITE LINES (breath.eCO2 * ratio_lines)
        //use input parameter (?) to dertermine ratio_lines (output:1.9-2.3)
        const ratio_lines = 2.2;
        //possibly introduce variable for white lines alpha channel

        p.resetMatrix()
        stepSize = 15;
        chaos.stepSize = stepSize;
        posX = 0;
        chaos.posX = posX;
        posY = 0;
        chaos.posY = posY;

        // DRAWS eCO2 LINES - white lines on top
        drawGeometricalLines(breathData.data.breath.eCO2, (1/64*ratio_lines), 1.5, WHITE3, 800, 8, 8);
        // DRAWS eCO2 LINES - white lines on top
        drawGeometricalLines(breathData.data.breath.eCO2, (1/8*ratio_lines), 1, WHITE2, 800, 4, 4);
        // DRAWS eCO2 LINES - white lines on top
        drawGeometricalLines(breathData.data.breath.eCO2, (1/32*ratio_lines), 1, WHITE2, 800, 2, 2);
        // DRAWS eCO2 LINES - white lines on top
        drawGeometricalLines(breathData.data.breath.eCO2, (1/32*ratio_lines), 1, WHITE2, 800, 1, 1);

        stepSize = 20;
        chaos.stepSize = stepSize;
        //use input parameter (?) to dertermine ratio_stars (output:2-6)
        const ratioStars = 4 * breathData.data.breath.eCO2;

        // DRAWS eCO2 SPRAYS - white stars & tail (breath.eCO2) * ratio_stars
        drawCharacterSpray(ratioStars, breathData.data.breath.hum, 20, alphabet, WHITE1, WHITE2, 2);

        // posX = 500;
        // posY = 500;
        // // DRAWS LOPHI LOGO
        // // p.textAlign(p.RIGHT, p.BOTTOM);
        // p.noStroke();
        // p.fill('rgba(255,255,255, 1)');
        // //textFont(use something which is similarly thin to white lines or check with design guidelines?!);
        // p.textSize(100);
        // p.text("Lo⁺φ Breath For Sale #" + breath.data.hash, 3200, 1200);


        p5Instance.saveCanvas(canvas, imageFilePath, 'png').then(f => {
            // console.log(`saved canvas as ${f}`);
            process.exit(0);
        }).catch(console.error);
    };
}

let p5Instance = p5.createSketch(sketch);

