export type GLObject = {
  num_vertex: number;
  vertex: number[][];
  num_rusuk: number;
  rusuk: {
    num_sisi: number;
    index: number[][];
    color: number[][];
  }[];
};

export type BufferVertex = {
  // position: WebGLBuffer;
  // normal: WebGLBuffer;
  color: WebGLBuffer;
  // indices: WebGLBuffer;
  // tangent: WebGLBuffer;
  // bitangent: WebGLBuffer;
  // texBuffer: WebGLBuffer;
};

export type NodeModel = {
  transform: number[];
  sibling: number;
  child: number;
}
