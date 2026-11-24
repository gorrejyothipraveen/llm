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

const encoded = encode(text);

const inputs = encoded.slice(0, -1);
const targets = encoded.slice(1);

const embeddingDimension = 8;
const vocabSize = vocabulary.length;

function initializeEmbeddings(vocabSize, embeddingDimension) {
  return Array.from({ length: vocabSize }, () =>
    Array.from(
      { length: embeddingDimension },
      () => (Math.random() * 2 - 1) * 0.1
    )
  );
}

const embeddingTable = initializeEmbeddings(
  vocabSize,
  embeddingDimension
);

function getEmbedding(tokenId) {
  return embeddingTable[tokenId];
}

function embedTokens(tokenIds) {
  return tokenIds.map(tokenId => getEmbedding(tokenId));
}

const blockSize = 8;

const sampleTokenIds = encoded.slice(0, blockSize);


const embeddings = embedTokens(sampleTokenIds);

function initializePositionalEmbeddings(blockSize, embeddingDimension) {
  return Array.from({ length: blockSize }, () =>
    Array.from(
      { length: embeddingDimension },
      () => (Math.random() * 2 - 1) * 0.1
    )
  );
}

const positionalEmbeddingTable = initializePositionalEmbeddings(
  blockSize,
  embeddingDimension
);

// function addVectors(a, b) {
//   return a.map((value, index) => value + b[index]);
// }

// function addPositionalEmbeddings(tokenEmbeddings) {
//   return tokenEmbeddings.map((tokenEmbedding, position) => {
//     return addVectors(
//       tokenEmbedding,
//       positionalEmbeddingTable[position]
//     );
//   });
// }

// const tokenEmbeddings = embedTokens(sampleTokenIds);

// const inputEmbeddings = addPositionalEmbeddings(tokenEmbeddings);

// function matrixMultiply(A, B) {
//   const result = [];

//   for (let i = 0; i < A.length; i++) {
//     const row = [];

//     for (let j = 0; j < B[0].length; j++) {
//       let sum = 0;

//       for (let k = 0; k < B.length; k++) {
//         sum += A[i][k] * B[k][j];
//       }

//       row.push(sum);
//     }

//     result.push(row);
//   }

//   return result;
// }

// const headSize = 8;

// function initializeMatrix(rows, columns) {
//   return Array.from({ length: rows }, () =>
//     Array.from(
//       { length: columns },
//       () => (Math.random() * 2 - 1) * 0.1
//     )
//   );
// }

// function transpose(matrix) {
//   return matrix[0].map((_, column) =>
//     matrix.map(row => row[column])
//   );
// }

// function calculateAttentionScores(queries, keys) {
//   const keysTransposed = transpose(keys);

//   const scores = matrixMultiply(queries, keysTransposed);

//   const scale = Math.sqrt(headSize);

//   return scores.map(row =>
//     row.map(score => score / scale)
//   );
// }

// const WQ = initializeMatrix(embeddingDimension, headSize);
// const WK = initializeMatrix(embeddingDimension, headSize);
// const WV = initializeMatrix(embeddingDimension, headSize);

// const queries = matrixMultiply(inputEmbeddings, WQ);
// const keys = matrixMultiply(inputEmbeddings, WK);
// const values = matrixMultiply(inputEmbeddings, WV);

// // console.log("Queries:", queries);
// // console.log("Keys:", keys);
// // console.log("Values:", values);
// // console.log(queries);
// function applyCausalMask(scores) {
//   return scores.map((row, i) =>
//     row.map((score, j) =>
//       j > i ? -Infinity : score
//     )
//   );
// }


// const attentionScores = calculateAttentionScores(queries, keys);

// const maskedScores = applyCausalMask(attentionScores);

// function softmax(row) {
//   const max = Math.max(...row);

//   const exps = row.map(value =>
//     Math.exp(value - max)
//   );

//   const sum = exps.reduce((total, value) => total + value, 0);

//   return exps.map(value => value / sum);
// }

