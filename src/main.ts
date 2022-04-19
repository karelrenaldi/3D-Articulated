import { GLObject } from "./types/type";
import { CreateRandomString, DownloadFile } from "./utils/common";
import { GLHelper } from "./utils/gl-helper";
import { ShaderUtil } from "./utils/shader";

let object: GLObject;

const main = async (): Promise<void> => {
  // Initiate Selector UI.
  const saveButton = document.querySelector(
    "#save-button"
  ) as HTMLButtonElement;
  const loadButton = document.querySelector("#load-input") as HTMLInputElement;
  const projectionMode = document.querySelector(
    "#projectionMode"
  ) as HTMLInputElement;
  const projectionModeText = document.querySelector(
    "#projectionModeText"
  ) as HTMLInputElement;
  const shadingMode = document.querySelector(
    "#shadingMode"
  ) as HTMLInputElement;
  const xTranslasi = document.querySelector("#xTranslasi") as HTMLInputElement;
  const xTranslasiText = document.querySelector(
    "#xTranslasiText"
  ) as HTMLInputElement;
  const yTranslasi = document.querySelector("#yTranslasi") as HTMLInputElement;
  const yTranslasiText = document.querySelector(
    "#yTranslasiText"
  ) as HTMLInputElement;
  const zTranslasi = document.querySelector("#zTranslasi") as HTMLInputElement;
  const zTranslasiText = document.querySelector(
    "#zTranslasiText"
  ) as HTMLInputElement;
  const xScale = document.querySelector("#xScale") as HTMLInputElement;
  const xScaleText = document.querySelector("#xScaleText") as HTMLInputElement;
  const yScale = document.querySelector("#yScale") as HTMLInputElement;
  const yScaleText = document.querySelector("#yScaleText") as HTMLInputElement;
  const zScale = document.querySelector("#zScale") as HTMLInputElement;
  const zScaleText = document.querySelector("#zScaleText") as HTMLInputElement;
  const xRotate = document.querySelector("#xRotasi") as HTMLInputElement;
  const xRotateText = document.querySelector(
    "#xRotasiText"
  ) as HTMLInputElement;
  const yRotate = document.querySelector("#yRotasi") as HTMLInputElement;
  const yRotateText = document.querySelector(
    "#yRotasiText"
  ) as HTMLInputElement;
  const zRotate = document.querySelector("#zRotasi") as HTMLInputElement;
  const zRotateText = document.querySelector(
    "#zRotasiText"
  ) as HTMLInputElement;
  const resetButton = document.querySelector(
    "#reset-button"
  ) as HTMLButtonElement;
  const cameraAngle = document.querySelector(
    "#cameraAngle"
  ) as HTMLInputElement;
  const cameraAngleText = document.querySelector(
    "#cameraAngleText"
  ) as HTMLInputElement;
  const cameraZoom = document.querySelector("#cameraZoom") as HTMLInputElement;
  const cameraZoomText = document.querySelector(
    "#cameraZoomText"
  ) as HTMLInputElement;

  const canvas = document.querySelector("#gl-canvas") as HTMLCanvasElement;
  canvas.width = 720;
  canvas.height = 520;

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error("Your browser doesn't support webgl");
    return;
  }

  const shaderUtil = new ShaderUtil(
    gl,
    "vertex-shader-drawing.glsl",
    "fragment-shader-drawing.glsl"
  );
  const shaderProgram = await shaderUtil.CreateShaderProgram();
  if (shaderProgram === null) {
    console.error("Failed to create shader program");
    return;
  }

  const glHelper = new GLHelper(gl, shaderProgram);

  // TODO: 1
  let then = 0;
  const render = (now) => {
    now *= 0.01;
    const deltaTime = now - then;
    then = now;
    glHelper.cleanScreen();
    // if (glHelper.vertexPosition) {
    //   for (let i = 0; i < glHelper.vertexPosition.length; ++i) {
    //     glHelper.drawScene(
    //       glHelper.buffers[i],
    //       deltaTime,
    //       glHelper.vertexPosition[i].length
    //     );
    //   }
    // }
    glHelper.drawScene(deltaTime);
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
      const data = JSON.parse(rs as string).data as GLObject;

      object = data;

      glHelper.drawModel(data);
    };

    reader.readAsText(files[0]);
  });

  // Projection View.
  projectionMode.addEventListener("change", (e) => {
    if (projectionMode.valueAsNumber == 0)
      projectionModeText.innerHTML = "Orthographic";
    if (projectionMode.valueAsNumber == 1)
      projectionModeText.innerHTML = "Oblique";
    if (projectionMode.valueAsNumber == 2)
      projectionModeText.innerHTML = "Perspective";
    glHelper.setProjectMode(projectionMode.valueAsNumber);
  });

  // Projection View.
  shadingMode.addEventListener("change", (e) => {
    glHelper.setShadingState(shadingMode.valueAsNumber);
  });

  // translasi X.
  xTranslasi.addEventListener("input", (e) => {
    const tempValue = xTranslasi.valueAsNumber / 1000;
    xTranslasiText.innerHTML = tempValue.toString();
    glHelper.setPositionX(tempValue);
  });

  // translasi Y.
  yTranslasi.addEventListener("input", (e) => {
    const tempValue = yTranslasi.valueAsNumber / 1000;
    yTranslasiText.innerHTML = tempValue.toString();
    glHelper.setPositionY(tempValue);
  });

  // translasi Z.
  zTranslasi.addEventListener("input", (e) => {
    const tempValue = zTranslasi.valueAsNumber / 1000;
    zTranslasiText.innerHTML = tempValue.toString();
    glHelper.setPositionZ(tempValue);
  });

  // scale X.
  xScale.addEventListener("input", (e) => {
    const tempValue = xScale.valueAsNumber / 1000;
    xScaleText.innerHTML = tempValue.toString();
    glHelper.setScaleX(tempValue);
  });

  // scale Y.
  yScale.addEventListener("input", (e) => {
    const tempValue = yScale.valueAsNumber / 1000;
    yScaleText.innerHTML = tempValue.toString();
    glHelper.setScaleY(tempValue);
  });

  // scale Z.
  zScale.addEventListener("input", (e) => {
    const tempValue = zScale.valueAsNumber / 1000;
    zScaleText.innerHTML = tempValue.toString();
    glHelper.setScaleZ(tempValue);
  });

  // rotasi X.
  xRotate.addEventListener("input", (e) => {
    const tempValue = xRotate.valueAsNumber;
    xRotateText.innerHTML = tempValue.toString();
    glHelper.setRotateX(tempValue);
  });

  // rotasi Y.
  yRotate.addEventListener("input", (e) => {
    const tempValue = yRotate.valueAsNumber;
    yRotateText.innerHTML = tempValue.toString();
    glHelper.setRotateY(tempValue);
  });

  // rotasi Z.
  zRotate.addEventListener("input", (e) => {
    const tempValue = zRotate.valueAsNumber;
    zRotateText.innerHTML = tempValue.toString();
    glHelper.setRotateZ(tempValue);
  });

  resetButton.addEventListener("click", (e) => {
    glHelper.reset();
  });

  cameraAngle.addEventListener("input", (e) => {
    const tempValue = cameraAngle.valueAsNumber / 100;
    cameraAngleText.innerHTML = tempValue.toString();
    glHelper.setCameraAngle(tempValue);
  });

  cameraZoom.addEventListener("input", (e) => {
    const tempValue = cameraZoom.valueAsNumber / 100;
    cameraZoomText.innerHTML = tempValue.toString();
    glHelper.setCameraZoom(tempValue);
  });
};

main();
