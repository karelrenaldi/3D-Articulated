import { DEFAULT_VALUE } from "../config/constant";
import { BufferVertex, GLObject, NodeModel } from "../types/type";
import { m4 } from "./matrix";
import { getVectorNormals, getTangent, getBitTangent  } from "./vector";

export class GLHelper {
  private gl: WebGL2RenderingContext;
  private shaderProgram: WebGLProgram;

  public buffers: BufferVertex[];
  public vertexPosition: number[][];

  private scale: number[];
  private rotation: number[];
  private rotationModel: number[];
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
  public nodeListData;

	private facesColor: number[][][];
  private attribLoc;
  private uniformLoc;
  private figure: NodeModel[];
  private theta: number[][];


  constructor(gl: WebGL2RenderingContext, shaderProgram: WebGLProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;

    this.vertexPosition = null;
    this.buffers = null;

    this.scale = DEFAULT_VALUE.scale;
    this.position = DEFAULT_VALUE.position;
    this.rotation = DEFAULT_VALUE.rotation;
    this.rotationModel = [180,0,0];
    this.attribLoc = this.getAttribLocation();
    this.uniformLoc = this.getUniformLocation();

    this.rotateAxis = 0;
    this.projectMode = 0;
    this.rotateToggle = DEFAULT_VALUE.rotateToggle;
    this.shadingState = DEFAULT_VALUE.shadingState;

    this.thetaDeg = 45;
    this.phiDeg = 45;

    this.eye = DEFAULT_VALUE.eye;
    this.center = DEFAULT_VALUE.center;
    this.up = DEFAULT_VALUE.up;
		this.facesColor = null;
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
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clearDepth(1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  bindVertex(listVertex: number[], colors: number[]): BufferVertex {
    const gl = this.gl;

		// Binding vertex position (object vertex position).
		const vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(listVertex),
			gl.STATIC_DRAW
		);

    // Binding vertex normal (normal vertices for compute lighting).
    const vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(getVectorNormals(listVertex)),
      gl.STATIC_DRAW
    );

    // const vertexTangentBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexTangentBuffer);
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   new Float32Array(getTangent(vertexPosition)),
    //   gl.STATIC_DRAW
    // );

    // const vertexBitTangentBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBitTangentBuffer);
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   new Float32Array(getBitTangent(vertexPosition)),
    //   gl.STATIC_DRAW
    // );

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
		
		// tangent: vertexTangentBuffer,
		// bitTangent: vertexBitTangentBuffer,

    return {
      position: vertexPositionBuffer,
      normal: vertexNormalBuffer,
			color: colorsBuffer,
      indices: indicesBuffer
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
		this.facesColor = facesColor;
    // this.buffers = [];

    // const length_rusuk = obj.num_rusuk;
    // for (let i = 0; i < obj.num_rusuk; i++) {
    //   const rusuk = obj.rusuk[i];
    //   const length_sisi = rusuk.num_sisi;
    //   const index = rusuk.index;
    //   for (let j = 0; j < length_sisi; j++) {
    //     Array.prototype.push.apply(this.vertexPosition, obj.vertex[index[j][0]]);
    //     Array.prototype.push.apply(this.facesColor, rusuk.color[j]);
    //   }
    // }
    for (let i = 0; i < obj.num_rusuk; i++) {
      this.initNodes(i);
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

  getAttribLocation() {
    return {
      aVertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
      aVertexColor: this.gl.getAttribLocation(this.shaderProgram, "aVertexColor"),
      aVertexNormal: this.gl.getAttribLocation(this.shaderProgram, 'aVertexNormal'),
      aTextureCoord: this.gl.getAttribLocation(this.shaderProgram, 'aTextureCoord')
    }
  }

  getUniformLocation() {
    return {
      uProjectionMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
      uModelViewMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
      uNormalMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uNormalMatrix'),
      uShading: this.gl.getUniformLocation(this.shaderProgram, "uShading")
    }
  }

  bindBufferToAttr(gl: WebGL2RenderingContext, buffVertex: BufferVertex): void {

    gl.vertexAttribPointer(this.attribLoc.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribLoc.aVertexPosition);

    // Bind color buffer to vertexColor attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffVertex.color);
    // let aVertexColor = gl.getAttribLocation(this.shaderProgram, "aVertexColor");

    gl.vertexAttribPointer(this.attribLoc.aVertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribLoc.aVertexColor);

    // Bind normal buffer to vertexNormal attribute
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffVertex.normal);

    // gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(aVertexNormal);

    // let aTextureCoord = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
    // gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 
		// 	2 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);
		// gl.enableVertexAttribArray(aTextureCoord);


    // Bind indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffVertex.indices);
  }

  startShading(
    gl: WebGL2RenderingContext,
    projectionMatrix: number[],
    normalMatrix: number[]
  ): void {
    // Use shader program
    gl.useProgram(this.shaderProgram);
    this.uniformLoc = this.getUniformLocation();

    // Set the shader uniforms for each uniform variable
    gl.uniformMatrix4fv(this.uniformLoc.uProjectionMatrix, false, projectionMatrix);

    // gl.uniformMatrix4fv(this.uniformLoc.uModelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(this.uniformLoc.uNormalMatrix, false, normalMatrix);

    let shadingMode = 0;
    if (this.shadingState) shadingMode = 1;
    gl.uniform1i(this.uniformLoc.uShading, shadingMode);

  }

  // Draw scene from buffers and GL params
  drawScene(
    // buffVertex: BufferVertex,
    diffTime: number,
    // verticesCount: number
    nodeModel: NodeModel
    ): void {
    console.log('drawScene');
    
    this.rotationModel[1] += 0.2;

		let gl = this.gl;
		gl.enable(gl.DEPTH_TEST); // Enable depth testing
		gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    
		if (this.vertexPosition) {
      var listVertex: number[] = [];
      const colors = [];
      for (let i = 0; i < this.vertexPosition.length; i++) {
        Array.prototype.push.apply(listVertex, this.vertexPosition[i]);
        
        for (let j = 0; j < this.facesColor[i].length; ++j) {
          for (let k = 0; k < 4; ++k) {
            for (let l = 0; l < this.facesColor[i][j].length; ++l) {
              colors.push(this.facesColor[i][j][l]);
            }
          }
        }
      }
      var maxX = listVertex[0];
      var minX = listVertex[0];
      var maxY = listVertex[1];
      var minY = listVertex[1];
      var maxZ = listVertex[2];
      var minZ = listVertex[2];
      if (listVertex.length > 3) {
        for (let i = 3; i < listVertex.length; i+=3) {        
          const verticeX = listVertex[i];
          const verticeY = listVertex[i+1];
          const verticeZ = listVertex[i+2];
          if (verticeX < minX) minX = verticeX;
          if (verticeY < minY) minY = verticeY;
          if (verticeZ < minZ) minZ = verticeZ;
          if (maxX < verticeX) maxX = verticeX;
          if (maxY < verticeY) maxY = verticeY;
          if (maxZ < verticeZ) maxZ = verticeZ;
        }
      }
      console.log('vertexPos');
      console.log(this.vertexPosition);

      // Create projection view matrix
      const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
      let projectionMatrix = this.startProjectCalc(aspectRatio, this.projectMode);

      // Create camera matrix
      let cameraMatrix = m4.identity();
      // cameraMatrix = m4.lookAt([0,0,20], [0,0,0], this.up);
      cameraMatrix = m4.lookAt([0,0,20], [(minX+maxX)/2,(minY+maxY)/2, (minZ+maxZ)/2], this.up);
      // cameraMatrix = m4.lookAt([0,0,20], [0,4,0], this.up);
      // cameraMatrix = m4.lookAt([(minX+maxX)/2,(minY+maxY)/2, (minZ+maxZ)/2], [0,0,0], this.up);
      
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
        
      var mModel = m4.identity();
      mModel = m4.translate(mModel, (minX+maxX)/2, (minY+maxY)/2, (minZ+maxZ)/2);
      mModel = m4.zRotate(m4.yRotate(m4.xRotate(mModel, this.rotationModel[0]), this.rotationModel[1]), this.rotationModel[2]);
      mModel = m4.translate(mModel, -(minX+maxX)/2, -(minY+maxY)/2, -(minZ+maxZ)/2);
      modelViewMatrix = m4.multiply(modelViewMatrix, mModel);
      
      const buffer = this.bindVertex(listVertex, colors);

      // Bind all buffer to corresponding attributes
      this.bindBufferToAttr(gl, buffer);

      // Start shading with the shader program
      this.startShading(gl, projectionMatrix, normalMatrix);
      // this.putModelViewMatrix(modelViewMatrix);
      
      for (let i = 0; i < this.vertexPosition.length; ++i) {
        gl.drawElements(gl.TRIANGLES, this.vertexPosition[i].length / 2, gl.UNSIGNED_SHORT, 0);
      }
      var stackModelViewMatrix: number[][] = [[]];
      this.traverse(nodeModel, modelViewMatrix, stackModelViewMatrix);
    }
    this.gl = gl;
  }

  putModelViewMatrix(modelViewMatrix: number[]): void {
    this.gl.uniformMatrix4fv(this.uniformLoc.uModelViewMatrix, false, modelViewMatrix);
  }

  textureUrl(url: string): WebGLTexture {
		let gl = this.gl;
		const textureC = gl.createTexture() as WebGLTexture;
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, 
			gl.UNSIGNED_BYTE,
			document.getElementById('crate-image') as TexImageSource
		);
		
		const image = new Image();
		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, textureC);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
		image.src = url;
    // gl.bindTexture(gl.TEXTURE_2D, null);

		this.gl = gl;
		return textureC;
  }

