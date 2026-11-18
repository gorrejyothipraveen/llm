const text = await Deno.readTextFile("./data/input.txt");

const vocabulary = [...new Set(text)];

const charToId = new Map(
  vocabulary.map((char, index) => [char, index])
);

const idToChar = new Map(
  vocabulary.map((char, index) => [index, char])
);

// Encoding: Text → Numbers
function encode(text) {
  return [...text].map(char => charToId.get(char));
}

// Decoding: Numbers → Text
function decode(ids) {
  return ids.map(id => idToChar.get(id)).join("");
}

// Test

const encoded = encode("hello");

const inputs = encoded.slice(0, -1);
const targets = encoded.slice(1);

console.log("Inputs:", inputs);
console.log("Targets:", targets);