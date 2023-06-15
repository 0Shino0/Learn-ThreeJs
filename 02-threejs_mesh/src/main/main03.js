import * as THREE from 'three';
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// 导入动画库
import gsap from 'gsap';
// 导入dat.gui
import * as dat from "dat.gui"

// console.log(THREE)
// 目标：基础材质与纹理

// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
// const camera = new THREE.Camera()
// PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
// fov — 摄像机视锥体垂直视野角度
// aspect — 摄像机视锥体长宽比
// near — 摄像机视锥体近端面
// far — 摄像机视锥体远端面
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 透视相机


// 设置相机位置，xyz轴坐标
camera.position.set(0, 0, 10);
// 添加相机到场景中
scene.add(camera);
// console.log(camera);

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('./textures/door/color.jpg');
console.log(doorColorTexture);
// 添加物体
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
// 材质
const basicMaterial = new THREE.MeshBasicMaterial({
  color: '#ffff00',
  map:doorColorTexture
});
// 创建几何体 点线面
const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
scene.add(cube);


// GUI
const gui = new dat.GUI();

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容选择到body上
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement);
// OrbitControls( object : Camera, domElement : HTMLDOMElement )
// object: （必须）将要被控制的相机。该相机不允许是其他任何对象的子级，除非该对象是场景自身。
// domElement: 用于事件监听的HTML元素。

// 设置控制阻尼，让控制器更有真实效果，必须在动画循环里调用 .update()
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟
const clock = new THREE.Clock();
// 设置动画

window.addEventListener("dblclick", () => {
  const fullscreenElement = document.fullscreenElement;
  // 双击全屏，退出全屏
  if (!fullscreenElement) {
    // 让画布对象全屏
    renderer.domElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
  

  // console.log(animate1.isActive());
  // if (animate1.isActive()) {
  //   console.log(animate1);
  //   // 暂停
  //   animate1.pause();
  // } else {
  //   // 恢复
  //   animate1.resume();
  // }
})

function render() {
  controls.update()
  // 相机旋转
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
  // window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
  // 参数为需要触发的函数
};
render();


// 监听画面变化，更新渲染画面
window.addEventListener('resize', () => {
  console.log('画面变化');
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  // 更新渲染器
  renderer.setSize(window.innerWidth , window.innerHeight);
  // 设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
})