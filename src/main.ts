import { GLObject } from "./types/type";
import { CreateRandomString, DownloadFile } from "./utils/common";
import { GLHelper } from "./utils/gl-helper";
import { ShaderUtil } from "./utils/shader";
import { m4 } from "./utils/matrix";

let object: GLObject;
const listConstantVar = {
    'gl': null,
    'program': null,
    'glHelper': null
}
const test = [];

const main = async (): Promise<void> => {
    
    const saveButton = document.querySelector("#save") as HTMLButtonElement;
    const loadButton = document.querySelector("#load") as HTMLInputElement;
    const helpButton = document.querySelector("#help") as HTMLButtonElement;
    const resetButton = document.querySelector("#reset") as HTMLButtonElement;
    const animateButton = document.querySelector("#ButtonAnimate") as HTMLButtonElement;
    
    // Shading Mode.
    const selectShading = document.querySelector("#shadingMode") as HTMLSelectElement;
    const optionDefault = document.querySelector("#ButtonDefault") as HTMLOptionElement;
    const optionShading = document.querySelector("#ButtonShading") as HTMLOptionElement;
    
    // Projection Mode.
    const selectProjection = document.querySelector("#projectionMode") as HTMLSelectElement;
    const optionProj1 = document.querySelector("#ButtonProjection-1") as HTMLOptionElement;
    const optionProj2 = document.querySelector("#ButtonProjection-2") as HTMLOptionElement;
    const optionProj3 = document.querySelector("#ButtonProjection-3") as HTMLOptionElement;
    
    // Texture Mapping.
    const selectTexture = document.querySelector("#textureMappingMode") as HTMLSelectElement;
    const optionText1 = document.querySelector("#ButtonTexture-1") as HTMLOptionElement;
    const optionText2 = document.querySelector("#ButtonTexture-2") as HTMLOptionElement;
    const optionText3 = document.querySelector("#ButtonTexture-3") as HTMLOptionElement;
    
    // Auto Rotation Control.
    const selectRotate = document.querySelector("#ButtonRotate") as HTMLSelectElement;
    const optionT = document.querySelector("#ButtonT") as HTMLOptionElement;
    const optionX = document.querySelector("#ButtonX") as HTMLOptionElement;
    const optionY = document.querySelector("#ButtonY") as HTMLOptionElement;
    const optionZ = document.querySelector("#ButtonZ") as HTMLOptionElement;
    
    // Model View.
    const positionX = document.querySelector("#PositionX") as HTMLInputElement;
    const positionY = document.querySelector("#PositionY") as HTMLInputElement;
    const positionZ = document.querySelector("#PositionZ") as HTMLInputElement;
    const rotationX = document.querySelector("#AngleX") as HTMLInputElement;
    const rotationY = document.querySelector("#AngleY") as HTMLInputElement;
    const rotationZ = document.querySelector("#AngleZ") as HTMLInputElement;
    const scaleX = document.querySelector("#ScaleX") as HTMLInputElement;
    const scaleY = document.querySelector("#ScaleY") as HTMLInputElement;
    const scaleZ = document.querySelector("#ScaleZ") as HTMLInputElement;
    
    // Model Direct Control.
    const controlPart1 = document.querySelector("#part-1") as HTMLInputElement;
    const controlPart2 = document.querySelector("#part-2") as HTMLInputElement;
    const controlPart3 = document.querySelector("#part-3") as HTMLInputElement;
    const controlPart4 = document.querySelector("#part-4") as HTMLInputElement;
    const controlPart5 = document.querySelector("#part-5") as HTMLInputElement;
    const controlPart6 = document.querySelector("#part-6") as HTMLInputElement;
    const controlPart7 = document.querySelector("#part-7") as HTMLInputElement;
    const controlPart8 = document.querySelector("#part-8") as HTMLInputElement;
    const controlPart9 = document.querySelector("#part-9") as HTMLInputElement;
    const controlPart10 = document.querySelector("#part-10") as HTMLInputElement;
    const controlPart11 = document.querySelector("#part-11") as HTMLInputElement;
    const controlPart12 = document.querySelector("#part-12") as HTMLInputElement;
    const controlPart13 = document.querySelector("#part-13") as HTMLInputElement;
    const controlPart14 = document.querySelector("#part-14") as HTMLInputElement;
    const controlPart15 = document.querySelector("#part-15") as HTMLInputElement;
    const controlPart16 = document.querySelector("#part-16") as HTMLInputElement;
    const controlPart17 = document.querySelector("#part-17") as HTMLInputElement;
    const controlPart18 = document.querySelector("#part-18") as HTMLInputElement;
    
    function HollowCube() {
      const cube = {
          "num_point": 80,
          "vertex": [
              [-12, -2, 4], [2, -2, 4], [2, 2, 4], [-12, 2, 4], [-12, -2, -4], [-12,  2, -4], [2,  2, -4], [2, -2, -4],
              [-1, 1, 4], [1, 1, 4], [1, -6, 4], [-1, -6, 4], [-1, 1, 7], [-1, -6, 7], [1,  -6, 7], [1, 1, 7],
              [-1, -6, 4], [1, -6, 4], [1, -11, 4], [-1, -11, 4], [-1, -6, 7], [-1, -11, 7], [1,  -11, 7], [1, -6, 7],
              [-1, 1, -4], [1, 1, -4], [1, -6, -4], [-1, -6, -4], [-1, 1, -7], [-1,  -6, -7], [1,  -6, -7], [1, 1, -7],
              [-1, -6, -4], [1, -6, -4], [1, -11, -4], [-1, -11, -4], [-1, -6, -7], [-1,  -11, -7], [1,  -11, -7], [1, -6, -7],
              [-11, 1, 4], [-9, 1, 4], [-9, -6, 4], [-11, -6, 4], [-11, 1, 7], [-11, -6, 7], [-9,  -6, 7], [-9, 1, 7],
              [-11, -6, 4], [-9, -6, 4], [-9, -11, 4], [-11, -11, 4], [-11, -6, 7], [-11, -11, 7], [-9,  -11, 7], [-9, -6, 7],
              [-11, 1, -4], [-9, 1, -4], [-9, -6, -4], [-11, -6, -4], [-11, 1, -7], [-11, -6, -7], [-9,  -6, -7], [-9, 1, -7],
              [-11, -6, -4], [-9, -6, -4], [-9, -11, -4], [-11, -11, -4], [-11, -6, -7], [-11, -11, -7], [-9,  -11, -7], [-9, -6, -7],
              [8, -1, 2], [2, -1, 2], [2, 1, 2], [8, 1, 2], [8, -1, -2], [8,  1, -2], [2,  1, -2], [2, -1, -2],
              [14, -1, 2], [8, -1, 2], [8, 1, 2], [14, 1, 2], [14, -1, -2], [14,  1, -2], [8,  1, -2], [8, -1, -2]
          ],
          "num_rusuk" : 11,
          "rusuk" : [
              {
                  "num_sisi" : 6,
                  "index": [[0, 1, 2, 3],[4, 5, 6, 7],[5, 3, 2, 6],[4, 7, 1, 0], [4, 0, 3, 5],[7, 6, 2, 1]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[8, 9, 10, 11], [12, 13, 14, 15], [13, 11, 10, 14], [12, 15, 9, 8], [12, 8, 11, 13], [15, 14, 10, 9]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[16, 17, 18, 19], [20, 21, 22, 23], [21, 19, 18, 22], [20, 23, 17, 16], [20, 16, 19, 21], [23, 22, 18, 17]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[24, 25, 26, 27], [28, 29, 30, 31], [29, 27, 26, 30], [28, 31, 25, 24], [28, 24, 27, 29], [31, 30, 26, 25]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[32, 33, 34, 35], [36, 37, 38, 39], [37, 35, 34, 38], [36, 39, 33, 32], [36, 32, 35, 37], [39, 38, 34, 33]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[40, 41, 42, 43], [44, 45, 46, 47], [45, 43, 42, 46], [44, 47, 41, 40], [44, 40, 43, 45], [47, 46, 42, 41]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[48, 49, 50, 51], [52, 53, 54, 55], [53, 51, 50, 54], [52, 55, 49, 48], [52, 48, 51, 53], [55, 54, 50, 49]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[56, 57, 58, 59], [60, 61, 62, 63], [61, 59, 58, 62], [60, 63, 57, 56], [60, 56, 59, 61], [63, 62, 58, 57]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[64, 65, 66, 67], [68, 69, 70, 71], [69, 67, 66, 70], [68, 71, 65, 64], [68, 64, 67, 69], [71, 70, 66, 65]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[72, 73, 74, 75], [76, 77, 78, 79], [77, 75, 74, 78], [76, 79, 73, 72], [76, 72, 75, 77], [79, 78, 74, 73]],
              },
              {
                  "num_sisi" : 6,
                  "index": [[80, 81, 82, 83], [84, 85, 86, 87], [85, 83, 82, 86], [84, 87, 81, 80], [84, 80, 83, 85], [87, 86, 82, 81]],
                  "color" : [
                      [0.0,  1.0,  0.0,  1.0],
                      [0.0,  1.0,  0.0,  1.0],    
                      [1.0,  1.0,  0.0,  1.0],
                      [1.0,  1.0,  0.0,  1.0],
                      [0.0,  1.0,  1.0,  1.0],
                      [0.0,  1.0,  1.0,  1.0]
                  ]
              }
          ],
          "nodes": {
              "0": {
                  "pointNode": [0, 0, 0],
                  "sibling": null,
                  "child": 1,
                  "rotation_axis": 3,
                  "max_degree": 180,
                  "min_degree": 180,
                  "start_degree": 0,
                  "clockwise": 0
              },
              "1": {
                  "pointNode": [0, 0, 0],
                  "sibling": 3,
                  "child": 2,
                  "rotation_axis": 2,
                  "max_degree": 45,
                  "min_degree": -45,
                  "start_degree": 45,
                  "clockwise": 0
              },
              "2": {
                  "pointNode": [0, -5, 0],
                  "sibling": null,
                  "child": null,
                  "rotation_axis": 2,
                  "max_degree": 45,
                  "min_degree": -45,
                  "start_degree": 0,
                  "clockwise": 0
              },
              "3": {
                  "pointNode": [0, 0, 0],
                  "sibling": 5,
                  "child": 4,
                  "rotation_axis": 2,
                  "max_degree": 45,
                  "min_degree": -45,
                  "start_degree": -45,
                  "clockwise": 1
              },
              "4": {
                  "pointNode": [0, -5, 0],
                  "sibling": null,
                  "child": null,
                  "rotation_axis": 2,
                  "max_degree": 45,
                  "min_degree": -45,
                  "start_degree": 0,
                  "clockwise": 1
              },
              "5": {
                  "pointNode": [-10, 0, 0],
                  "sibling": 7,
                  "child": 6,
                  "rotation_axis": 2,
                  "max_degree": 45,
                  "min_degree": -45,
                  "start_degree": -45,
                  "clockwise": 1
              },
              "6": {
                  "pointNode": [-10, -5, 0],
                  "sibling": null,
                  "child": null,
                  "rotation_axis": 2,
                  "max_degree": 45,
                  "min_degree": -45,
                  "start_degree": 0,
                  "clockwise": 1
              },
              "7": {
                  "pointNode": [-10, 0, 0],
                  "sibling": 9,
                  "child": 8,
                  "rotation_axis": 2,
                  "max_degree": 45,
                  "min_degree": -45,
                  "start_degree": 45,
                  "clockwise": 0
              },
              "8": {
                  "pointNode": [-10, -5, 0],
                  "sibling": null,
                  "child": null,
                  "rotation_axis": 2,
                  "max_degree": 45,
                  "min_degree": -45,
                  "start_degree": 0,
                  "clockwise": 0
              },
              "9": {
                  "pointNode": [2, 0, 0],
                  "sibling": null,
                  "child": 10,
                  "rotation_axis": 2,
                  "max_degree": 90,
                  "min_degree": 0,
                  "start_degree": 0,
                  "clockwise": 0
              },
              "10": {
                  "pointNode": [7, 0, 0],
                  "sibling": null,
                  "child": null,
                  "rotation_axis": 2,
                  "max_degree": 0,
                  "min_degree": -90,
                  "start_degree": 0,
                  "clockwise": 0
              }
          }
      };
    
      return cube;
    }
    
      // Camera.
      const centerX = document.querySelector("#Center-X") as HTMLInputElement;
      const centerY = document.querySelector("#Center-Y") as HTMLInputElement;
      const centerZ = document.querySelector("#Center-Z") as HTMLInputElement;
      const upX = document.querySelector("#Up-X") as HTMLInputElement;
      const upY = document.querySelector("#Up-Y") as HTMLInputElement;
      const upZ = document.querySelector("#Up-Z") as HTMLInputElement;
      const eyeX = document.querySelector("#Eye-X") as HTMLInputElement;
      const eyeY = document.querySelector("#Eye-Y") as HTMLInputElement;
      const eyeZ = document.querySelector("#Eye-Z") as HTMLInputElement;
    
      const canvas = document.querySelector("#gl-canvas") as HTMLCanvasElement;
      canvas.width = 720;
      canvas.height = 520;
    
      const gl = canvas.getContext("webgl2");
      if (!gl) {
        console.error("Your browser doesn't support webgl");
        // return;
      }
      listConstantVar.gl = gl;
    
      const shaderUtil = new ShaderUtil(
        gl,
        "vertex-shader-drawing.glsl",
        "fragment-shader-drawing.glsl"
      );
      const shaderProgram = await shaderUtil.CreateShaderProgram();
      listConstantVar.program = shaderProgram;
    

//   //
// // Create shaders
// //
// function createShader(gl, shaderType, shaderCode, log) {
//   var shader = gl.createShader(shaderType);
//   gl.shaderSource(shader, shaderCode);
//   gl.compileShader(shader);
//   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//       console.error("ERROR compiling ", log, "!", gl.getShaderInfoLog(shader));
//       gl.deleteShader(shader);
//       return false;
//   }
//   return shader;
// }
// // 
// // Create Program
// //
// function createProgram(gl, vertexShader, fragmentShader) {
//   var program = gl.createProgram();
//   gl.attachShader(program, vertexShader);
//   gl.attachShader(program, fragmentShader);
//   gl.linkProgram(program);
//   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//       console.error("ERROR linking program!", gl.getProgramInfoLog(program));
//       return false;
//   }
//   gl.validateProgram(program);
//   if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
//       console.error("ERROR validating program!", gl.getProgramInfoLog(program));
//       return false;
//   }
//   return program;
// }
//   var vertexShaderText = document.getElementById("vertex-shader-2d").textContent;
//   var fragmentShaderText = document.getElementById("fragment-shader-2d").textContent;

//   var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText, "vertex shader");
//   var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText, "fragment shader");

//   var program = createProgram(gl, vertexShader, fragmentShader);


  // if (shaderProgram === null) {
  //   console.error("Failed to create shader program");
  //   return;
  // }
  // const vertShader = this.gl.createShader(type);
  // if (!vertShader) return null;

  // const rawShader = await this.getRawShader(source);
  // gl.shaderSource(vertShader, rawShader);
  // gl.compileShader(vertShader);

  // const isSuccess = this.gl.getShaderParameter(
  //   vertShader,
  //   gl.COMPILE_STATUS
  // );
  // if (isSuccess) return shader;

  // console.error("Failed compile shader");
  // this.gl.deleteShader(shader);

  // const vertShader = await this.createShader(
  //   this.gl.VERTEX_SHADER,
  //   this.vertexSource
  // );
  // if (vertShader === null) return null;

  // const fragShader = await this.createShader(
  //   this.gl.FRAGMENT_SHADER,
  //   this.fragmentSource
  // );
  // if (fragShader === null) return null;

  // const shaderProgram = this.gl.createProgram();
  // if (!shaderProgram) return null;

  // this.gl.attachShader(shaderProgram, vertShader);
  // this.gl.attachShader(shaderProgram, fragShader);
  // this.gl.linkProgram(shaderProgram);

  // const isSuccess = this.gl.getProgramParameter(
  //   shaderProgram,
  //   this.gl.LINK_STATUS
  // );
  // if (isSuccess) return shaderProgram;

  // console.error("Failed link shader program");
  // this.gl.deleteProgram(shaderProgram);


//   const glHelper = new GLHelper(gl, program);
  const glHelper = new GLHelper(gl, shaderProgram);
  glHelper.drawModel(HollowCube());
  listConstantVar.glHelper = glHelper;

//   now *= 0.01;
//   const deltaTime = now - then;
//   then = now;
//   glHelper.drawScene(deltaTime);
  glHelper.drawScene();
  let then = 0;
  let rotationCamera = [0,0,0];
  const render = (now) => {
    console.log("now");
    console.log(now);
    if (glHelper.vPos) {
        glHelper.cleanScreen();
        var stackModelViewMatrix: number[][] = [[]];
        // rotate camera
        // rotationCamera[0] += 0.0001;
        // rotationCamera[1] += 0.0001;
        // rotationCamera[2] += 0.0001;
        // glHelper.modelViewMatrix = m4.xRotate(glHelper.modelViewMatrix, rotationCamera[0]);
        // glHelper.modelViewMatrix = m4.yRotate(glHelper.modelViewMatrix, rotationCamera[1]);
        // glHelper.modelViewMatrix = m4.zRotate(glHelper.modelViewMatrix, rotationCamera[2]);

        glHelper.traverse(0, glHelper.modelViewMatrix, stackModelViewMatrix);
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  // save file.
  saveButton.addEventListener("click", () => {
    const fileData = { createdAt: new Date(), data: object };
    const fileName = `${CreateRandomString(30)}.json`;
    const fileType = "application/json";

    DownloadFile(JSON.stringify(fileData), fileName, fileType);
  });

  // load file.
  loadButton.addEventListener("change", (e) => {
    const files = (<HTMLInputElement>e.target).files as FileList;
    if (!files) return;

    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      const rs = e.target?.result;
      const data = JSON.parse(rs as string);
    //   const data = JSON.parse(rs as string).data as GLObject;
      glHelper.drawModel(data);
    };

    reader.readAsText(files[0]);
  });
};

main();
