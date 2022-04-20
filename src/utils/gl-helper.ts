import { DEFAULT_VALUE } from "../config/constant";
import { BufferVertex, GLObject, NodeModel } from "../types/type";
import { m4 } from "./matrix";
import { getVectorNormals } from "./vector";

export class GLHelper {
  private gl: WebGL2RenderingContext;
  private shaderProgram: WebGLProgram;

  public buffers: BufferVertex[];
  public vPos: number[][];

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
  public objModel;

	private facesColor: number[][][];
  private listVertex: number[];
  private attribLoc: {
    aVPos: number,
    aVColor: number,
    aVNormal: number,
    aVTangent: number,
    aVBitangent: number,
    aTexCoord: number
  }
  private uniformLoc: {
    uProjM: WebGLUniformLocation,
    uModelViewM: WebGLUniformLocation,
    uNormalM: WebGLUniformLocation,
    uShadingB: WebGLUniformLocation,
    uSampler2D: WebGLUniformLocation,
    uWorldCameraPos: WebGLUniformLocation,
    texType1: WebGLUniformLocation,
    texType2: WebGLUniformLocation,
    uTex: WebGLUniformLocation
  }
  public figure: NodeModel[];

  private theta: number[];
  private vecNormalTangentBitTangent;
  private mappingTex: number;

  // matrix
  private projM: number[];
  private normalM: number[];
  public modelViewMatrix: number[];



