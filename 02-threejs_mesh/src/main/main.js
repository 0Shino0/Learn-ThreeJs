import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 目标：点光源

// 目标: 阴影属性

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

// 设置cube纹理加载器
// const cubeTextureLoader = new THREE.CubeTextureLoader()

const spherGeometry = new THREE.SphereBufferGeometry( 1, 20, 20 );
const material = new THREE.MeshStandardMaterial();
// material.side = THREE.DoubleSide;
const sphere = new THREE.Mesh(spherGeometry, material);
// 设置物体投射阴影
sphere.castShadow = true;
scene.add(sphere)

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2; // -90度 正面朝上
// 设置物体接收阴影 
plane.receiveShadow = true;
scene.add(plane);

// 添加灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // 柔和的白光
const smallBall = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }));

smallBall.position.set(2,2,2)
scene.add( light );
// 点光源
// 从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。
// 该光源可以投射阴影
const pointLight = new THREE.PointLight(0xff0000);
pointLight.position.set(2, 2, 2);
// 设置光照投射阴影
pointLight.castShadow = true;

// 设置阴影贴图模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图模糊度
pointLight.shadow.mapSize.set(4096, 4096);

smallBall.add(pointLight)
// scene.add(pointLight);
scene.add(smallBall);

const gui = new dat.GUI()
gui
  .add(sphere.position, "x")
  .min(0)
  .max(15)
  .step(0.1)
  .onChange((e) => {
    // 请注意，在大多数属性发生改变之后，你将需要调用.updateProjectionMatrix来使得这些改变生效。
    pointLight.shadow.camera.updateProjectionMatrix();
    // 更新投影矩阵
  });
gui
  .add(pointLight, "distance")
  .min(0)
  .max(15)
  .step(0.01);
gui
  .add(pointLight, "decay")
  .min(-2)
  .max(5)
  .step(0.01);


// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
// 
renderer.physicallyCorrectLights = true;
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

let angle = 0; // 声明一个变量angle表示角度位置

function cicleMotion(speed,radius,obj,y=0) {
  angle += speed;
  // 圆周运动网络模型x坐标计算 绕转半径400
  var x = radius * Math.sin(angle);
  // 圆周运动网络模型y坐标技术 绕半径400
  var z = radius * Math.cos(angle);
  // 每次执行render函数，更新需要做圆周运动网格模型Mesh的位置属性
  obj.position.set(x, 0, z);
}

function render() {
  // 圆周运动
  cicleMotion(0.02, 4, sphere);

  smallBall.position.x = Math.sin(angle) * 5;
  smallBall.position.z = Math.cos(angle) * 5;
  smallBall.position.y = Math.sin(angle*5) * 2;

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
