const text = await Deno.readTextFile("./data/input.txt");

const vocabulary = [...new Set(text)];

const charToId = new Map(
  vocabulary.map((char, index) => [char, index])
);

const idToChar = new Map(
  vocabulary.map((char, index) => [index, char])
);

console.log("Vocabulary:", vocabulary);
console.log("Character to ID:", charToId);
console.log("ID to Character:", idToChar);