  constructor(gl: WebGL2RenderingContext, shaderProgram: WebGLProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;

    this.vPos = null;
    this.listVertex = [];
    this.buffers = null;
    this.figure = [];

    this.scale = DEFAULT_VALUE.scale;
    this.position = DEFAULT_VALUE.position;
    this.rotation = DEFAULT_VALUE.rotation;
    this.rotationModel = [0,0,0];
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


  drawModel(obj): void {
    console.log("obj");
    console.log(obj);
    const listVertex = obj.vertex;
    const vPos = [];
    const length_rusuk = obj.num_rusuk;
    this.nodeListData = obj.nodes;
    this.objModel = obj;
    for (let i = 0; i < length_rusuk; i++) {
      const rusuk = obj.rusuk[i];
      let pos = [];
      const index = rusuk.index;
      const length_sisi = rusuk.num_sisi;
      for (let j = 0; j < length_sisi; j++) {
        pos = pos.concat(
          listVertex[index[j][0]],
          listVertex[index[j][1]],
          listVertex[index[j][2]],
          listVertex[index[j][3]]
        );
      }
      vPos.push(pos);
    }
    
    this.theta = Array(length_rusuk).fill(0);
    this.vPos = vPos;
    for (let i = 0; i < this.vPos.length; i++) {
      Array.prototype.push.apply(this.listVertex, this.vPos[i]);
    }
    this.figure = [];
    for (let i = 0; i < this.objModel.num_rusuk; i++) {
      this.initNodes(i);
    }
    // this.setFixedBuff(this.listVertex);
    // this.buffers = [];
    
    // const length_rusuk = obj.num_rusuk;
    // for (let i = 0; i < obj.num_rusuk; i++) {
    //   const rusuk = obj.rusuk[i];
    //   const length_sisi = rusuk.num_sisi;
    //   const index = rusuk.index;
    //   for (let j = 0; j < length_sisi; j++) {
    //     Array.prototype.push.apply(this.vPos, obj.vertex[index[j][0]]);
    //     Array.prototype.push.apply(this.facesColor, rusuk.color[j]);
    //   }
    // }
    // console.log("initNOdes");
    // console.log(obj);
    // console.log(obj.num_rusuk);
    // console.log("initNOdesEnd");
    // console.log(this.figure);
  }

  startProjectCalc(aspectRatio: number, projMode: number): number[] {
    const fov = (45 * Math.PI) / 180; // in radians
    let projM = m4.identity();

    // Orthographic Projection Viewing
    if (projMode == 0) {
      projM = m4.ortho(projM, -5, 5, -5, 5, 0.1, 100);
    }

    // Oblique Projection Viewing
    else if (projMode == 1) {
      let m = m4.identity();
      let n = m4.identity();
      m = m4.oblique(projM, -this.thetaDeg, -this.phiDeg);
      n = m4.ortho(projM, -5, 5, -5, 5, 0.1, 100);
      projM = m4.multiply(m, n);

      // Now move the drawing position a bit
      projM = m4.translate(projM, 3, 3, 3);
    }

    // Perspective Projection View
    else if (projMode == 2) {
      projM = m4.perspective(fov, aspectRatio, 0.1, 100);
    }
    return projM;
  }

  getAttribLocation() {
    return {
      aVPos: this.gl.getAttribLocation(this.shaderProgram, 'aVPos'),
      aVColor: this.gl.getAttribLocation(this.shaderProgram, "aVColor"),
      aVNormal: this.gl.getAttribLocation(this.shaderProgram, 'aVNormal'),
      aVTangent: this.gl.getAttribLocation(this.shaderProgram, 'aVTangent'),
      aVBitangent: this.gl.getAttribLocation(this.shaderProgram, 'aVBitangent'),
      aTexCoord: this.gl.getAttribLocation(this.shaderProgram, 'aTexCoord'),
    }
  }

  getUniformLocation() {
    return {
      uProjM: this.gl.getUniformLocation(this.shaderProgram, 'uProjM'),
      uModelViewM: this.gl.getUniformLocation(this.shaderProgram, 'uModelViewM'),
      uNormalM: this.gl.getUniformLocation(this.shaderProgram, 'uNormalM'),
      uShadingB: this.gl.getUniformLocation(this.shaderProgram, "uShadingB"),
      uSampler2D: this.gl.getUniformLocation(this.shaderProgram, 'uSampler2D'),
      uWorldCameraPos: this.gl.getUniformLocation(this.shaderProgram, 'uWorldCameraPos'),
      texType1: this.gl.getUniformLocation(this.shaderProgram, 'texType1'),
      texType2: this.gl.getUniformLocation(this.shaderProgram, 'texType2'),
      uTex: this.gl.getUniformLocation(this.shaderProgram, 'uTex'),

    }
  }

  startShading(
    gl: WebGL2RenderingContext,
    projM: number[],
    normalM: number[]
  ): void {
    // Use shader program
    gl.useProgram(this.shaderProgram);
    this.uniformLoc = this.getUniformLocation();

    // Set the shader uniforms for each uniform variable
    gl.uniformMatrix4fv(this.uniformLoc.uProjM, false, projM);

    // gl.uniformMatrix4fv(this.uniformLoc.uModelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(this.uniformLoc.uNormalM, false, normalM);
    gl.uniform3fv(this.uniformLoc.uWorldCameraPos, this.eye);

    let shadingMode = 0;
    if (this.shadingState) shadingMode = 1;
    gl.uniform1i(this.uniformLoc.uShadingB, shadingMode);

    this.setTexType(0);

    // texture
    switch (this.mappingTex) {
      case 0:
        gl.uniform1i(this.uniformLoc.uTex, 1);
        gl.uniform1i(this.uniformLoc.texType1, 0);
        gl.uniform1i(this.uniformLoc.texType2, 0);
        gl.uniform1i(this.uniformLoc.uSampler2D, 0);
        break;
      case 1:
        gl.uniform1i(this.uniformLoc.uTex, 0);
        gl.uniform1i(this.uniformLoc.texType1, 1);
        gl.uniform1i(this.uniformLoc.texType2, 1);
        gl.uniform1i(this.uniformLoc.uSampler2D, 1);
        break;
      default:
        gl.uniform1i(this.uniformLoc.uTex, 1);
        gl.uniform1i(this.uniformLoc.texType1, 2);
        gl.uniform1i(this.uniformLoc.texType2, 2);
        gl.uniform1i(this.uniformLoc.uSampler2D, 0);
        break;
    }

  }

  // Draw scene from buffers and GL params
  drawScene(
    // buffVertex: BufferVertex,
    // diffTime: number,
    // verticesCount: number
    // nodeModel: NodeModel
    ): void {
    // console.log('drawScene');
    
    
		// if (this.vPos) {
      this.cleanScreen();
      // console.log(this.nodeListData);
      // console.log(this.objModel.num_rusuk);
      // console.log("this.figure");
      // console.log(this.figure);
      this.attribLoc = this.getAttribLocation();
      this.uniformLoc = this.getUniformLocation();

      // // rotate camera
      // this.rotationModel[0] += 0.03;
      // this.rotationModel[1] += 0.03;
      // this.rotationModel[2] += 0.03;
  
      let gl = this.gl;
      gl.enable(gl.DEPTH_TEST); // Enable depth testing
      gl.depthFunc(gl.LEQUAL); // Near things obscure far things

      // var listVertex: number[] = [];
      // const colors = [];
      // for (let i = 0; i < this.vPos.length; i++) {
      //   Array.prototype.push.apply(listVertex, this.vPos[i]);
        
      //   for (let j = 0; j < this.facesColor[i].length; ++j) {
      //     for (let k = 0; k < 4; ++k) {
      //       for (let l = 0; l < this.facesColor[i][j].length; ++l) {
      //         colors.push(this.facesColor[i][j][l]);
      //       }
      //     }
      //   }
      // }
      var maxX = this.listVertex[0];
      var minX = this.listVertex[0];
      var maxY = this.listVertex[1];
      var minY = this.listVertex[1];
      var maxZ = this.listVertex[2];
      var minZ = this.listVertex[2];
      if (this.listVertex.length > 3) {
        for (let i = 3; i < this.listVertex.length; i+=3) {        
          const verticeX = this.listVertex[i];
          const verticeY = this.listVertex[i+1];
          const verticeZ = this.listVertex[i+2];
          if (verticeX < minX) minX = verticeX;
          if (verticeY < minY) minY = verticeY;
          if (verticeZ < minZ) minZ = verticeZ;
          if (maxX < verticeX) maxX = verticeX;
          if (maxY < verticeY) maxY = verticeY;
          if (maxZ < verticeZ) maxZ = verticeZ;
        }
      }
      // console.log('vertexPos');
      // console.log(this.vPos);

      // Create projection view matrix
      const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
      let projM = this.startProjectCalc(aspectRatio, this.projectMode);

      // Create camera matrix
      let cameraMatrix = m4.identity();
      // let posObj = [(minX+maxX)/2,(minY+maxY)/2, (minZ+maxZ)/2]
      // let eye = [];
      // eye[0] = posObj[0];
      // eye[1] = posObj[1];
      // eye[2] = posObj[2];
      // cameraMatrix = m4.lookAt(eye, posObj, this.up);
      // cameraMatrix = m4.lookAt([-1, 0, -100], [0,0,0], [0,0,1]);
      cameraMatrix = m4.lookAt(this.eye, this.center, this.up);
      
      // Check for the auto rotate toggle
      // if (!this.rotateToggle) {
      //   this.rotation[this.rotateAxis] += diffTime * 0.5;
      // }

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
        this.scale[0]*0.1,
        this.scale[1]*0.1,
        this.scale[2]*0.1
      );
      let modelViewMatrix = m4.multiply(viewMatrix, modelMatrix);
      
      
      // Create shading and lighting matrix
      let normalM = m4.inverse(modelViewMatrix);
      normalM = m4.transpose(normalM);
        
      var mModel = m4.identity();
      mModel = m4.translate(mModel, (minX+maxX)/2, (minY+maxY)/2, (minZ+maxZ)/2);
      mModel = m4.zRotate(m4.yRotate(m4.xRotate(mModel, this.rotationModel[0]), this.rotationModel[1]), this.rotationModel[2]);
      mModel = m4.translate(mModel, -(minX+maxX)/2, -(minY+maxY)/2, -(minZ+maxZ)/2);
      this.modelViewMatrix = m4.multiply(modelViewMatrix, mModel);

      this.projM = projM;
      this.normalM = normalM;
      // var stackModelViewMatrix: number[][] = [[]];
      // this.traverse(0, modelViewMatrix, stackModelViewMatrix);
      
      // for (let i = 0; i < 6; i++) {
      //   this.gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
      // }
      this.gl = gl;
    // }
  }

