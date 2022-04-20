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
      glHelper.drawModel(data);
    };

    reader.readAsText(files[0]);
  });
};

main();