// function calculateAttentionWeights(maskedScores) {
//   return maskedScores.map(row => softmax(row));
// }

// const attentionWeights = calculateAttentionWeights(maskedScores);

// const attentionOutput = matrixMultiply(
//   attentionWeights,
//   values
// );

// function addMatrices(A, B) {
//   return A.map((row, i) =>
//     row.map((value, j) => value + B[i][j])
//   );
// }

// const residualOutput = addMatrices(
//   inputEmbeddings,
//   attentionOutput
// );

// function layerNorm(matrix, epsilon = 1e-5) {
//   return matrix.map(row => {
//     const mean = row.reduce((sum, x) => sum + x, 0) / row.length;

//     const variance = row.reduce(
//       (sum, x) => sum + (x - mean) ** 2,
//       0
//     ) / row.length;

//     return row.map(x =>
//       (x - mean) / Math.sqrt(variance + epsilon)
//     );
//   });
// }

// const normalizedOutput = layerNorm(residualOutput);

// const hiddenSize = 32;

// const W1 = initializeMatrix(embeddingDimension, hiddenSize);
// const W2 = initializeMatrix(hiddenSize, embeddingDimension);

// const b1 = Array(hiddenSize).fill(0);
// const b2 = Array(embeddingDimension).fill(0);

// function reluMatrix(matrix) {
//   return matrix.map(row =>
//     row.map(value => Math.max(0, value))
//   );
// }

// function feedForward(input) {
//   const hidden = matrixMultiply(input, W1);

//   const hiddenWithBias = hidden.map(row =>
//     row.map((value, i) => value + b1[i])
//   );

//   const activated = reluMatrix(hiddenWithBias);

//   const output = matrixMultiply(activated, W2);

//   return output.map(row =>
//     row.map((value, i) => value + b2[i])
//   );
// }

// const ffnOutput = feedForward(normalizedOutput);

// const secondResidual = addMatrices(
//   normalizedOutput,
//   ffnOutput
// );

// const transformerOutput = layerNorm(secondResidual);

// const outputWeights = initializeMatrix(
//   embeddingDimension,
//   vocabSize
// );

// const outputBias = Array(vocabSize).fill(0);

// function generateLogits(transformerOutput) {
//   const logits = matrixMultiply(
//     transformerOutput,
//     outputWeights
//   );

//   return logits.map(row =>
//     row.map((value, i) => value + outputBias[i])
//   );
// }

// const logits = generateLogits(transformerOutput);

// function calculateProbabilities(logits) {
//   return logits.map(row => softmax(row));
// }

// const probabilities = calculateProbabilities(logits);

// function calculateLoss(probabilities, targets) {
//   let totalLoss = 0;

//   for (let i = 0; i < targets.length; i++) {
//     const correctTokenId = targets[i];

//     const correctProbability =
//       probabilities[i][correctTokenId];

//     totalLoss += -Math.log(correctProbability + 1e-10);
//   }

//   return totalLoss / targets.length;
// }


// const sampleTargets = encoded.slice(1, blockSize + 1);

// // const loss = calculateLoss(
// //   probabilities,
// //   sampleTargets
// // );


// function calculateLogitsGradients(probabilities, targets) {
//   const sequenceLength = targets.length;

//   return probabilities.map((row, i) =>
//     row.map((probability, j) => {
//       const targetValue = j === targets[i] ? 1 : 0;

//       return (probability - targetValue) / sequenceLength;
//     })
//   );
// }

// function calculateOutputGradients(transformerOutput, logitsGradients) {
//   const outputWeightGradients = matrixMultiply(
//     transpose(transformerOutput),
//     logitsGradients
//   );

//   const outputBiasGradients = logitsGradients[0].map((_, j) =>
//     logitsGradients.reduce((sum, row) => sum + row[j], 0)
//   );

//   return {
//     outputWeightGradients,
//     outputBiasGradients
//   };
// }

// function updateWeights(weights, gradients, learningRate) {
//   return weights.map((row, i) =>
//     row.map((value, j) =>
//       value - learningRate * gradients[i][j]
//     )
//   );
// }

