const input = 2;
const target = 6;

let weight = 1;
let bias = 0;

const learningRate = 0.05;
const epochs = 20;

for (let epoch = 1; epoch <= epochs; epoch++) {
  // 1. Forward pass
  const prediction = input * weight + bias;

  // 2. Calculate loss
  const loss = (prediction - target) ** 2;

  // 3. Backpropagation
  const weightGradient = 2 * (prediction - target) * input;
  const biasGradient = 2 * (prediction - target);

  // 4. Gradient descent
  weight -= learningRate * weightGradient;
  bias -= learningRate * biasGradient;

  console.log(`Epoch ${epoch}: Loss = ${loss.toFixed(4)}`);
}

console.log("Final weight:", weight);
console.log("Final bias:", bias);