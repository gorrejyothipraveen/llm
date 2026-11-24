function calculateLoss(prediction, target) {
  return (target - prediction) ** 2;
}

const prediction = 5.34;
const target = 6;

const loss = calculateLoss(prediction, target);

console.log("Loss:", loss);