// function updateBias(bias, gradients, learningRate) {
//   return bias.map((value, i) =>
//     value - learningRate * gradients[i]
//   );
// }

// const learningRate = 0.01;


// const logitsGradients = calculateLogitsGradients(
//   probabilities,
//   sampleTargets
// );

// const {
//   outputWeightGradients,
//   outputBiasGradients
// } = calculateOutputGradients(
//   transformerOutput,
//   logitsGradients
// );

// const updatedOutputWeights = updateWeights(
//   outputWeights,
//   outputWeightGradients,
//   learningRate
// );

// const updatedOutputBias = updateBias(
//   outputBias,
//   outputBiasGradients,
//   learningRate
// );



// const oldWeight = outputWeights[0][0];


// outputWeights.splice(
//   0,
//   outputWeights.length,
//   ...updatedOutputWeights
// );

// outputBias.splice(
//   0,
//   outputBias.length,
//   ...updatedOutputBias
// );


// const newLogits = generateLogits(transformerOutput);
// const newProbabilities = calculateProbabilities(newLogits);

// const newLoss = calculateLoss(
//   newProbabilities,
//   sampleTargets
// );

// class Value {
//   constructor(data, children = [], operation = "") {
//     this.data = data;
//     this.grad = 0;
//     this.children = children;
//     this.operation = operation;
//     this._backward = () => {};
//   }

//   add(other) {
//     if (!(other instanceof Value)) other = new Value(other);

//     const result = new Value(
//       this.data + other.data,
//       [this, other],
//       "+"
//     );

//     result._backward = () => {
//       this.grad += result.grad;
//       other.grad += result.grad;
//     };

//     return result;
//   }

//   mul(other) {
//     if (!(other instanceof Value)) other = new Value(other);

//     const result = new Value(
//       this.data * other.data,
//       [this, other],
//       "*"
//     );

//     result._backward = () => {
//       this.grad += other.data * result.grad;
//       other.grad += this.data * result.grad;
//     };

//     return result;
//   }

//   pow(exponent) {
//     const result = new Value(
//       this.data ** exponent,
//       [this],
//       `pow(${exponent})`
//     );

//     result._backward = () => {
//       this.grad +=
//         exponent * this.data ** (exponent - 1) * result.grad;
//     };

//     return result;
//   }

//   exp() {
//     const result = new Value(
//       Math.exp(this.data),
//       [this],
//       "exp"
//     );

//     result._backward = () => {
//       this.grad += result.data * result.grad;
//     };

//     return result;
//   }

//   log() {
//     const result = new Value(
//       Math.log(this.data),
//       [this],
//       "log"
//     );

//     result._backward = () => {
//       this.grad += (1 / this.data) * result.grad;
//     };

//     return result;
//   }

//   backward() {
//     const visited = new Set();
//     const graph = [];

//     function buildGraph(value) {
//       if (visited.has(value)) return;

//       visited.add(value);

//       for (const child of value.children) {
//         buildGraph(child);
//       }

//       graph.push(value);
//     }

//     buildGraph(this);

//     this.grad = 1;

//     for (const value of graph.reverse()) {
//       value._backward();
//     }
//   }

//   div(other) {
//   if (!(other instanceof Value)) other = new Value(other);

//   const result = new Value(
//     this.data / other.data,
//     [this, other],
//     "/"
//   );

//   result._backward = () => {
//     this.grad += (1 / other.data) * result.grad;
//     other.grad += (-this.data / other.data ** 2) * result.grad;
//   };

//   return result;
// }

//   relu() {
//   const result = new Value(
//     Math.max(0, this.data),
//     [this],
//     "relu"
//   );

//   result._backward = () => {
//     this.grad += (this.data > 0 ? 1 : 0) * result.grad;
//   };

//   return result;
// }



// }

// function valueSoftmax(row) {
//   const maxValue = Math.max(...row.map(value => value.data));

//   const exps = row.map(value =>
//     value.add(-maxValue).exp()
//   );

