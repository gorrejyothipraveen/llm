function relu(x) {
  return Math.max(0, x);
}

function neuron(inputs, weights, bias) {
  let output = bias;

  for (let i = 0; i < inputs.length; i++) {
    output += inputs[i] * weights[i];
  }

  return relu(output);
}

// Input layer
const inputs = [2, 3];

// Hidden layer: two neurons
const hidden1 = neuron(inputs, [0.5, 0.8], 1);
const hidden2 = neuron(inputs, [0.2, 0.4], 0.5);

// Output layer: one neuron
const output = neuron(
  [hidden1, hidden2],
  [0.7, 0.6],
  1
);

console.log("Hidden outputs:", hidden1, hidden2);
console.log("Final output:", output);