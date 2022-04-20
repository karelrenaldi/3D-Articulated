const subtractVectors = (v1: number[], v2: number[]): number[] => {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
};

const crossVectors = (v1: number[], v2: number[]): number[] => [
  v1[1] * v2[2] - v1[2] * v2[1],
  v1[2] * v2[0] - v1[0] * v2[2],
  v1[0] * v2[1] - v1[1] * v2[0],
];

const normalizeVector = (v: number[]): number[] => {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

  return length > 0.00001
    ? [v[0] / length, v[1] / length, v[2] / length]
    : [0, 0, 0];
};

const getVectorNormals = (vPosition: number[]) => {
  const n = vPosition.length;

  let vecNormals = [];
  let vecTangents = [];
  let vecBitangents = [];
  for (let i = 0; i < n; i += 12) {
    const p1 = [vPosition[i], vPosition[i + 1], vPosition[i + 2]];
    const p2 = [vPosition[i + 3], vPosition[i + 4], vPosition[i + 5]];
    const p3 = [vPosition[i + 6], vPosition[i + 7], vPosition[i + 8]];

    const vec1 = subtractVectors(p2, p1);
    const vec2 = subtractVectors(p3, p1);

    const normalDirection = crossVectors(vec1, vec2);
    const vecNormal = normalizeVector(normalDirection);
    const vecTangent = normalizeVector(vec1);
    const vecBitangent = normalizeVector(vec2);

    for (let j = 0; j < 4; j++) {
      vecNormals = vecNormals.concat(vecNormal);
      vecTangents = vecTangent.concat(vecTangent);
      vecBitangents = vecBitangent.concat(vecBitangent);
    }
  }

  return [vecNormals, vecTangents, vecBitangents];
};

export { subtractVectors, normalizeVector, crossVectors, getVectorNormals };