//   const sum = exps.reduce(
//     (total, value) => total.add(value),
//     new Value(0)
//   );

//   return exps.map(value => value.div(sum));
// }

// function valueAttentionScores(queries, keys) {
//   const keysTransposed = keys[0].map((_, column) =>
//     keys.map(row => row[column])
//   );

//   const scores = valueMatrixMultiply(
//     queries,
//     keysTransposed
//   );

//   const scale = Math.sqrt(headSize);

//   return scores.map((row, i) =>
//     row.map((score, j) =>
//       j > i ? new Value(0) : score.mul(1 / scale)
//     )
//   );
// }

// function valueAttentionWeights(scores) {
//   return scores.map((row, i) =>
//     valueSoftmax(row.map((score, j) =>
//       j > i ? new Value(-Infinity) : score
//     ))
//   );
// }

// const x = new Value(2);
// const w = new Value(3);
// const b = new Value(1);

// const prediction = x.mul(w).add(b);
// const loss = prediction.pow(2);

// loss.backward();

// function valueMatrixMultiply(A, B) {
//   const result = [];

//   for (let i = 0; i < A.length; i++) {
//     const row = [];

//     for (let j = 0; j < B[0].length; j++) {
//       let sum = new Value(0);

//       for (let k = 0; k < B.length; k++) {
//         sum = sum.add(A[i][k].mul(B[k][j]));
//       }

//       row.push(sum);
//     }

//     result.push(row);
//   }


//   return result;
// }

// const a = [
//   [new Value(2), new Value(3)]
// ];

// const b3 = [
//   [new Value(4)],
//   [new Value(5)]
// ];

// const result = valueMatrixMultiply(a, b3);



// result[0][0].backward();

// function toValueMatrix(matrix) {
//   return matrix.map(row =>
//     row.map(value => new Value(value))
//   );
// }

// const valueTransformerOutput = toValueMatrix(transformerOutput);
// const valueOutputWeights = toValueMatrix(outputWeights);
// const valueOutputBias = outputBias.map(value => new Value(value));
// function valueGenerateLogits(input, weights, bias) {
//   const logits = valueMatrixMultiply(input, weights);

//   return logits.map(row =>
//     row.map((value, i) => value.add(bias[i]))
//   );
// }

// const valueLogits = valueGenerateLogits(
//   valueTransformerOutput,
//   valueOutputWeights,
//   valueOutputBias
// );

// function valueCrossEntropyLoss(logits, targets) {
//   let totalLoss = new Value(0);

//   for (let i = 0; i < targets.length; i++) {
//     const row = logits[i];

//     // Stable log-softmax calculation
//     const maxLogit = Math.max(...row.map(x => x.data));

//     let expSum = new Value(0);

//     for (const logit of row) {
//       expSum = expSum.add(
//         logit.add(-maxLogit).exp()
//       );
//     }

//     const logSumExp = expSum.log().add(maxLogit);

//     const sampleLoss = logSumExp.add(
//       row[targets[i]].mul(-1)
//     );

//     totalLoss = totalLoss.add(sampleLoss);
//   }

//   return totalLoss.mul(1 / targets.length);
// }

// const autoLoss = valueCrossEntropyLoss(
//   valueLogits,
//   sampleTargets
// );

// autoLoss.backward();

// function valueReluMatrix(matrix) {
//   return matrix.map(row =>
//     row.map(value => value.relu())
//   );
// }

// const testValues = [
//   new Value(-2),
//   new Value(0),
//   new Value(3)
// ];

// const reluResults = testValues.map(value => value.relu());

// const testLoss = reluResults.reduce(
//   (sum, value) => sum.add(value),
//   new Value(0)
// );

// testLoss.backward();

// const testInput = toValueMatrix(transformerOutput);

// function valueFeedForward(input, weights1, bias1, weights2, bias2) {
//   const hidden = valueMatrixMultiply(input, weights1);

//   const hiddenWithBias = hidden.map(row =>
//     row.map((value, i) => value.add(bias1[i]))
//   );

