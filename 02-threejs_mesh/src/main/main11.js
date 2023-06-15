import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 目标：加载进度

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 
var div = document.createElement("div");
div.style.width = "200px";
div.style.height = "200px";
div.style.position = 'fixed';
div.style.right = 0;
div.style.top = 0;
div.style.color = "#fff";
document.body.appendChild(div)

const event = {};
// 单张纹理图的加载
event.onLoad = function () {
  console.log("纹理/图片加载完成");
}
event.onProgres = function (url,num,total) {
  // console.log("纹理/图片加载进度");
  console.log("加载地址",url);
  console.log("加载进度",num);
  console.log("加载总数", total);
  let value = (num / total).toFixed(2) * 100 + "%";
  console.log("加载进度百分比", value);
  div.innerHTML = value
}
event.onError = function (e) {
  console.log("纹理/图片加载出现错误");
  console.log(e);
}

// 设置加载管理器
const loadingManager = new THREE.LoadingManager(event.onLoad,event.onProgres,event.onError);

// 导入纹理
const textureLoader = new THREE.TextureLoader(loadingManager);
const doorColorTexture = textureLoader.load("./textures/door/color.jpg"
  // , event.onLoad, event.onProgres, event.onError
);
const doorAplhaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAoTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);


// 导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
// 导入粗糙度贴图
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
// 导入金属贴图
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
// 导入法线贴图
const normalTexture = textureLoader.load("./textures/door/normal.jpg");


// 添加物体
  // 后三个参数
    // widthSegments — （可选）宽度的分段数，默认值是1。
    // heightSegments — （可选）高度的分段数，默认值是1。
    // depthSegments — （可选）深度的分段数，默认值是1。
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1,100,100,100);
// 材质
const material = new THREE.MeshStandardMaterial({
  // color: "#ca5500",
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAplhaTexture,
  transparent: true,
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  //   opacity: 0.3,
  //   side: THREE.DoubleSide,
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  roughness: 1, // 材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供roughnessMap，则两个值相乘。
  roughnessMap: roughnessTexture, //该纹理的绿色通道用于改变材质的粗糙度。
  metalness: 1, // 材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.0。0.0到1.0之间的值可用于生锈金属的外观。如果还提供了metalnessMap，则两个值相乘。
  metalnessMap: metalnessTexture, // 该纹理的蓝色通道用于改变材质的金属度。
  normalMap: normalTexture, // 用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。
});
material.side = THREE.DoubleSide;
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);
// 给cube添加第二组uv
cubeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
);

// 添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(1, 1,200,200);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(3, 0, 0);

scene.add(plane);
// console.log(plane);
// 给平面设置第二组uv
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

// 添加灯光
// 环境光
const light = new THREE.AmbientLight( 0xffffff,0.5 ); // 柔和的白光
scene.add( light );
// 直线光 平行光
// 从上方照射的白色平行光，强度为 0.5。
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add( directionalLight );

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});