import { Canvas } from "@react-three/fiber";
import { Box } from "./Box";
import React from "react";

export const BoxScene = () => {
  return (
    <Canvas style={{ position: "absolute", left: 0, top: 0 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[0, -2, 0]} />
    </Canvas>
  );
};