//   const activated = valueReluMatrix(hiddenWithBias);

//   const output = valueMatrixMultiply(activated, weights2);

//   return output.map(row =>
//     row.map((value, i) => value.add(bias2[i]))
//   );
// }

// const valueW1 = toValueMatrix(W1);
// const valueW2 = toValueMatrix(W2);

// const valueB1 = b1.map(value => new Value(value));
// const valueB2 = b2.map(value => new Value(value));

// const ffnResult = valueFeedForward(
//   testInput,
//   valueW1,
//   valueB1,
//   valueW2,
//   valueB2
// );


// const ffnTestLoss = ffnResult[0].reduce(
//   (sum, value) => sum.add(value),
//   new Value(0)
// );

// ffnTestLoss.backward();


// const ffnLearningRate = 0.01;

// // Update W1
// for (let i = 0; i < W1.length; i++) {
//   for (let j = 0; j < W1[i].length; j++) {
//     W1[i][j] -= ffnLearningRate * valueW1[i][j].grad;
//   }
// }

// // Update W2
// for (let i = 0; i < W2.length; i++) {
//   for (let j = 0; j < W2[i].length; j++) {
//     W2[i][j] -= ffnLearningRate * valueW2[i][j].grad;
//   }
// }

// // Update biases
// for (let i = 0; i < b1.length; i++) {
//   b1[i] -= ffnLearningRate * valueB1[i].grad;
// }

// for (let i = 0; i < b2.length; i++) {
//   b2[i] -= ffnLearningRate * valueB2[i].grad;
// }

// const divisionA = new Value(10);
// const divisionB = new Value(2);

// const divisionResult = divisionA.div(divisionB);

// divisionResult.backward();


// const softmaxInput = [
//   new Value(2),
//   new Value(1),
//   new Value(0)
// ];

// const softmaxOutput = valueSoftmax(softmaxInput);

// // Use the first probability as the test loss
// softmaxOutput[0].backward();

// function valueAttentionOutput(weights, values) {
//   return valueMatrixMultiply(weights, values);
// }

// function valueAddMatrices(A, B) {
//   return A.map((row, i) =>
//     row.map((value, j) => value.add(B[i][j]))
//   );
// }

// // Convert input embeddings and attention weights into Value objects
// const valueInputForAttention = toValueMatrix(inputEmbeddings);

// const valueWQ = toValueMatrix(WQ);
// const valueWK = toValueMatrix(WK);
// const valueWV = toValueMatrix(WV);

// // Calculate queries, keys and values
// const valueQueries = valueMatrixMultiply(
//   valueInputForAttention,
//   valueWQ
// );

// const valueKeys = valueMatrixMultiply(
//   valueInputForAttention,
//   valueWK
// );

// const valueValues = valueMatrixMultiply(
//   valueInputForAttention,
//   valueWV
// );

// // Calculate attention scores and weights
// const valueScores = valueAttentionScores(
//   valueQueries,
//   valueKeys
// );

// const valueWeights = valueAttentionWeights(valueScores);

// // Calculate attention output
// const valueAttendedOutput = valueAttentionOutput(
//   valueWeights,
//   valueValues
// );

// // Add residual connection
// const valueResidualOutput = valueAddMatrices(
//   valueInputForAttention,
//   valueAttendedOutput
// );

// const attentionTestLoss = valueAttendedOutput.flat().reduce(
//   (sum, value) => sum.add(value),
//   new Value(0)
// );

// attentionTestLoss.backward();

// function valueLayerNorm(matrix, epsilon = 1e-5) {
//   return matrix.map(row => {
//     const mean = row.reduce(
//       (sum, value) => sum.add(value),
//       new Value(0)
//     ).div(row.length);

//     const variance = row.reduce(
//       (sum, value) =>
//         sum.add(value.add(mean.mul(-1)).pow(2)),
//       new Value(0)
//     ).div(row.length);

//     const standardDeviation = variance
//       .add(epsilon)
//       .pow(0.5);

