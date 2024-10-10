"use client";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import options from "./parallax.json";

const ParticleBackground = () => {
  initParticlesEngine(async (engine) => {
    await loadFull(engine);
  });

  return <Particles id="tsparticles" options={options} />;
};

export default ParticleBackground;
