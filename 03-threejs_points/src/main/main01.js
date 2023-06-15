import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 目标：认识points

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

const sphereGeometry = new THREE.SphereBufferGeometry(3, 30, 30);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000,wireframe:true });
// const sphere = new THREE.Mesh(sphereGeometry, material)
// scene.add(sphere);
// 设置点材质的大小
const pointsMaterial = new THREE.PointsMaterial()
pointsMaterial.size = 0.05;
pointsMaterial.color.set(0xfff000);
// pointsMaterial.sizeAttenuation = false; // 是否因相机的距离而衰减

// 载入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./textures/particles/2.png");
// 设置点材质纹理
pointsMaterial.map = texture; // 使用来自Texture的数据设置点的颜色。可以选择包括一个alpha通道，通常与 .transparent或.alphaTest。
pointsMaterial.alphaMap = texture; // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。
pointsMaterial.transparent = true; // 定义此材质是否透明。这对渲染有影响，因为透明对象需要特殊处理，并在非透明对象之后渲染。设置为true时，通过设置材质的opacity属性来控制材质透明的程度。默认值为false。
pointsMaterial.depthWrite = false; // 渲染此材质是否对深度缓冲区有任何影响。默认为true。
pointsMaterial.blending = THREE.AdditiveBlending;


const points = new THREE.Points(sphereGeometry,pointsMaterial)
scene.add(points);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
// 
// renderer.physicallyCorrectLights = true;
renderer.useLegacyLights  = true;
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

let angle = 0;
function render() {
  angle += 0.05;
  // points.rotation.set(0, angle, 0, "XZY");

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