//     return row.map(value =>
//       value.add(mean.mul(-1)).div(standardDeviation)
//     );
//   });
// }

// const layerNormTestInput = toValueMatrix(inputEmbeddings);

// const layerNormTestOutput = valueLayerNorm(layerNormTestInput);

// const layerNormTestLoss = layerNormTestOutput.flat().reduce(
//   (sum, value) => sum.add(value),
//   new Value(0)
// );

// layerNormTestLoss.backward();


// function valueTransformerBlock(input, WQ, WK, WV, W1, b1, W2, b2) {
//   const queries = valueMatrixMultiply(input, WQ);
//   const keys = valueMatrixMultiply(input, WK);
//   const values = valueMatrixMultiply(input, WV);

//   const scores = valueAttentionScores(queries, keys);
//   const weights = valueAttentionWeights(scores);
//   const attended = valueAttentionOutput(weights, values);

//   const firstResidual = valueAddMatrices(input, attended);
//   const normalized = valueLayerNorm(firstResidual);

//   const feedForwardOutput = valueFeedForward(
//     normalized, W1, b1, W2, b2
//   );

//   const secondResidual = valueAddMatrices(normalized, feedForwardOutput);

//   return valueLayerNorm(secondResidual);
// }

// const blockTestInput = toValueMatrix(inputEmbeddings);

// const blockTestWQ = toValueMatrix(WQ);
// const blockTestWK = toValueMatrix(WK);
// const blockTestWV = toValueMatrix(WV);

// const blockTestW1 = toValueMatrix(W1);
// const blockTestW2 = toValueMatrix(W2);

// const blockTestB1 = b1.map(value => new Value(value));
// const blockTestB2 = b2.map(value => new Value(value));

// const blockTestOutput = valueTransformerBlock(
//   blockTestInput,
//   blockTestWQ,
//   blockTestWK,
//   blockTestWV,
//   blockTestW1,
//   blockTestB1,
//   blockTestW2,
//   blockTestB2
// );

// const blockTestLoss = blockTestOutput[2][0];

// blockTestLoss.backward();

// // Convert model parameters into Value objects
// const trainWQ = toValueMatrix(WQ);
// const trainWK = toValueMatrix(WK);
// const trainWV = toValueMatrix(WV);

// const trainW1 = toValueMatrix(W1);
// const trainW2 = toValueMatrix(W2);

// const trainB1 = b1.map(value => new Value(value));
// const trainB2 = b2.map(value => new Value(value));

// const trainOutputWeights = toValueMatrix(outputWeights);
// const trainOutputBias = outputBias.map(value => new Value(value));

// // Convert input embeddings
// const trainInput = toValueMatrix(inputEmbeddings);

// // Forward pass through the Transformer
// const trainTransformerOutput = valueTransformerBlock(
//   trainInput,
//   trainWQ, trainWK, trainWV,
//   trainW1, trainB1, trainW2, trainB2
// );

// // Generate prediction logits
// const trainLogits = valueGenerateLogits(
//   trainTransformerOutput,
//   trainOutputWeights,
//   trainOutputBias
// );

// // Calculate actual next-character prediction loss
// const trainLoss = valueCrossEntropyLoss(trainLogits, sampleTargets);


// // Backpropagation
// trainLoss.backward();




// // Update output weights
// for (const row of trainOutputWeights) {
//   for (const weight of row) {
//     weight.data -= learningRate * weight.grad;
//   }
// }

// // Update output bias
// for (const bias of trainOutputBias) {
//   bias.data -= learningRate * bias.grad;
// }

// // Reset parameter gradients
// const trainParameters = [
//   ...trainWQ.flat(),
//   ...trainWK.flat(),
//   ...trainWV.flat(),
//   ...trainW1.flat(),
//   ...trainW2.flat(),
//   ...trainB1,
//   ...trainB2,
//   ...trainOutputWeights.flat(),
//   ...trainOutputBias
// ];

// for (const parameter of trainParameters) {
//   parameter.grad = 0;
// }

