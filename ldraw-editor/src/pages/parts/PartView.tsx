import React, { ReactElement, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { Canvas, useFrame } from 'react-three-fiber';

function Box(props: any) {
  // This reference will give us direct access to the mesh
  const mesh: any = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

const PartView = (): ReactElement => {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  //document.body.appendChild(renderer.domElement);

  console.log('PartsView');
  const { id } = useParams();
  return (
    <Canvas>
      <ambientLight />

      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
};

export default PartView;
