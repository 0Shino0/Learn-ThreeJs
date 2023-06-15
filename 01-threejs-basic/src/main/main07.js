import * as THREE from 'three';
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// 导入动画库
import gsap from 'gsap';
// console.log(THREE)

// 目标：掌握gsap设置各种动画效果

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

// 设置时钟
const clock = new THREE.Clock();
// 设置动画
var animate1 = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: "slow(0.7, 0.7, false)",
  repeat: -1, // 设置重复的次数,无限为-1
  // 往返运动
  yoyo: true,
  // 延迟运动
  // delay:2,
  onComplete: () => { 
  console.log("动画结束");
  },
  onStart: () => { 
  console.log("动画开始");
}});
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, repeat: -1, yoyo: true, ease: "slow(0.7, 0.7, false)" });

window.addEventListener("dblclick", () => {
  console.log(animate1.isActive());
  if (animate1.isActive()) {
    console.log(animate1);
    // 暂停
    animate1.pause();
  } else {
    // 恢复
    animate1.resume();
  }
})

function render() {
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