// // Fresh forward pass
// const updatedInput = toValueMatrix(inputEmbeddings);

// const updatedTransformerOutput = valueTransformerBlock(
//   updatedInput,
//   trainWQ, trainWK, trainWV,
//   trainW1, trainB1, trainW2, trainB2
// );

// const updatedLogits = valueGenerateLogits(
//   updatedTransformerOutput,
//   trainOutputWeights,
//   trainOutputBias
// );

// const updatedLoss = valueCrossEntropyLoss(
//   updatedLogits,
//   sampleTargets
// );

// // Backpropagate through the complete model
// updatedLoss.backward();

// // Update all trainable parameters
// for (const parameter of trainParameters) {
//   parameter.data -= learningRate * parameter.grad;
// }

// // Run a fresh forward pass
// const finalInput = toValueMatrix(inputEmbeddings);

// const finalTransformerOutput = valueTransformerBlock(
//   finalInput,
//   trainWQ, trainWK, trainWV,
//   trainW1, trainB1, trainW2, trainB2
// );

// const finalLogits = valueGenerateLogits(
//   finalTransformerOutput,
//   trainOutputWeights,
//   trainOutputBias
// );

// const finalLoss = valueCrossEntropyLoss(
//   finalLogits,
//   sampleTargets
// );


// function trainStep(inputEmbeddings, targets) {
//   // Reset gradients from the previous training step
//   for (const parameter of trainParameters) {
//     parameter.grad = 0;
//   }

//   // Forward pass
//   const stepInput = toValueMatrix(inputEmbeddings);

//   const stepOutput = valueTransformerBlock(
//     stepInput,
//     trainWQ, trainWK, trainWV,
//     trainW1, trainB1, trainW2, trainB2
//   );

//   const stepLogits = valueGenerateLogits(
//     stepOutput,
//     trainOutputWeights,
//     trainOutputBias
//   );

//   const stepLoss = valueCrossEntropyLoss(stepLogits, targets);

//   // Backpropagation
//   stepLoss.backward();

//   // Update parameters
//   for (const parameter of trainParameters) {
//     parameter.data -= learningRate * parameter.grad;
//   }

//   return stepLoss.data;
// }

// const firstTrainingLoss = trainStep(inputEmbeddings, sampleTargets);

// for (let step = 1; step <= 50; step++) {
//   let totalLoss = 0;
//   let samples = 0;

//   for (let start = 0; start < encoded.length - blockSize; start++) {
//     const tokenIds = encoded.slice(start, start + blockSize);
//     const targets = encoded.slice(start + 1, start + blockSize + 1);

//     const embeddings = addPositionalEmbeddings(
//       embedTokens(tokenIds)
//     );

//     totalLoss += trainStep(embeddings, targets);
//     samples++;
//   }

//   if (step % 10 === 0) {
//     console.log(
//       `Step ${step}, Loss: ${(totalLoss / samples).toFixed(4)}`
//     );
//   }
// }


// function predictNextCharacter(inputIds) {
//   const input = toValueMatrix(
//     addPositionalEmbeddings(embedTokens(inputIds))
//   );

//   const output = valueTransformerBlock(
//     input,
//     trainWQ, trainWK, trainWV,
//     trainW1, trainB1, trainW2, trainB2
//   );

//   const logits = valueGenerateLogits(
//     output,
//     trainOutputWeights,
//     trainOutputBias
//   );

//   const lastLogits = logits[logits.length - 1];

//   const probabilities = softmax(
//     lastLogits.map(value => value.data)
//   );

//   console.log(
//     "Probabilities:",
//     probabilities.map((probability, id) => ({
//       character: idToChar.get(id),
//       probability: probability.toFixed(4)
//     }))
//   );

//   const predictedId = probabilities.indexOf(
//     Math.max(...probabilities)
//   );

//   return idToChar.get(predictedId);
// }




// const finalPrediction = predictNextCharacter(encode("wo"));

// console.log("Predicted next character:", finalPrediction);