	// Model
	traverse(node: NodeModel, modelViewMatrix: number[], stackModelViewMatrix: number[][]): void {
		if (node == null) return;

		stackModelViewMatrix.push(modelViewMatrix);
		modelViewMatrix = m4.multiply(modelViewMatrix, node.transform);
		// node.render();
    this.putModelViewMatrix(modelViewMatrix);

		if (node.child != null) 
			this.traverse(node.child, modelViewMatrix, stackModelViewMatrix);
		modelViewMatrix = stackModelViewMatrix.pop();

		if (node.sibling != null) 
			this.traverse(node.sibling, modelViewMatrix, stackModelViewMatrix);
	}

	createNodeModel(transform, sibling, child): NodeModel {
		var nodeModel: NodeModel = {
			transform: transform,
			sibling: sibling,
			child: child
		}
		return nodeModel;
	}

  initNodes(id: number): void {
    var mNode = m4.identity();
    let sibling = this.nodeListData[id].sibling;
    let child = this.nodeListData[id].child;
    let tx = this.nodeListData[id].pointNode[0];
    let ty = this.nodeListData[id].pointNode[1];
    let tz = this.nodeListData[id].pointNode[2];
    this.theta[id] = this.nodeListData[id].degree;
    for (let i = 0; i < 3; i++) {
      if (this.theta[id][i] > this.nodeListData[id].maxDegree[i]) {
        this.theta[id] = this.nodeListData[id].maxDegree[i];
      }
      if (this.theta[id][i] < this.nodeListData[id].minDegree[i]) {
        this.theta[id] = this.nodeListData[id].minDegree[i];
      }
    }

    mNode = m4.translate(mNode, tx,ty, tz);
    mNode = m4.zRotate(m4.yRotate(m4.xRotate(mNode, this.theta[id][0]), this.theta[id][1]), this.theta[id][2]);
    mNode = m4.translate(mNode, -tx, -ty, -tz);

    this.figure[id] = this.createNodeModel(mNode, sibling, child);
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