  setFixedBuff(vPos): void {
  // putModelViewMatrix(modelViewMatrix: number[], vPos) {
    let gl = this.gl;
    // Binding vertex position (object vertex position).
    const texCoord = [
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      
      // Top
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
    ];
    const indices = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ];

    // for (let i = 0; i < this.objModel.num_rusuk; i++) {
    //   Array.prototype.push.apply(texCoord, texCoord);
    //   Array.prototype.push.apply(indices, indices);
    // }

    const vPosBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuff);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vPos),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(this.attribLoc.aVPos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribLoc.aVPos);
    this.vecNormalTangentBitTangent = getVectorNormals(vPos)

    const vNormalBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vNormalBuff);
    // Bind normal buffer to vertexNormal attribute
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffVertex.normal);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vecNormalTangentBitTangent[0]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(this.attribLoc.aVNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribLoc.aVNormal);

    const vTangentBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vTangentBuff);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vecNormalTangentBitTangent[1]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(this.attribLoc.aVTangent, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribLoc.aVTangent);

    const vBitangentBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBitangentBuff);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vecNormalTangentBitTangent[2]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(this.attribLoc.aVBitangent, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribLoc.aVBitangent);
		
    // gl.vertexAttribPointer(this.attribLoc.aTexCoord, 2, gl.FLOAT, false, 0, 0);
		// gl.enableVertexAttribArray(this.attribLoc.aTexCoord);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(texCoord),
      gl.STATIC_DRAW
    );
    
    gl.vertexAttribPointer(this.attribLoc.aTexCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.attribLoc.aTexCoord);


    // Binding indices (tell webgl 1 faces is two triangle).
    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );
    this.gl = gl;
  }
  
  putModelViewMatrix(modelViewMatrix: number[], pos): void {
    this.gl.uniformMatrix4fv(this.uniformLoc.uModelViewM, false, modelViewMatrix);
  }

  textureUrl(url: string): WebGLTexture {
		let gl = this.gl;
		const textureC = gl.createTexture() as WebGLTexture;
		const image = new Image();
		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, textureC);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, 
        gl.UNSIGNED_BYTE,
        image
      );
		}
		image.src = url;
		this.gl = gl;
		return textureC;
  }

  envTex(): void {

  }
	// Model
	traverse(id: number, modelViewMatrix: number[], stackModelViewMatrix: number[][]): void {
		if (id == null) return;
		stackModelViewMatrix.push(modelViewMatrix);
    // console.log(modelViewMatrix, this.figure[id].transform);

		modelViewMatrix = m4.multiply(modelViewMatrix, this.figure[id].transform);
		// this.figure[id].render();
    this.startShading(this.gl, this.projM, this.normalM);
    this.setFixedBuff(this.vPos[id]); 
    this.putModelViewMatrix(modelViewMatrix, this.vPos[id]);
    for (let i = 0; i < 6; i++) {
      this.gl.drawArrays(this.gl.TRIANGLE_FAN, 4*i, 4);
    }

		if (this.figure[id].child != null) {

      // console.log("child:", this.figure[id].child);
			this.traverse(this.figure[id].child, modelViewMatrix, stackModelViewMatrix);
    }
		modelViewMatrix = stackModelViewMatrix.pop();

		if (this.figure[id].sibling != null) {
			this.traverse(this.figure[id].sibling, modelViewMatrix, stackModelViewMatrix);
    }
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
    console.log("start initNodes func");
    var mNode = m4.identity();
    
    let sibling = this.nodeListData[id].sibling;
    let child = this.nodeListData[id].child;
    let tx = this.nodeListData[id].pointNode[0];
    let ty = this.nodeListData[id].pointNode[1];
    let tz = this.nodeListData[id].pointNode[2];
    this.theta[id] = this.nodeListData[id].start_degree;
    let rotAxis = this.nodeListData[id].rotation_axis;
    // for (let i = 0; i < 3; i++) {
      // if (this.theta[id][i] > this.nodeListData[id].maxDegree[i]) {
      //   this.theta[id] = this.nodeListData[id].maxDegree[i];
      // }
      // if (this.theta[id][i] < this.nodeListData[id].minDegree[i]) {
      //   this.theta[id] = this.nodeListData[id].minDegree[i];
      // }
      // }
    if (this.theta[id][rotAxis] > this.nodeListData[id].max_degree) {
      this.theta[id][rotAxis] = this.nodeListData[id].max_degree;
    }
    if (this.theta[id][rotAxis] < this.nodeListData[id].min_degree) {
      this.theta[id][rotAxis] = this.nodeListData[id].min_degree;
    }

    mNode = m4.translate(mNode, tx,ty, tz);
    // console.log("this.theta[id]");
    // console.log(this.theta[id]);
    // console.log(rotAxis);
    switch (rotAxis) {
      case 0:
        mNode = m4.xRotate(mNode, this.theta[id]);
        break;
      case 1:
        mNode = m4.yRotate(mNode, this.theta[id]);
        break;
      case 2:
        mNode = m4.zRotate(mNode, this.theta[id]);
        break;
      default:
        break;
    }
    // mNode = m4.zRotate(m4.yRotate(m4.xRotate(mNode, this.theta[id]), this.theta[id][1]), this.theta[id][2]);
    // console.log(mNode);
    mNode = m4.translate(mNode, -tx, -ty, -tz);
    console.log("mNode");
    console.log(mNode);

    this.figure[id] = this.createNodeModel(mNode, sibling, child);
    console.log(this.figure)
    console.log("end initNodes func");

    // this.figure[id].transform = mNode;
    // console.log("transform");
    // console.log(this.figure[id].transform);
    // this.figure[id].child = this.nodeListData[id].child;
    // this.figure[id].sibling = this.nodeListData[id].sibling;
  } 
 
  setTexType(val: number) {
    this.mappingTex = val;
    switch (val) {
      case 0:
        this.textureUrl('../assets/img/img2.png')
        break;

      case 1:
        // this.textureUrl('../assets/img/env.png')
        this.envTex();
        break;
        
      default:
        this.textureUrl('../assets/img/bump.png')
        break;
    }
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
