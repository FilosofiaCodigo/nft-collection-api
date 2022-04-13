

module.exports = function (canvasWidth, canvasHeight) {
    let module = {};

    let seed, posX, posY, stepSize;

    module.seed = seed;
    module.posX = posX;
    module.posY = posY;
    module.stepSize = stepSize;


    // Deterministic pseudo random generator based on a stateful initial state called 'seed'.
    // Returns a new number every time it is called.
    function _pseudo_random() {
        let x = Math.sin(module.seed++) * 10000;
        return x - Math.floor(x);
    }

    // Moves cursor back to the center of the canvas when it reaches outside of it.
    function _reset_pos_center() {
        if (module.posX > canvasWidth || module.posX < 0 || module.posY < 0 || module.posY > canvasHeight) {
            module.posX = canvasWidth / 2;
            module.posY = canvasHeight / 2;
            console.log("center");
        }
    }

    // Moves cursor around the canvas when it reaches outside of it.
    function _reset_pos() {
        if (module.posX > canvasWidth) module.posX = 0;
        if (module.posX < 0) module.posX = canvasWidth;
        if (module.posY < 0) module.posY = canvasHeight;
        if (module.posY > canvasHeight) module.posY = 0;
        // console.log("not center");
    }

    function _random_range(max_int) {
        return Math.floor(_pseudo_random() * max_int);
    }

    // Picks a number from zero to the max_int minus one
    module.random_range = _random_range;

    // Moves cursor to the canvas center
    module.recenter = function recenter() {
        module.posX = canvasWidth / 2;
        module.posY = canvasHeight / 2;
    };

    // Moves the cursor to a random position in the canvas
    module.random_pos = function random_pos() {
        module.posX = _random_range(canvasWidth);
        module.posY = _random_range(canvasHeight);
    };

    // Selects a random character from a string
    module.rand_char = function rand_char(possible='ab') {
        return possible.charAt(Math.floor(_pseudo_random() * possible.length));
    };

    // Moves the cursor in a random direction a distance defined by stepSize
    // Takes multipliers in consideration
    module.drunkard_walk_weighted = function drunkard_walk_weighted(stepSizeMultiX = 1, stepSizeMultiY = 1, center = false) {
        let rnd = _random_range(3)
        if (rnd === 2) rnd = -1;
        module.posX += module.stepSize * rnd * stepSizeMultiX;
        rnd = _random_range(3)
        if (rnd === 2) rnd = -1;
        module.posY += module.stepSize * rnd * stepSizeMultiY;
        if (center === true){
            _reset_pos_center();
        } else {
            _reset_pos();
        }
    };

    // Moves the cursor in a random direction a distance defined by stepSize
    module.drunkard_walk = function drunkard_walk(center = false) {
        let rnd = _random_range(3);
        if (rnd === 2) rnd = -1;
        module.posX += module.stepSize * rnd;
        rnd = _random_range(3);
        if (rnd === 2) rnd = -1;
        module.posY += module.stepSize * rnd;
        if (center === true){
            _reset_pos_center();
        } else {
            _reset_pos();
        }
    };

    // Moves the cursor in a random direction a distance defined by stepSize
    // Very low chance to stay in the same spot
    module.drunkard_walk_faster = function drunkard_walk_faster(center = false) {
        module.posX -= module.stepSize * _random_range(2);
        module.posY -= module.stepSize * _random_range(2);
        module.posX += module.stepSize * _random_range(2);
        module.posY += module.stepSize * _random_range(2);
        if (center === true){
            _reset_pos_center();
        } else {
            _reset_pos();
        }
    };

    // Moves the cursor in a random ramp down (when looking from the left to the right)
    module.lines_a = function lines_a(center = false) {
        let first = _random_range(2);
        let second = _random_range(2);
        module.posX -= module.stepSize * first;
        module.posY -= module.stepSize * second;
        module.posX += module.stepSize * second;
        module.posY += module.stepSize * first;
        if (center === true){
            _reset_pos_center();
        } else {
            _reset_pos();
        }
    };

    // Moves the cursor in a random ramp up (when looking from the left to the right)
    module.lines_b = function lines_b(center = false) {
        let first = _random_range(2);
        let second = _random_range(2);
        module.posX -= module.stepSize * first;
        module.posY -= module.stepSize * first;
        module.posX += module.stepSize * second;
        module.posY += module.stepSize * second;
        if (center === true){
            _reset_pos_center();
        } else {
            _reset_pos();
        }
    };

    // Converts the input's range into it's scale in a different range.
    module.range_scale = function range_scale(input, input_start, input_end, output_start, output_end){
        let slope = (output_end - output_start) / (input_end - input_start);
        return Math.floor(output_start + slope * ((input) - input_start));
    }

    return module;
};
