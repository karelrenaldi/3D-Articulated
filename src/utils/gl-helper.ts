import { DEFAULT_VALUE } from "../config/constant";
import { BufferVertex, GLObject } from "../types/type";
import { m4 } from "./matrix";
import { getVectorNormals } from "./vector";

export class GLHelper {
  private gl: WebGL2RenderingContext;
  private shaderProgram: WebGLProgram;

  public buffers: BufferVertex[];
  public vertexPosition: number[][];

  private scale: number[];
  private rotation: number[];
  private position: number[];

  private rotateAxis: number;
  private projectMode: number;
  private rotateToggle: boolean;
  private shadingState: boolean;

  // For orhographic purpose
  private thetaDeg: number;
  private phiDeg: number;

  // Look at camera settings
  public eye: number[];
  public center: number[];
  public up: number[];

  constructor(gl: WebGL2RenderingContext, shaderProgram: WebGLProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;

    this.vertexPosition = null;
    this.buffers = null;

    this.scale = DEFAULT_VALUE.scale;
    this.position = DEFAULT_VALUE.position;
    this.rotation = DEFAULT_VALUE.rotation;

    this.rotateAxis = 0;
    this.projectMode = 0;
    this.rotateToggle = DEFAULT_VALUE.rotateToggle;
    this.shadingState = DEFAULT_VALUE.shadingState;

    this.thetaDeg = 45;
    this.phiDeg = 45;

    this.eye = DEFAULT_VALUE.eye;
    this.center = DEFAULT_VALUE.center;
    this.up = DEFAULT_VALUE.up;
  }

  reset(): void {
    this.scale = [1, 1, 1];
    this.rotation = [0, 0, 0];
    this.position = [0, 0, 0];
    this.eye = [0, 0, 20];
    this.center = [0, 0, 0];
    this.up = [0, 1, 0];
    this.shadingState = false;
    this.rotateToggle = true;
  }

  cleanScreen(): void {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clearDepth(1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  bindVertex(vertexPosition: number[], faceColors: number[][]): BufferVertex {
    const gl = this.gl;

    // Binding vertex position (object vertex position).
    const vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexPosition),
      gl.STATIC_DRAW
    );

    // Binding vertex normal (normal vertices for compute lighting).
    const vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(getVectorNormals(vertexPosition)),
      gl.STATIC_DRAW
    );

    const colors = [];
    for (let i = 0; i < faceColors.length; ++i) {
      for (let j = 0; j < 4; ++j) {
        for (let k = 0; k < faceColors[i].length; ++k) {
          colors.push(faceColors[i][k]);
        }
      }
    }

