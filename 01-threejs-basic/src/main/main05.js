import * as THREE from 'three';
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// console.log(THREE)

// 目标：使用控制器查看3d物体

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
console.log(camera);

// 添加物体
// 创建几何体 点线面
const cubeGeometry = new THREE.BoxGeometry(1,1,1);
// 材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: '#2a53cd' });
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 修改物体位置
// cube.position.set(5,0,0)
// cube.position.x = 5
// 缩放
// cube.scale.set(3, 2, 1); // x轴3倍 y轴2倍 z轴1倍
// cube.scale.x = 5;
// 旋转
cube.rotation.set(Math.PI / 4, 0, 0,"XZY");


// 将几何体添加到场景中
scene.add(cube);
console.log(cube);

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

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 往返运动标识
let flag = false;
// 动态渲染
function render(time) {
  // 物体往返运动
  // if (flag) {
  //   cube.position.x -= 0.05;
  //   cube.rotation.x -= 0.05; 
  // } else{
  //   cube.position.x += 0.01;
  //   cube.rotation.x += 0.01; 
  // }
  console.log(cube.position.x);
  if (cube.position.x >= 4.9) {
    flag = true;
  } else if (cube.position.x <= 0.1) {
    flag = false;
  }
  
  // 规范时间间隔
  let t = time / 1000 %5;
  // console.log(t);
  if (flag) {
    cube.position.x = 5 - t * 1;
  } else{
    cube.position.x = t * 1;
  }

  // rotation.scale.x += 5;

  // 相机旋转
  // camera.rotation.set(Math.PI/4,0,0)
  // camera.rotation.x += 0.01;

  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
  // window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
  // 参数为需要触发的函数
};
render();



