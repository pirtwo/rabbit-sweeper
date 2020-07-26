import * as math from "./math";

export function wait(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}

/**
 * shuffles the array with Fisher–Yates algorithm.
 * @param {Array} array 
 */
export function shuffle(array) {
    let shuffledArray = array.slice(0);

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}

export function getRandomElement(arr = []) {
    return arr[math.randInt(0, arr.length - 1)];
}