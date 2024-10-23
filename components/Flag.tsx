import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { Asset } from "expo-asset";

const Flag = ({ countryCode }) => {
  const glView = useRef(null);

  useEffect(() => {
    const initialize3DScene = async (gl) => {
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 2;

      // Create a Plane for the flag
      const geometry = new THREE.PlaneGeometry(2, 1);

      // Load the flag texture from the API
      const flagTexture = new THREE.TextureLoader().load(
        `https://flagsapi.com/${countryCode}/flat/64.png`
      );

      const material = new THREE.MeshBasicMaterial({ map: flagTexture });
      const flag = new THREE.Mesh(geometry, material);
      scene.add(flag);

      // Animation loop
      const render = () => {
        requestAnimationFrame(render);
        flag.rotation.y += 0.01; // Slowly rotate the flag on the Y-axis
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      render();
    };

    if (glView.current) {
      glView.current.startAsync().then(initialize3DScene);
    }
  }, [countryCode]);

  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        ref={glView}
        onContextCreate={initialize3DScene}
      />
    </View>
  );
};

export default Flag;
