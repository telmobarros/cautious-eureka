
import React from 'react';
import * as THREE from "three";

export default class Sphere3D extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        mouseX: 0,
        mouseY: 0,
        SEPARATION: 200,
        AMOUNTX: 10,
        AMOUNTY: 10
      };
      if (window.innerWidth > window.innerHeight) {
        this.state.windowHalfX = window.innerWidth / 2
        this.state.windowHalfY = window.innerHeight / 2
        this.state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
        this.state.scene = new THREE.Scene()
        this.state.renderer = new THREE.WebGLRenderer({ alpha: true })
      } else {
  
      }
  
      // This binding is necessary to make `this` work in the callback
      this.animate = this.animate.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.render3d = this.render3d.bind(this);
    }
  
    componentDidMount() {
      if (this.state.renderer) {
        this.state.renderer.setSize(window.innerWidth, window.innerHeight - 10);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        this.mount.appendChild(this.state.renderer.domElement);
  
        this.state.camera.position.z = 1000
  
  
        // particles
        var PI2 = Math.PI * 2;
        var material = new THREE.SpriteMaterial({
          color: 0xffffff,
          program: function (context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();
          }
        });
  
        var geometry = new THREE.Geometry();
  
        for (var i = 0; i < 200; i++) {
          var particle;
          particle = new THREE.Sprite(new THREE.PointsMaterial( { color: 0x888888 } ));
          particle.position.x = Math.random() * 2 - 1;
          particle.position.y = Math.random() * 2 - 1;
          particle.position.z = Math.random() * 2 - 1;
          particle.position.normalize();
          particle.position.multiplyScalar(Math.random() * 10 + 450);
          particle.scale.x = particle.scale.y = 10;
          this.state.scene.add(particle);
          geometry.vertices.push(particle.position);
        }
  
        // lines
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5 }));
        this.state.scene.add(line);
  
        // end init();
  
        this.animate();
      }
    }
  
    animate() {
      requestAnimationFrame(this.animate);
      this.render3d();
    }
  
    render3d() {
      this.state.camera.position.set(
        this.state.camera.position.x + (this.state.mouseX - this.state.camera.position.x) * .05,
        this.state.camera.position.y + (- this.state.mouseY + 200 - this.state.camera.position.y) * .05,
        this.state.camera.position.z)
      this.state.camera.lookAt(this.state.scene.position);
  
      this.state.renderer.render(this.state.scene, this.state.camera);
    }
  
    onMouseMove(event) {
      console.log(event)
      this.setState({
        mouseX: event.clientX - this.state.windowHalfX,
        mouseY: event.clientY - this.state.windowHalfY
      })
    }
  
    onTouchStart(event) {
      if (event.touches.length > 1) {
  
        /*event.preventDefault();*/
        this.setState({
          mouseX: event.touches[0].pageX - this.state.windowHalfX,
          mouseY: event.touches[0].pageY - this.state.windowHalfY
        })
  
      }
    }
  
    onTouchMove(event) {
      if (event.touches.length === 1) {
  
        /*event.preventDefault();*/
        this.setState({
          mouseX: event.touches[0].pageX - this.state.windowHalfX,
          mouseY: event.touches[0].pageY - this.state.windowHalfY
        })
  
      }
    }
  
    render() {
      return (
        <div ref={ref => (this.mount = ref)}
          onMouseMove={this.onMouseMove}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove} />
      )
    }
  }