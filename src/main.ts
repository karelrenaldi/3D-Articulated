import { GLObject } from "./types/type";
import { CreateRandomString, DownloadFile } from "./utils/common";
import { GLHelper } from "./utils/gl-helper";
import { ShaderUtil } from "./utils/shader";
import { m4 } from "./utils/matrix";

let object: any;
const listConstantVar = {
  gl: null,
  program: null,
  glHelper: null,
};
const test = [];

const main = async (): Promise<void> => {
  const saveButton = document.querySelector("#save") as HTMLButtonElement;
  const loadButton = document.querySelector("#load") as HTMLInputElement;
  const animateButtonOn = document.querySelector(
    "#ButtonAnimateOn"
  ) as HTMLButtonElement;
  const animateButtonOff = document.querySelector(
    "#ButtonAnimateOff"
  ) as HTMLButtonElement;

  // Shading Mode.
  const selectShading = document.querySelector(
    "#shadingMode"
  ) as HTMLSelectElement;

  // Texture Mapping.
  const selectTexture = document.querySelector(
    "#textureMappingMode"
  ) as HTMLSelectElement;

  // Auto Rotation Control.
  const selectRotate = document.querySelector(
    "#ButtonRotate"
  ) as HTMLSelectElement;

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

  controlPart1.addEventListener("input", () => {
    const angleValue = Number(controlPart1.value);
    glHelper.setRusukAngle(0, angleValue);
  });
  controlPart2.addEventListener("input", () => {
    const angleValue = Number(controlPart2.value);
    glHelper.setRusukAngle(1, angleValue);
  });
  controlPart3.addEventListener("input", () => {
    const angleValue = Number(controlPart3.value);
    glHelper.setRusukAngle(2, angleValue);
  });
  controlPart4.addEventListener("input", () => {
    const angleValue = Number(controlPart4.value);
    glHelper.setRusukAngle(3, angleValue);
  });
  controlPart5.addEventListener("input", () => {
    const angleValue = Number(controlPart5.value);
    glHelper.setRusukAngle(4, angleValue);
  });
  controlPart6.addEventListener("input", () => {
    const angleValue = Number(controlPart6.value);
    glHelper.setRusukAngle(5, angleValue);
  });
  controlPart7.addEventListener("input", () => {
    const angleValue = Number(controlPart7.value);
    glHelper.setRusukAngle(6, angleValue);
  });
  controlPart8.addEventListener("input", () => {
    const angleValue = Number(controlPart8.value);
    glHelper.setRusukAngle(7, angleValue);
  });
  controlPart9.addEventListener("input", () => {
    const angleValue = Number(controlPart9.value);
    glHelper.setRusukAngle(8, angleValue);
  });
  controlPart10.addEventListener("input", () => {
    const angleValue = Number(controlPart10.value);
    glHelper.setRusukAngle(9, angleValue);
  });
  controlPart11.addEventListener("input", () => {
    const angleValue = Number(controlPart11.value);
    glHelper.setRusukAngle(10, angleValue);
  });
  controlPart12.addEventListener("input", () => {
    const angleValue = Number(controlPart12.value);
    glHelper.setRusukAngle(11, angleValue);
  });
  controlPart13.addEventListener("input", () => {
    const angleValue = Number(controlPart13.value);
    glHelper.setRusukAngle(12, angleValue);
  });
  controlPart14.addEventListener("input", () => {
    const angleValue = Number(controlPart14.value);
    glHelper.setRusukAngle(13, angleValue);
  });
  controlPart15.addEventListener("input", () => {
    const angleValue = Number(controlPart15.value);
    glHelper.setRusukAngle(14, angleValue);
  });
  controlPart16.addEventListener("input", () => {
    const angleValue = Number(controlPart16.value);
    glHelper.setRusukAngle(15, angleValue);
  });
  controlPart17.addEventListener("input", () => {
    const angleValue = Number(controlPart17.value);
    glHelper.setRusukAngle(16, angleValue);
  });
  controlPart18.addEventListener("input", () => {
    const angleValue = Number(controlPart18.value);
    glHelper.setRusukAngle(17, angleValue);
  });

  rotationX.addEventListener("input", () => {
    const rotationValue = Number(rotationX.value);
    glHelper.setRotateX(rotationValue);
  });
  rotationY.addEventListener("input", () => {
    const rotationValue = Number(rotationY.value);
    glHelper.setRotateY(rotationValue);
  });
  rotationZ.addEventListener("input", () => {
    const rotationValue = Number(rotationZ.value);
    glHelper.setRotateZ(rotationValue);
  });

  positionX.addEventListener("input", () => {
    const positionValue = Number(positionX.value);
    glHelper.setPositionX(positionValue);
  });
  positionY.addEventListener("input", () => {
    const positionValue = Number(positionY.value);
    glHelper.setPositionY(positionValue);
  });
  positionZ.addEventListener("input", () => {
    const positionValue = Number(positionZ.value);
    glHelper.setPositionZ(positionValue);
  });

  scaleX.addEventListener("input", () => {
    const scaleValue = Number(scaleX.value);
    glHelper.setScaleX(scaleValue);
  });

  scaleY.addEventListener("input", () => {
    const scaleValue = Number(scaleX.value);
    glHelper.setScaleY(scaleValue);
  });

  scaleZ.addEventListener("input", () => {
    const scaleValue = Number(scaleX.value);
    glHelper.setScaleZ(scaleValue);
  });

  selectTexture.addEventListener("change", () => {
    const currentVal: string = selectTexture.value;

    let textValue: number;
    if (currentVal === "image") {
      textValue = 0;
    } else if (currentVal === "environment") {
      textValue = 1;
    } else if (currentVal === "bump") {
      textValue = 2;
    }

    glHelper.setTexType(textValue);
  });

  selectShading.addEventListener("change", () => {
    const currentVal: string = selectShading.value;

    if (currentVal === "shadingmode") {
      glHelper.setShadingState(1);
    } else if (currentVal === "defaultview") {
      glHelper.setShadingState(0);
    }
  });

  selectRotate.addEventListener("change", () => {
    const currentVal: string = selectRotate.value;

    if (currentVal === "rotateX") {
      glHelper.setRotateCamera(0);
    } else if (currentVal === "rotateY") {
      glHelper.setRotateCamera(1);
    } else if (currentVal === "rotateZ") {
      glHelper.setRotateCamera(2);
    } else {
      glHelper.setRotateCamera(-1);
    }
  });

  animateButtonOn.addEventListener("click", () => {
    glHelper.setAllPartModel(true);
  });
  animateButtonOff.addEventListener("click", () => {
    glHelper.setAllPartModel(false);
  });

  centerX.addEventListener("input", () => {
    glHelper.setCenterVal(Number(centerX.value), 0);
  });
  centerY.addEventListener("input", () => {
    glHelper.setCenterVal(Number(centerY.value), 1);
  });
  centerZ.addEventListener("input", () => {
    glHelper.setCenterVal(Number(centerZ.value), 2);
  });
  upX.addEventListener("input", () => {
    glHelper.setUpVal(Number(upX.value), 0);
  });
  upY.addEventListener("input", () => {
    glHelper.setUpVal(Number(upY.value), 1);
  });
  upZ.addEventListener("input", () => {
    glHelper.setUpVal(Number(upY.value), 2);
  });
  eyeX.addEventListener("input", () => {
    glHelper.setEyeVal(Number(eyeX.value), 0);
  });
  eyeY.addEventListener("input", () => {
    glHelper.setEyeVal(Number(eyeY.value), 1);
  });
  eyeZ.addEventListener("input", () => {
    glHelper.setEyeVal(Number(eyeZ.value), 2);
  });

  var v1 = {
    xDown: 0,
    xUp: 8,
    yDown: 0,
    yUp: 15,
    zDown: 0,
    zUp: 8
}
var v2 = {
    xDown: v1.xDown-15,
    xUp: v1.xDown,
    yDown: v1.yUp-4,
    yUp: v1.yUp,
    zDown: v1.zDown,
    zUp: v1.zUp
}
var v3 = {
    xDown: v1.xUp,
    xUp: v1.xUp+15,
    yDown: v1.yUp-4,
    yUp: v1.yUp,
    zDown: v1.zDown,
    zUp: v1.zUp
}
var v4 = {
    xDown: v1.xDown,
    xUp: v1.xUp,
    yDown: v1.yUp-4,
    yUp: v1.yUp,
    zDown: v1.zDown-15,
    zUp: v1.zDown
}
var v5 = {
    xDown: v1.xDown,
    xUp: v1.xUp,
    yDown: v1.yUp-4,
    yUp: v1.yUp,
    zDown: v1.zUp,
    zUp: v1.zUp+15
}

function zubairModel() {
    const z = {
        "num_point": 40,
        "vertex": [
            // 1
            [v1.xDown, v1.yDown, v1.zUp], [v1.xUp,v1.yDown,v1.zUp], [v1.xUp, v1.yUp, v1.zUp], [v1.xDown,v1.yUp,v1.zUp], 
            [v1.xDown, v1.yDown, v1.zDown], [v1.xDown,v1.yUp,v1.zDown], [v1.xUp, v1.yUp,v1.zDown], [v1.xUp,v1.yDown,v1.xDown],
            [v2.xDown, v2.yDown, v2.zUp], [v2.xUp,v2.yDown,v2.zUp], [v2.xUp, v2.yUp, v2.zUp], [v2.xDown,v2.yUp,v2.zUp], 
            [v2.xDown, v2.yDown, v2.zDown], [v2.xDown,v2.yUp,v2.zDown], [v2.xUp, v2.yUp,v2.zDown], [v2.xUp,v2.yDown,v2.xDown],
            [v3.xDown, v3.yDown, v3.zUp], [v3.xUp,v3.yDown,v3.zUp], [v3.xUp, v3.yUp, v3.zUp], [v3.xDown,v3.yUp,v3.zUp], 
            [v3.xDown, v3.yDown, v3.zDown], [v3.xDown,v3.yUp,v3.zDown], [v3.xUp, v3.yUp,v3.zDown], [v3.xUp,v3.yDown,v3.xDown],
            [v4.xDown, v4.yDown, v4.zUp], [v4.xUp,v4.yDown,v4.zUp], [v4.xUp, v4.yUp, v4.zUp], [v4.xDown,v4.yUp,v4.zUp], 
            [v4.xDown, v4.yDown, v4.zDown], [v4.xDown,v4.yUp,v4.zDown], [v4.xUp, v4.yUp,v4.zDown], [v4.xUp,v4.yDown,v4.xDown],
            [v5.xDown, v5.yDown, v5.zUp], [v5.xUp,v5.yDown,v5.zUp], [v5.xUp, v5.yUp, v5.zUp], [v5.xDown,v5.yUp,v5.zUp], 
            [v5.xDown, v5.yDown, v5.zDown], [v5.xDown,v5.yUp,v5.zDown], [v5.xUp, v5.yUp,v5.zDown], [v5.xUp,v5.yDown,v5.xDown],
            // 
            // [-12,-2,4], [2,-2,4], [2,2,4], [-12,2,4], 
            // [-12,-2,-4], [-12,2,-4], [2,2,-4], [2,-2,-4],
            // [-1, 1, 4], [1, 1, 4], [1, -6, 4], [-1, -6, 4], [-1, 1, 7], [-1, -6, 7], [1,  -6, 7], [1, 1, 7],
            // [-1, -6, 4], [1, -6, 4], [1, -11, 4], [-1, -11, 4], [-1, -6, 7], [-1, -11, 7], [1,  -11, 7], [1, -6, 7],
            // [-1, 1, -4], [1, 1, -4], [1, -6, -4], [-1, -6, -4], [-1, 1, -7], [-1,  -6, -7], [1,  -6, -7], [1, 1, -7],
            // [-1, -6, -4], [1, -6, -4], [1, -11, -4], [-1, -11, -4], [-1, -6, -7], [-1,  -11, -7], [1,  -11, -7], [1, -6, -7],
            // [-11, 1, 4], [-9, 1, 4], [-9, -6, 4], [-11, -6, 4], [-11, 1, 7], [-11, -6, 7], [-9,  -6, 7], [-9, 1, 7],
            // [-11, -6, 4], [-9, -6, 4], [-9, -11, 4], [-11, -11, 4], [-11, -6, 7], [-11, -11, 7], [-9,  -11, 7], [-9, -6, 7],
            // [-11, 1, -4], [-9, 1, -4], [-9, -6, -4], [-11, -6, -4], [-11, 1, -7], [-11, -6, -7], [-9,  -6, -7], [-9, 1, -7],
            // [-11, -6, -4], [-9, -6, -4], [-9, -11, -4], [-11, -11, -4], [-11, -6, -7], [-11, -11, -7], [-9,  -11, -7], [-9, -6, -7],
            // [8, -1, 2], [2, -1, 2], [2, 1, 2], [8, 1, 2], [8, -1, -2], [8,  1, -2], [2,  1, -2], [2, -1, -2],
            // [14, -1, 2], [8, -1, 2], [8, 1, 2], [14, 1, 2], [14, -1, -2], [14,  1, -2], [8,  1, -2], [8, -1, -2]
        ],
        "num_rusuk" : 5,
        "texture": "image",
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
                "index": [[0+16, 1+16, 2+16, 3+16],[4+16, 5+16, 6+16, 7+16],[5+16, 3+16, 2+16, 6+16],[4+16, 7+16, 1+16, 0+16], [4+16, 0+16, 3+16, 5+16],[7+16, 6+16, 2+16, 1+16]],
                // "index": [[16, 17, 18, 19], [20, 21, 22, 23], [21, 19, 18, 22], [20, 23, 17, 16], [20, 16, 19, 21], [23, 22, 18, 17]],
            },
            {
                "num_sisi" : 6,
                "index": [[24, 25, 26, 27], [28, 29, 30, 31], [29, 27, 26, 30], [28, 31, 25, 24], [28, 24, 27, 29], [31, 30, 26, 25]],
            },
            {
                "num_sisi" : 6,
                "index": [[32, 33, 34, 35], [36, 37, 38, 39], [37, 35, 34, 38], [36, 39, 33, 32], [36, 32, 35, 37], [39, 38, 34, 33]],
            },
            // {
            //     "num_sisi" : 6,
            //     "index": [[40, 41, 42, 43], [44, 45, 46, 47], [45, 43, 42, 46], [44, 47, 41, 40], [44, 40, 43, 45], [47, 46, 42, 41]],
            // },
            // {
            //     "num_sisi" : 6,
            //     "index": [[48, 49, 50, 51], [52, 53, 54, 55], [53, 51, 50, 54], [52, 55, 49, 48], [52, 48, 51, 53], [55, 54, 50, 49]],
            // },
            // {
            //     "num_sisi" : 6,
            //     "index": [[56, 57, 58, 59], [60, 61, 62, 63], [61, 59, 58, 62], [60, 63, 57, 56], [60, 56, 59, 61], [63, 62, 58, 57]],
            // },
            // {
            //     "num_sisi" : 6,
            //     "index": [[64, 65, 66, 67], [68, 69, 70, 71], [69, 67, 66, 70], [68, 71, 65, 64], [68, 64, 67, 69], [71, 70, 66, 65]],
            // },
            // {
            //     "num_sisi" : 6,
            //     "index": [[72, 73, 74, 75], [76, 77, 78, 79], [77, 75, 74, 78], [76, 79, 73, 72], [76, 72, 75, 77], [79, 78, 74, 73]],
            // },
            // {
            //     "num_sisi" : 6,
            //     "index": [[80, 81, 82, 83], [84, 85, 86, 87], [85, 83, 82, 86], [84, 87, 81, 80], [84, 80, 83, 85], [87, 86, 82, 81]],
            // }
        ],
        "nodes": {
            // "0": {
            //     "pointNode": [0, 0, 0],
            //     "sibling": null,
            //     "child": 1,
            //     "rotation_axis": 3,
            //     "max_degree": 180,
            //     "min_degree": 180,
            //     "start_degree": 0,
            //     "clockwise": 0
            // },
            // "1": {
            //     "pointNode": [0, 0, 0],
            //     "sibling": 3,
            //     "child": 2,
            //     "rotation_axis": 2,
            //     "max_degree": 45,
            //     "min_degree": -45,
            //     "start_degree": 45,
            //     "clockwise": 0
            // },
            // "2": {
            //     "pointNode": [0, -5, 0],
            //     "sibling": null,
            //     "child": null,
            //     "rotation_axis": 2,
            //     "max_degree": 45,
            //     "min_degree": -45,
            //     "start_degree": 0,
            //     "clockwise": 0
            // },
            // "3": {
            //     "pointNode": [0, 0, 0],
            //     "sibling": null,
            //     "child": null,
            //     "rotation_axis": 2,
            //     "max_degree": 45,
            //     "min_degree": -45,
            //     "start_degree": -45,
            //     "clockwise": 1
            // },
            // "4": {
            //     "pointNode": [0, -5, 0],
            //     "sibling": null,
            //     "child": null,
            //     "rotation_axis": 2,
            //     "max_degree": 45,
            //     "min_degree": -45,
            //     "start_degree": 0,
            //     "clockwise": 1
            // },
            "0": {
                "pointNode": [v1.xDown, v1.yDown, v1.zDown],
                // "pointNode": [(v1.xDown+v1.xUp)/2, (v1.yDown+v1.yUp)/2, (v1.zDown+v1.zUp)/2],
                "sibling": null,
                "child": 1,
                "rotation_axis": 2,
                "max_degree": 360,
                "min_degree": 0,
                "start_degree": 0,
                "clockwise": 0
            },
            "1": {
                "pointNode": [v2.xDown, v2.yDown, v2.zDown],
                "sibling": 2,
                "child": null,
                "rotation_axis": 0,
                "max_degree": 360,
                "min_degree": 0,
                "start_degree": 0,
                "clockwise": 0
            },
            "2": {
                "pointNode": [v3.xDown, v3.yDown, v3.zDown],
                "sibling": 3,
                "child": null,
                "rotation_axis": 0,
                "max_degree": 360,
                "min_degree": 0,
                "start_degree": 0,
                "clockwise": 0
            },
            "3": {
                "pointNode": [v4.xDown, v4.yDown, v4.zDown],
                "sibling": 4,
                "child": null,
                "rotation_axis": 1,
                "max_degree": 360,
                "min_degree": 0,
                "start_degree": 0,
                "clockwise": 1
            },
            "4": {
                "pointNode": [v5.xDown, v5.yDown, v5.zDown],
                "sibling": null,
                "child": null,
                "rotation_axis": 1,
                "max_degree": 360,
                "min_degree": 0,
                "start_degree": 0,
                "clockwise": 1
            }
            // "5": {
            //     "pointNode": [-10, 0, 0],
            //     "sibling": 7,
            //     "child": 6,
            //     "rotation_axis": 2,
            //     "max_degree": 45,
            //     "min_degree": -45,
            //     "start_degree": -45,
            //     "clockwise": 1
            // },
            // "6": {
            //     "pointNode": [-10, -5, 0],
            //     "sibling": null,
            //     "child": null,
            //     "rotation_axis": 2,
            //     "max_degree": 45,
            //     "min_degree": -45,
            //     "start_degree": 0,
            //     "clockwise": 1
            // },
            // "7": {
            //     "pointNode": [-10, 0, 0],
            //     "sibling": 9,
            //     "child": 8,
            //     "rotation_axis": 2,
            //     "max_degree": 45,
            //     "min_degree": -45,
            //     "start_degree": 45,
            //     "clockwise": 0
            // },
            // "8": {
            //     "pointNode": [-10, -5, 0],
            //     "sibling": null,
            //     "child": null,
            //     "rotation_axis": 2,
            //     "max_degree": 45,
            //     "min_degree": -45,
            //     "start_degree": 0,
            //     "clockwise": 0
            // },
            // "9": {
            //     "pointNode": [2, 0, 0],
            //     "sibling": null,
            //     "child": 10,
            //     "rotation_axis": 2,
            //     "max_degree": 90,
            //     "min_degree": 0,
            //     "start_degree": 0,
            //     "clockwise": 0
            // },
            // "10": {
            //     "pointNode": [7, 0, 0],
            //     "sibling": null,
            //     "child": null,
            //     "rotation_axis": 2,
            //     "max_degree": 0,
            //     "min_degree": -90,
            //     "start_degree": 0,
            //     "clockwise": 0
            // }
        }
    };
  
    return z;
  }
  object = zubairModel();

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

  const glHelper = new GLHelper(gl, shaderProgram);
  listConstantVar.glHelper = glHelper;

  glHelper.drawModel(zubairModel());
  glHelper.setTexType(0);
  glHelper.drawScene();
  const render = () => {
    if (glHelper.vPos) {
      glHelper.drawScene();
      for (let i = 0; i < glHelper.objModel.num_rusuk; i++) {
        glHelper.initNodes(i);
      }
      glHelper.cleanScreen();
      var stackModelViewMatrix: number[][] = [[]];
      glHelper.traverse(0, glHelper.modelViewMatrix, stackModelViewMatrix);
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  // save file.
  saveButton.addEventListener("click", () => {
    object = glHelper.objModel;
    const fileData = object;
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
      object = data;
      if (data.texture == "image") {
        glHelper.setTexType(0);
      } else if (data.texture == "bump") {
        glHelper.setTexType(2);
      } else if (data.texture == "environtment") {
        glHelper.setTexType(1);
      } else {
        glHelper.setTexType(0);
      }
      data.texture 
      glHelper.drawModel(data);
    };

    reader.readAsText(files[0]);
  });
};

main();