    // Binding colors.
    const colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(colors),
      this.gl.STATIC_DRAW
    );

    const indices = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ];

    // Binding indices (tell webgl 1 faces is two triangle).
    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );

    return {
      position: vertexPositionBuffer,
      normal: vertexNormalBuffer,
      color: colorsBuffer,
      indices: indicesBuffer,
    };
  }

  drawModel(obj: GLObject): void {
    const listVertexAll = obj.vertex;
    const vertexPosition = [];
    const facesColor = [];
    const length_rusuk = obj.num_rusuk;
    for (let i = 0; i < length_rusuk; i++) {
      const rusuk = obj.rusuk[i];
      let position = [];
      const index = rusuk.index;
      let listColor = [];
      const length_sisi = rusuk.num_sisi;
      for (let j = 0; j < length_sisi; j++) {
        position = position.concat(
          listVertexAll[index[j][0]],
          listVertexAll[index[j][1]],
          listVertexAll[index[j][2]],
          listVertexAll[index[j][3]]
        );
        listColor.push(rusuk.color[j]);
      }
      facesColor.push(listColor);
      vertexPosition.push(position);
    }

    this.vertexPosition = vertexPosition;
    this.buffers = [];

    for (let i = 0; i < vertexPosition.length; i++) {
      const buffer = this.bindVertex(vertexPosition[i], facesColor[i]);
      this.buffers.push(buffer);
    }
  }

  startProjectCalc(aspectRatio: number, projectMode: number): number[] {
    const fov = (45 * Math.PI) / 180; // in radians
    let projectionMatrix = m4.identity();

    // Orthographic Projection Viewing
    if (projectMode == 0) {
      projectionMatrix = m4.ortho(projectionMatrix, -5, 5, -5, 5, 0.1, 100);
    }

    // Oblique Projection Viewing
    else if (projectMode == 1) {
      let m = m4.identity();
      let n = m4.identity();
      m = m4.oblique(projectionMatrix, -this.thetaDeg, -this.phiDeg);
      n = m4.ortho(projectionMatrix, -5, 5, -5, 5, 0.1, 100);
      projectionMatrix = m4.multiply(m, n);

      // Now move the drawing position a bit
      projectionMatrix = m4.translate(projectionMatrix, 3, 3, 3);
    }

    // Perspective Projection View
    else if (projectMode == 2) {
      projectionMatrix = m4.perspective(fov, aspectRatio, 0.1, 100);
    }
    return projectionMatrix;
  }

  bindBufferToAttr(gl: WebGL2RenderingContext, buffVertex: BufferVertex): void {
    // Bind position buffer to vertexPosition attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffVertex.position);
    let aVertexPosition = gl.getAttribLocation(
      this.shaderProgram,
      "aVertexPosition"
    );
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);

    // Bind color buffer to vertexColor attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffVertex.color);
    let aVertexColor = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexColor);

    // Bind normal buffer to vertexNormal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffVertex.normal);
    let aVertexNormal = gl.getAttribLocation(
      this.shaderProgram,
      "aVertexNormal"
    );
    gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexNormal);

    // Bind indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffVertex.indices);
  }

  startShading(
    gl: WebGL2RenderingContext,
    projectionMatrix: number[],
    modelViewMatrix: number[],
    normalMatrix: number[]
  ): void {
    // Use shader program
    gl.useProgram(this.shaderProgram);

    // Set the shader uniforms for each uniform variable
    let uProjectionMatrix = gl.getUniformLocation(
      this.shaderProgram,
      "uProjectionMatrix"
    );
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

    let uModelViewMatrix = gl.getUniformLocation(
      this.shaderProgram,
      "uModelViewMatrix"
    );
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

    let uNormalMatrix = gl.getUniformLocation(
      this.shaderProgram,
      "uNormalMatrix"
    );
    gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix);

    let uShading = gl.getUniformLocation(this.shaderProgram, "uShading");
    let shadingMode = 0;
    if (this.shadingState) shadingMode = 1;
    gl.uniform1i(uShading, shadingMode);
  }

  // Draw scene from buffers and GL params
  drawScene(
    buffVertex: BufferVertex,
    diffTime: number,
    verticesCount: number
  ): void {
    let gl = this.gl;

    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Create projection view matrix
    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let projectionMatrix = this.startProjectCalc(aspectRatio, this.projectMode);

    // Create camera matrix
    let cameraMatrix = m4.identity();
    cameraMatrix = m4.lookAt(this.eye, this.center, this.up);

    // Check for the auto rotate toggle
    if (!this.rotateToggle) {
      this.rotation[this.rotateAxis] += diffTime * 0.5;
    }
    // Create view matrix
    let viewMatrix = m4.inverse(cameraMatrix);
    // Update rotation on view matrix
    viewMatrix = m4.xRotate(viewMatrix, this.rotation[0]);
    viewMatrix = m4.yRotate(viewMatrix, this.rotation[1]);
    viewMatrix = m4.zRotate(viewMatrix, this.rotation[2]);

    // Create model matrix
    let modelMatrix = m4.identity();
    modelMatrix = m4.translate(
      modelMatrix,
      this.position[0],
      this.position[1],
      this.position[2]
    );
    modelMatrix = m4.scale(
      modelMatrix,
      this.scale[0],
      this.scale[1],
      this.scale[2]
    );
    let modelViewMatrix = m4.multiply(viewMatrix, modelMatrix);

    // Create shading and lighting matrix
    let normalMatrix = m4.inverse(modelViewMatrix);
    normalMatrix = m4.transpose(normalMatrix);

    // Bind all buffer to corresponding attributes
    this.bindBufferToAttr(gl, buffVertex);

    // Start shading with the shader program
    this.startShading(gl, projectionMatrix, modelViewMatrix, normalMatrix);

    gl.drawElements(gl.TRIANGLES, verticesCount / 2, gl.UNSIGNED_SHORT, 0);
    this.gl = gl;
  }

  setPositionX(position) {
    this.position[0] = position;
  }

  setPositionY(position) {
    this.position[1] = position;
  }

  setPositionZ(position) {
    this.position[2] = position;
  }

  setScaleX(scale) {
    this.scale[0] = scale;
  }

  setScaleY(scale) {
    this.scale[1] = scale;
  }

  setScaleZ(scale) {
    this.scale[2] = scale;
  }

  setRotateX(value) {
    this.rotation[0] = value;
  }

  setRotateY(value) {
    this.rotation[1] = value;
  }

  setRotateZ(value) {
    this.rotation[2] = value;
  }

  setProjectMode(value) {
    this.projectMode = value;
  }

  setShadingState(value) {
    this.shadingState = value;
  }
  setCameraAngle(value) {
    this.eye[0] = value;
  }
  setCameraZoom(value) {
    this.center[0] = value;
  }
}
