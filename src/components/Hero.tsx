"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import * as THREE from "three";
import { Pane } from "tweakpane";
import { useLanguage } from "../context/LanguageContext";
import { Package, Settings, Beaker, ArrowRight } from 'lucide-react';
import styles from "./Hero.module.css";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const uiContainerRef = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const tRef = useRef(t);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer;
    let material: THREE.ShaderMaterial;
    let clock: THREE.Clock;
    let cursorSphere3D = new THREE.Vector3(0, 0, 0);
    let activeMerges = 0;
    let targetMousePosition = new THREE.Vector2(0.5, 0.5);
    let mousePosition = new THREE.Vector2(0.5, 0.5);
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;
    let animationId: number;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isLowPowerDevice = isMobile || navigator.hardwareConcurrency <= 4;
    // Reduced pixel ratio for better performance
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);

    const presets: any = {
      moody: {
        sphereCount: isMobile ? 4 : 6,
        ambientIntensity: 0.02,
        diffuseIntensity: 0.6,
        specularIntensity: 1.8,
        specularPower: 8,
        fresnelPower: 1.2,
        backgroundColor: new THREE.Color(0x050505),
        sphereColor: new THREE.Color(0x000000),
        lightColor: new THREE.Color(0xffffff),
        lightPosition: new THREE.Vector3(1, 1, 1),
        smoothness: 0.3,
        contrast: 2.0,
        fogDensity: 0.12,
        cursorGlowIntensity: 0.4,
        cursorGlowRadius: 1.2,
        cursorGlowColor: new THREE.Color(0xffffff)
      },
      cosmic: {
        sphereCount: isMobile ? 3 : 6,
        ambientIntensity: 0.03,
        diffuseIntensity: 0.8,
        specularIntensity: 1.6,
        specularPower: 6,
        fresnelPower: 1.4,
        backgroundColor: new THREE.Color(0x000011),
        sphereColor: new THREE.Color(0x000022),
        lightColor: new THREE.Color(0x88aaff),
        lightPosition: new THREE.Vector3(0.5, 1, 0.5),
        smoothness: 0.4,
        contrast: 2.0,
        fogDensity: 0.15,
        cursorGlowIntensity: 0.8,
        cursorGlowRadius: 1.5,
        cursorGlowColor: new THREE.Color(0x4477ff)
      },
      minimal: {
        sphereCount: isMobile ? 2 : 3,
        ambientIntensity: 0.0,
        diffuseIntensity: 0.25,
        specularIntensity: 1.3,
        specularPower: 11,
        fresnelPower: 1.7,
        backgroundColor: new THREE.Color(0x0a0a0a),
        sphereColor: new THREE.Color(0x000000),
        lightColor: new THREE.Color(0xffffff),
        lightPosition: new THREE.Vector3(1, 0.5, 0.8),
        smoothness: 0.25,
        contrast: 2.0,
        fogDensity: 0.1,
        cursorGlowIntensity: 0.3,
        cursorGlowRadius: 1.0,
        cursorGlowColor: new THREE.Color(0xffffff)
      },
      vibrant: {
        sphereCount: isMobile ? 4 : 7,
        ambientIntensity: 0.05,
        diffuseIntensity: 0.9,
        specularIntensity: 1.5,
        specularPower: 5,
        fresnelPower: 1.3,
        backgroundColor: new THREE.Color(0x0a0505),
        sphereColor: new THREE.Color(0x110000),
        lightColor: new THREE.Color(0xff8866),
        lightPosition: new THREE.Vector3(0.8, 1.2, 0.6),
        smoothness: 0.5,
        contrast: 2.0,
        fogDensity: 0.08,
        cursorGlowIntensity: 0.8,
        cursorGlowRadius: 1.3,
        cursorGlowColor: new THREE.Color(0xff6644)
      },
      neon: {
        sphereCount: isMobile ? 3 : 5,
        ambientIntensity: 0.04,
        diffuseIntensity: 1.0,
        specularIntensity: 2.0,
        specularPower: 4,
        fresnelPower: 1.0,
        backgroundColor: new THREE.Color(0x000505),
        sphereColor: new THREE.Color(0x000808),
        lightColor: new THREE.Color(0x00ffcc),
        lightPosition: new THREE.Vector3(0.7, 1.3, 0.8),
        smoothness: 0.7,
        contrast: 2.0,
        fogDensity: 0.08,
        cursorGlowIntensity: 0.8,
        cursorGlowRadius: 1.4,
        cursorGlowColor: new THREE.Color(0x00ffaa)
      },
      sunset: {
        sphereCount: isMobile ? 3 : 5,
        ambientIntensity: 0.04,
        diffuseIntensity: 0.7,
        specularIntensity: 1.4,
        specularPower: 7,
        fresnelPower: 1.5,
        backgroundColor: new THREE.Color(0x150505),
        sphereColor: new THREE.Color(0x100000),
        lightColor: new THREE.Color(0xff6622),
        lightPosition: new THREE.Vector3(1.2, 0.4, 0.6),
        smoothness: 0.35,
        contrast: 2.0,
        fogDensity: 0.1,
        cursorGlowIntensity: 0.8,
        cursorGlowRadius: 1.4,
        cursorGlowColor: new THREE.Color(0xff4422)
      },
      midnight: {
        sphereCount: isMobile ? 3 : 4,
        ambientIntensity: 0.01,
        diffuseIntensity: 0.4,
        specularIntensity: 1.6,
        specularPower: 9,
        fresnelPower: 1.8,
        backgroundColor: new THREE.Color(0x000010),
        sphereColor: new THREE.Color(0x000015),
        lightColor: new THREE.Color(0x4466ff),
        lightPosition: new THREE.Vector3(0.9, 0.8, 1.0),
        smoothness: 0.28,
        contrast: 2.0,
        fogDensity: 0.14,
        cursorGlowIntensity: 0.8,
        cursorGlowRadius: 1.6,
        cursorGlowColor: new THREE.Color(0x3355ff)
      },
      toxic: {
        sphereCount: isMobile ? 3 : 6,
        ambientIntensity: 0.06,
        diffuseIntensity: 0.85,
        specularIntensity: 1.7,
        specularPower: 6,
        fresnelPower: 1.1,
        backgroundColor: new THREE.Color(0x001000),
        sphereColor: new THREE.Color(0x001500),
        lightColor: new THREE.Color(0x66ff44),
        lightPosition: new THREE.Vector3(0.6, 1.1, 0.7),
        smoothness: 0.55,
        contrast: 2.0,
        fogDensity: 0.09,
        cursorGlowIntensity: 0.8,
        cursorGlowRadius: 1.7,
        cursorGlowColor: new THREE.Color(0x44ff22)
      },
      pastel: {
        sphereCount: isMobile ? 4 : 6,
        ambientIntensity: 0.08,
        diffuseIntensity: 0.5,
        specularIntensity: 1.2,
        specularPower: 12,
        fresnelPower: 2.0,
        backgroundColor: new THREE.Color(0x101018),
        sphereColor: new THREE.Color(0x080814),
        lightColor: new THREE.Color(0xaabbff),
        lightPosition: new THREE.Vector3(1.0, 0.7, 0.9),
        smoothness: 0.38,
        contrast: 1.8,
        fogDensity: 0.07,
        cursorGlowIntensity: 0.35,
        cursorGlowRadius: 1.1,
        cursorGlowColor: new THREE.Color(0x8899ff)
      },
      dithered: {
        sphereCount: isMobile ? 3 : 5,
        ambientIntensity: 0.1,
        diffuseIntensity: 0.8,
        specularIntensity: 1.5,
        specularPower: 6,
        fresnelPower: 1.2,
        backgroundColor: new THREE.Color(0x0a0520),
        sphereColor: new THREE.Color(0x000000),
        lightColor: new THREE.Color(0xff00ff),
        lightPosition: new THREE.Vector3(0.8, 0.8, 0.8),
        smoothness: 0.6,
        contrast: 1.8,
        fogDensity: 0.05,
        cursorGlowIntensity: 1.0,
        cursorGlowRadius: 2.0,
        cursorGlowColor: new THREE.Color(0x00ffff)
      },
      holographic: {
        sphereCount: isMobile ? 3 : 5,
        ambientIntensity: 0.08,
        diffuseIntensity: 1.0,
        specularIntensity: 2.2,
        specularPower: 4,
        fresnelPower: 0.9,
        backgroundColor: new THREE.Color(0x000624),
        sphereColor: new THREE.Color(0x000418),
        lightColor: new THREE.Color(0xFFFFFF),       // White
        lightPosition: new THREE.Vector3(0.9, 0.9, 1.2),
        smoothness: 0.8,
        contrast: 1.6,
        fogDensity: 0.08,
        cursorGlowIntensity: 1.2,
        cursorGlowRadius: 2.0,
        cursorGlowColor: new THREE.Color(0x8D99AE)   // Slate glow
      }
    };

    const settings: any = {
      preset: "holographic",
      ...presets.holographic,
      backgroundColor: new THREE.Color(0x000000),
      fixedTopLeftRadius: 0.8,
      fixedBottomRightRadius: 0.9,
      smallTopLeftRadius: 0.3,
      smallBottomRightRadius: 0.35,
      cursorRadiusMin: 0.08,
      cursorRadiusMax: 0.15,
      animationSpeed: 0.6,
      movementScale: 1.2,
      mouseSmoothness: 0.1,
      mergeDistance: 1.5,
      mouseProximityEffect: true,
      minMovementScale: 0.3,
      maxMovementScale: 1.0
    };

    const getStoryText = (x: string, y: string, radius: string, merges: number, fps: number) => {
      const format = isMobile
        ? tRef.current("hero.story.mobile")
        : tRef.current("hero.story.desktop");

      return format
        .replace("{x}", x)
        .replace("{y}", y)
        .replace("{radius}", radius)
        .replace("{merges}", merges.toString())
        .replace("{fps}", fps.toString());
    };


    const screenToWorldJS = (normalizedX: number, normalizedY: number) => {
      const uv_x = normalizedX * 2.0 - 1.0;
      const uv_y = normalizedY * 2.0 - 1.0;
      const aspect = window.innerWidth / window.innerHeight;
      return new THREE.Vector3(uv_x * aspect * 2.0, uv_y * 2.0, 0.0);
    };

    const updateStory = (x: number, y: number, radius: number, merges: number, currentFps: number) => {
      if (!storyTextRef.current) return;
      const newText = getStoryText(
        x.toFixed(2),
        y.toFixed(2),
        radius.toFixed(2),
        merges,
        currentFps || 0
      );
      storyTextRef.current.innerHTML = newText;
    };

    const applyPreset = (presetName: string) => {
      const preset = presets[presetName];
      if (!preset) return;

      settings.preset = presetName;
      Object.keys(preset).forEach((key) => {
        if (settings.hasOwnProperty(key)) {
          settings[key] = preset[key];
        }
      });

      material.uniforms.uSphereCount.value = settings.sphereCount;
      material.uniforms.uAmbientIntensity.value = settings.ambientIntensity;
      material.uniforms.uDiffuseIntensity.value = settings.diffuseIntensity;
      material.uniforms.uSpecularIntensity.value = settings.specularIntensity;
      material.uniforms.uSpecularPower.value = settings.specularPower;
      material.uniforms.uFresnelPower.value = settings.fresnelPower;
      material.uniforms.uBackgroundColor.value = settings.backgroundColor;
      material.uniforms.uSphereColor.value = settings.sphereColor;
      material.uniforms.uLightColor.value = settings.lightColor;
      material.uniforms.uLightPosition.value = settings.lightPosition;
      material.uniforms.uSmoothness.value = settings.smoothness;
      material.uniforms.uContrast.value = settings.contrast;
      material.uniforms.uFogDensity.value = settings.fogDensity;
      material.uniforms.uCursorGlowIntensity.value = settings.cursorGlowIntensity;
      material.uniforms.uCursorGlowRadius.value = settings.cursorGlowRadius;
      material.uniforms.uCursorGlowColor.value = settings.cursorGlowColor;
    };

    const setupUI = () => {
      if (!uiContainerRef.current) return;

      const pane: any = new Pane({
        container: uiContainerRef.current,
        title: "Theme",
        expanded: true
      });

      // Main preset selector - always visible
      (pane as any)
        .addBinding(settings, "preset", {
          label: "Preset",
          options: {
            Holographic: "holographic",
            Moody: "moody",
            Cosmic: "cosmic",
            Minimal: "minimal",
            Vibrant: "vibrant",
            Neon: "neon",
            Sunset: "sunset",
            Midnight: "midnight",
            Toxic: "toxic",
            Pastel: "pastel",
            Psychedelic: "dithered"
          }
        })
        .on("change", (ev: any) => {
          applyPreset(ev.value);
          pane.refresh();
        });

      // Advanced controls - collapsed by default
      const metaballFolder = pane.addFolder({ title: "Metaballs", expanded: false });

      metaballFolder
        .addBinding(settings, "fixedTopLeftRadius", {
          min: 0.2,
          max: 2.0,
          step: 0.01,
          label: "Top Left Size"
        })
        .on("change", (ev: any) => {
          material.uniforms.uFixedTopLeftRadius.value = ev.value;
        });

      metaballFolder
        .addBinding(settings, "fixedBottomRightRadius", {
          min: 0.2,
          max: 2.0,
          step: 0.01,
          label: "Bottom Right Size"
        })
        .on("change", (ev: any) => {
          material.uniforms.uFixedBottomRightRadius.value = ev.value;
        });

      metaballFolder
        .addBinding(settings, "smallTopLeftRadius", {
          min: 0.1,
          max: 0.8,
          step: 0.01,
          label: "Small Top Left"
        })
        .on("change", (ev: any) => {
          material.uniforms.uSmallTopLeftRadius.value = ev.value;
        });

      metaballFolder
        .addBinding(settings, "smallBottomRightRadius", {
          min: 0.1,
          max: 0.8,
          step: 0.01,
          label: "Small Bottom Right"
        })
        .on("change", (ev: any) => {
          material.uniforms.uSmallBottomRightRadius.value = ev.value;
        });

      metaballFolder
        .addBinding(settings, "sphereCount", {
          min: 2,
          max: 10,
          step: 1,
          label: "Moving Count"
        })
        .on("change", (ev: any) => {
          material.uniforms.uSphereCount.value = ev.value;
        });

      metaballFolder
        .addBinding(settings, "smoothness", {
          min: 0.1,
          max: 1.0,
          step: 0.01,
          label: "Blend Smoothness"
        })
        .on("change", (ev: any) => {
          material.uniforms.uSmoothness.value = ev.value;
        });

      const mouseFolder = pane.addFolder({ title: "Mouse Interaction", expanded: false });

      mouseFolder
        .addBinding(settings, "mouseProximityEffect")
        .on("change", (ev: any) => {
          material.uniforms.uMouseProximityEffect.value = ev.value;
        });

      mouseFolder
        .addBinding(settings, "minMovementScale", {
          min: 0.1,
          max: 1.0,
          step: 0.05
        })
        .on("change", (ev: any) => {
          material.uniforms.uMinMovementScale.value = ev.value;
        });

      mouseFolder
        .addBinding(settings, "maxMovementScale", {
          min: 0.5,
          max: 2.0,
          step: 0.05
        })
        .on("change", (ev: any) => {
          material.uniforms.uMaxMovementScale.value = ev.value;
        });

      mouseFolder.addBinding(settings, "mouseSmoothness", {
        min: 0.01,
        max: 0.2,
        step: 0.01,
        label: "Mouse Smoothness"
      });

      const cursorFolder = pane.addFolder({ title: "Cursor", expanded: false });

      cursorFolder.addBinding(settings, "cursorRadiusMin", {
        min: 0.05,
        max: 0.2,
        step: 0.01,
        label: "Min Radius"
      });

      cursorFolder.addBinding(settings, "cursorRadiusMax", {
        min: 0.1,
        max: 0.25,
        step: 0.01,
        label: "Max Radius"
      });

      const animationFolder = pane.addFolder({ title: "Animation", expanded: false });

      animationFolder
        .addBinding(settings, "animationSpeed", {
          min: 0.1,
          max: 3.0,
          step: 0.1
        })
        .on("change", (ev: any) => {
          material.uniforms.uAnimationSpeed.value = ev.value;
        });

      animationFolder
        .addBinding(settings, "movementScale", {
          min: 0.5,
          max: 2.0,
          step: 0.1
        })
        .on("change", (ev: any) => {
          material.uniforms.uMovementScale.value = ev.value;
        });

      const lightingFolder = pane.addFolder({ title: "Lighting", expanded: false });

      lightingFolder
        .addBinding(settings, "ambientIntensity", {
          min: 0,
          max: 0.5,
          step: 0.01
        })
        .on("change", (ev: any) => {
          material.uniforms.uAmbientIntensity.value = ev.value;
        });

      lightingFolder
        .addBinding(settings, "diffuseIntensity", {
          min: 0,
          max: 1.0,
          step: 0.01
        })
        .on("change", (ev: any) => {
          material.uniforms.uDiffuseIntensity.value = ev.value;
        });

      lightingFolder
        .addBinding(settings, "specularIntensity", {
          min: 0,
          max: 2.0,
          step: 0.01
        })
        .on("change", (ev: any) => {
          material.uniforms.uSpecularIntensity.value = ev.value;
        });

      lightingFolder
        .addBinding(settings, "specularPower", {
          min: 1,
          max: 64,
          step: 1
        })
        .on("change", (ev: any) => {
          material.uniforms.uSpecularPower.value = ev.value;
        });

      lightingFolder
        .addBinding(settings, "fresnelPower", {
          min: 1,
          max: 5,
          step: 0.1
        })
        .on("change", (ev: any) => {
          material.uniforms.uFresnelPower.value = ev.value;
        });

      lightingFolder
        .addBinding(settings, "contrast", {
          min: 0.5,
          max: 2.0,
          step: 0.1
        })
        .on("change", (ev: any) => {
          material.uniforms.uContrast.value = ev.value;
        });

      const glowFolder = pane.addFolder({ title: "Cursor Glow", expanded: false });

      glowFolder
        .addBinding(settings, "cursorGlowIntensity", {
          min: 0,
          max: 2.0,
          step: 0.1
        })
        .on("change", (ev: any) => {
          material.uniforms.uCursorGlowIntensity.value = ev.value;
        });

      glowFolder
        .addBinding(settings, "cursorGlowRadius", {
          min: 0.5,
          max: 3.0,
          step: 0.1
        })
        .on("change", (ev: any) => {
          material.uniforms.uCursorGlowRadius.value = ev.value;
        });

      glowFolder
        .addBinding(settings, "fogDensity", {
          min: 0,
          max: 0.5,
          step: 0.01
        })
        .on("change", (ev: any) => {
          material.uniforms.uFogDensity.value = ev.value;
        });
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;
      clock = new THREE.Clock();

      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile && !isLowPowerDevice,
        alpha: true,
        powerPreference: isMobile ? "default" : "high-performance",
        preserveDrawingBuffer: false,
        premultipliedAlpha: false
      });

      const pixelRatio = Math.min(devicePixelRatio, isMobile ? 1.5 : 2);
      renderer.setPixelRatio(pixelRatio);

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      renderer.setSize(viewportWidth, viewportHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const canvas = renderer.domElement;
      canvas.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 0 !important;
        display: block !important;
      `;
      containerRef.current?.appendChild(canvas);

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(viewportWidth, viewportHeight) },
          uActualResolution: {
            value: new THREE.Vector2(
              viewportWidth * pixelRatio,
              viewportHeight * pixelRatio
            )
          },
          uPixelRatio: { value: pixelRatio },
          uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
          uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
          uCursorRadius: { value: settings.cursorRadiusMin },
          uSphereCount: { value: settings.sphereCount },
          uFixedTopLeftRadius: { value: settings.fixedTopLeftRadius },
          uFixedBottomRightRadius: { value: settings.fixedBottomRightRadius },
          uSmallTopLeftRadius: { value: settings.smallTopLeftRadius },
          uSmallBottomRightRadius: { value: settings.smallBottomRightRadius },
          uMergeDistance: { value: settings.mergeDistance },
          uSmoothness: { value: settings.smoothness },
          uAmbientIntensity: { value: settings.ambientIntensity },
          uDiffuseIntensity: { value: settings.diffuseIntensity },
          uSpecularIntensity: { value: settings.specularIntensity },
          uSpecularPower: { value: settings.specularPower },
          uFresnelPower: { value: settings.fresnelPower },
          uBackgroundColor: { value: settings.backgroundColor },
          uSphereColor: { value: settings.sphereColor },
          uLightColor: { value: settings.lightColor },
          uLightPosition: { value: settings.lightPosition },
          uContrast: { value: settings.contrast },
          uFogDensity: { value: settings.fogDensity },
          uAnimationSpeed: { value: settings.animationSpeed },
          uMovementScale: { value: settings.movementScale },
          uMouseProximityEffect: { value: settings.mouseProximityEffect },
          uMinMovementScale: { value: settings.minMovementScale },
          uMaxMovementScale: { value: settings.maxMovementScale },
          uCursorGlowIntensity: { value: settings.cursorGlowIntensity },
          uCursorGlowRadius: { value: settings.cursorGlowRadius },
          uCursorGlowColor: { value: settings.cursorGlowColor },
          uIsSafari: { value: isSafari ? 1.0 : 0.0 },
          uIsMobile: { value: isMobile ? 1.0 : 0.0 },
          uIsLowPower: { value: isLowPowerDevice ? 1.0 : 0.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          ${isMobile || isSafari || isLowPowerDevice
            ? "precision mediump float;"
            : "precision highp float;"
          }
          
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec2 uActualResolution;
          uniform float uPixelRatio;
          uniform vec2 uMousePosition;
          uniform vec3 uCursorSphere;
          uniform float uCursorRadius;
          uniform int uSphereCount;
          uniform float uFixedTopLeftRadius;
          uniform float uFixedBottomRightRadius;
          uniform float uSmallTopLeftRadius;
          uniform float uSmallBottomRightRadius;
          uniform float uMergeDistance;
          uniform float uSmoothness;
          uniform float uAmbientIntensity;
          uniform float uDiffuseIntensity;
          uniform float uSpecularIntensity;
          uniform float uSpecularPower;
          uniform float uFresnelPower;
          uniform vec3 uBackgroundColor;
          uniform vec3 uSphereColor;
          uniform vec3 uLightColor;
          uniform vec3 uLightPosition;
          uniform float uContrast;
          uniform float uFogDensity;
          uniform float uAnimationSpeed;
          uniform float uMovementScale;
          uniform bool uMouseProximityEffect;
          uniform float uMinMovementScale;
          uniform float uMaxMovementScale;
          uniform float uCursorGlowIntensity;
          uniform float uCursorGlowRadius;
          uniform vec3 uCursorGlowColor;
          uniform float uIsSafari;
          uniform float uIsMobile;
          uniform float uIsLowPower;
          
          varying vec2 vUv;
          
          const float PI = 3.14159265359;
          const float EPSILON = 0.001;
          const float MAX_DIST = 100.0;
          
          float smin(float a, float b, float k) {
            float h = max(k - abs(a - b), 0.0) / k;
            return min(a, b) - h * h * k * 0.25;
          }
          
          float sdSphere(vec3 p, float r) {
            return length(p) - r;
          }
          
          vec3 screenToWorld(vec2 normalizedPos) {
            vec2 uv = normalizedPos * 2.0 - 1.0;
            uv.x *= uResolution.x / uResolution.y;
            return vec3(uv * 2.0, 0.0);
          }
          
          float getDistanceToCenter(vec2 pos) {
            float dist = length(pos - vec2(0.5, 0.5)) * 2.0;
            return smoothstep(0.0, 1.0, dist);
          }
          
          float sceneSDF(vec3 pos) {
            float result = MAX_DIST;
            
            vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
            float topLeft = sdSphere(pos - topLeftPos, uFixedTopLeftRadius);
            
            vec3 smallTopLeftPos = screenToWorld(vec2(0.25, 0.72));
            float smallTopLeft = sdSphere(pos - smallTopLeftPos, uSmallTopLeftRadius);
            
            vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
            float bottomRight = sdSphere(pos - bottomRightPos, uFixedBottomRightRadius);
            
            vec3 smallBottomRightPos = screenToWorld(vec2(0.72, 0.25));
            float smallBottomRight = sdSphere(pos - smallBottomRightPos, uSmallBottomRightRadius);
            
            float t = uTime * uAnimationSpeed;
            
            float dynamicMovementScale = uMovementScale;
            if (uMouseProximityEffect) {
              float distToCenter = getDistanceToCenter(uMousePosition);
              float mixFactor = smoothstep(0.0, 1.0, distToCenter);
              dynamicMovementScale = mix(uMinMovementScale, uMaxMovementScale, mixFactor);
            }
            
            // Reduced iterations for better performance
            int maxIter = uIsMobile > 0.5 ? 3 : (uIsLowPower > 0.5 ? 4 : min(uSphereCount, 6));
            for (int i = 0; i < 10; i++) {
              if (i >= uSphereCount || i >= maxIter) break;
              
              float fi = float(i);
              float speed = 0.4 + fi * 0.12;
              float radius = 0.12 + mod(fi, 3.0) * 0.06;
              float orbitRadius = (0.3 + mod(fi, 3.0) * 0.15) * dynamicMovementScale;
              float phaseOffset = fi * PI * 0.35;
              
              float distToCursor = length(vec3(0.0) - uCursorSphere);
              float proximityScale = 1.0 + (1.0 - smoothstep(0.0, 1.0, distToCursor)) * 0.5;
              orbitRadius *= proximityScale;
              
              vec3 offset;
              if (i == 0) {
                offset = vec3(
                  sin(t * speed) * orbitRadius * 0.7,
                  sin(t * 0.5) * orbitRadius,
                  cos(t * speed * 0.7) * orbitRadius * 0.5
                );
              } else if (i == 1) {
                offset = vec3(
                  sin(t * speed + PI) * orbitRadius * 0.5,
                  -sin(t * 0.5) * orbitRadius,
                  cos(t * speed * 0.7 + PI) * orbitRadius * 0.5
                );
              } else {
                offset = vec3(
                  sin(t * speed + phaseOffset) * orbitRadius * 0.8,
                  cos(t * speed * 0.85 + phaseOffset * 1.3) * orbitRadius * 0.6,
                  sin(t * speed * 0.5 + phaseOffset) * 0.3
                );
              }
              
              vec3 toCursor = uCursorSphere - offset;
              float cursorDist = length(toCursor);
              if (cursorDist < uMergeDistance && cursorDist > 0.0) {
                float attraction = (1.0 - cursorDist / uMergeDistance) * 0.3;
                offset += normalize(toCursor) * attraction;
              }
              
              float movingSphere = sdSphere(pos - offset, radius);
              
              float blend = 0.05;
              if (cursorDist < uMergeDistance) {
                float influence = 1.0 - (cursorDist / uMergeDistance);
                blend = mix(0.05, uSmoothness, influence * influence * influence);
              }
              
              result = smin(result, movingSphere, blend);
            }
            
            float cursorBall = sdSphere(pos - uCursorSphere, uCursorRadius);
            
            float topLeftGroup = smin(topLeft, smallTopLeft, 0.4);
            float bottomRightGroup = smin(bottomRight, smallBottomRight, 0.4);
            
            result = smin(result, topLeftGroup, 0.3);
            result = smin(result, bottomRightGroup, 0.3);
            result = smin(result, cursorBall, uSmoothness);
            
            return result;
          }
          
          vec3 calcNormal(vec3 p) {
            float eps = uIsLowPower > 0.5 ? 0.002 : 0.001;
            return normalize(vec3(
              sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
              sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
              sceneSDF(p + vec3(0, 0, eps)) - sceneSDF(p - vec3(0, 0, eps))
            ));
          }
          
          float ambientOcclusion(vec3 p, vec3 n) {
            // Simplified AO for all devices
            float h1 = sceneSDF(p + n * 0.03);
            float h2 = sceneSDF(p + n * 0.06);
            float occ = (0.03 - h1) + (0.06 - h2) * 0.5;
            return clamp(1.0 - occ * 2.0, 0.0, 1.0);
          }
          
          float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
            // Reduced shadow samples for better performance
            float result = 1.0;
            float t = mint;
            int maxSteps = uIsMobile > 0.5 ? 2 : (uIsLowPower >0.5 ? 3 : 8);
            
            for (int i = 0; i< 8; i++) {
              if (i >= maxSteps) break;
              if (t >= maxt) break;
              
              float h = sceneSDF(ro + rd * t);
              if (h< EPSILON) return 0.0;
              result = min(result, k * h / t);
              t += max(h, 0.02);
            }
            return result;
          }
          
          float rayMarch(vec3 ro, vec3 rd) {
            float t = 0.0;
            // Reduced ray march steps for better performance
            int maxSteps = uIsMobile > 0.5 ? 12 : (uIsSafari >0.5 ? 16 : 32);
            
            for (int i = 0; i< 32; i++) {
              if (i >= maxSteps) break;
              
              vec3 p = ro + rd * t;
              float d = sceneSDF(p);
              
              if (d< EPSILON) {
                return t;
              }
              
              if (t > 5.0) {
                break;
              }
              
              t += d * (uIsLowPower > 0.5 ? 1.2 : 0.9);
            }
            
            return -1.0;
          }
          
          vec3 lighting(vec3 p, vec3 rd, float t) {
            if (t < 0.0) {
              return vec3(0.0);
            }
            
            vec3 normal = calcNormal(p);
            vec3 viewDir = -rd;
            
            vec3 baseColor = uSphereColor;
            
            float ao = ambientOcclusion(p, normal);
            
            vec3 ambient = uLightColor * uAmbientIntensity * ao;
            
            vec3 lightDir = normalize(uLightPosition);
            float diff = max(dot(normal, lightDir), 0.0);
            
            float shadow = softShadow(p, lightDir, 0.01, 10.0, 20.0);
            
            vec3 diffuse = uLightColor * diff * uDiffuseIntensity * shadow;
            
            vec3 reflectDir = reflect(-lightDir, normal);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecularPower);
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);
            
            vec3 specular = uLightColor * spec * uSpecularIntensity * fresnel;
            
            vec3 fresnelRim = uLightColor * fresnel * 0.4;
            
            float distToCursor = length(p - uCursorSphere);
            if (distToCursor < uCursorRadius + 0.4) {
              float highlight = 1.0 - smoothstep(0.0, uCursorRadius + 0.4, distToCursor);
              specular += uLightColor * highlight * 0.2;
              
              float glow = exp(-distToCursor * 3.0) * 0.15;
              ambient += uLightColor * glow * 0.5;
            }
            
            vec3 color = (baseColor + ambient + diffuse + specular + fresnelRim) * ao;
            
            color = pow(color, vec3(uContrast * 0.9));
            color = color / (color + vec3(0.8));
            
            return color;
          }
          
          float calculateCursorGlow(vec3 worldPos) {
            float dist = length(worldPos.xy - uCursorSphere.xy);
            float glow = 1.0 - smoothstep(0.0, uCursorGlowRadius, dist);
            glow = pow(glow, 2.0);
            return glow * uCursorGlowIntensity;
          }
          
          void main() {
            vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
            uv.x *= uResolution.x / uResolution.y;
            
            vec3 ro = vec3(uv * 2.0, -1.0);
            vec3 rd = vec3(0.0, 0.0, 1.0);
            
            float t = rayMarch(ro, rd);
            
            vec3 p = ro + rd * t;
            
            vec3 color = lighting(p, rd, t);
            
            float cursorGlow = calculateCursorGlow(ro);
            vec3 glowContribution = uCursorGlowColor * cursorGlow;
            
            if (t > 0.0) {
              float fogAmount = 1.0 - exp(-t * uFogDensity);
              color = mix(color, uBackgroundColor.rgb, fogAmount * 0.3);
              
              color += glowContribution * 0.3;
              
              gl_FragColor = vec4(color, 1.0);
            } else {
              if (cursorGlow > 0.01) {
                gl_FragColor = vec4(glowContribution, cursorGlow * 0.8);
              } else {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
              }
            }
          }
        `,
        transparent: true
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      setupEventListeners();

      // setupUI(); // Hidden for now - preset functionality preserved for later use

      onPointerMove({
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
      });
    };

    const setupEventListeners = () => {
      window.addEventListener("mousemove", onPointerMove, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: false });
      window.addEventListener("resize", onWindowResize, { passive: true });
      window.addEventListener(
        "orientationchange",
        () => {
          setTimeout(onWindowResize, 100);
        },
        { passive: true }
      );
    };

    const onTouchStart = (event: TouchEvent) => {
      // event.preventDefault();
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        onPointerMove({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      // event.preventDefault();
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        onPointerMove({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
      }
    };

    const onTouchEnd = () => {
      onPointerMove({
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
      });
    };

    const onPointerMove = (event: { clientX: number; clientY: number }) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      targetMousePosition.set(x, 1.0 - y);
    };

    const onWindowResize = () => {
      if (!renderer || !material) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);

      material.uniforms.uResolution.value.set(width, height);
      material.uniforms.uActualResolution.value.set(width * pixelRatio, height * pixelRatio);
      material.uniforms.uPixelRatio.value = pixelRatio;
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Only render if visible
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Smooth mouse movement
      mousePosition.lerp(targetMousePosition, settings.mouseSmoothness);

      material.uniforms.uTime.value = time;
      material.uniforms.uMousePosition.value.copy(mousePosition);

      // Update cursor sphere position in 3D space
      const worldMouse = screenToWorldJS(mousePosition.x, mousePosition.y);
      cursorSphere3D.lerp(worldMouse, 0.1);
      material.uniforms.uCursorSphere.value.copy(cursorSphere3D);

      renderer.render(scene, camera);

      // Update story text less frequently
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 500) {
        fps = Math.round((frameCount * 1000) / (now - lastTime));

        updateStory(
          mousePosition.x,
          mousePosition.y,
          settings.cursorRadiusMin + Math.sin(time) * 0.05,
          Math.floor(Math.random() * 3),
          fps
        );

        frameCount = 0;
        lastTime = now;
      }
    };

    setupUI();
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onWindowResize);

      if (renderer) {
        renderer.dispose();
        const canvas = renderer.domElement;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
      if (uiContainerRef.current) {
        uiContainerRef.current.innerHTML = '';
      }
    };
  }, [isMobile, isVisible]);

  // Intersection Observer to pause animation when out of viewport
  useEffect(() => {
    if (!heroSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when at least 10% is visible
      }
    );

    observer.observe(heroSectionRef.current);

    return () => {
      if (heroSectionRef.current) {
        observer.unobserve(heroSectionRef.current);
      }
    };
  }, []);

  // Scroll-based mask effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Progress from 0 to 1 based on scroll (complete at 100% of viewport height)
      // This gives us the full scroll distance to complete the effect
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleEmailClick = (e: MouseEvent) => {
      e.preventDefault();
      const emailLink = e.currentTarget as HTMLElement;
      const originalText = emailLink.textContent || "";
      navigator.clipboard
        .writeText("info@bimotech.pl")
        .then(() => {
          emailLink.textContent = "transmission sent to clipboard";
          setTimeout(() => {
            emailLink.textContent = originalText;
          }, 2000);
        })
        .catch(() => {
          window.location.href = "mailto:info@bimotech.pl";
        });
    };

    const emailLink = document.querySelector(`.${styles.contactEmail}`);
    if (emailLink) {
      emailLink.addEventListener("click", handleEmailClick as any);
      return () => {
        emailLink.removeEventListener("click", handleEmailClick as any);
      };
    }
  }, []);

  // Calculate mask styles based on scroll progress
  // Using easing for smoother feel
  const easedProgress = scrollProgress < 0.5
    ? 2 * scrollProgress * scrollProgress
    : 1 - Math.pow(-2 * scrollProgress + 2, 2) / 2;

  const maskInset = easedProgress * 8; // Max 8% inset from edges for more dramatic effect
  const maskBorderRadius = easedProgress * 60; // Max 60px border radius
  const maskOpacity = easedProgress * 0.95; // Max opacity for the surrounding dark area

  return (
    <>
      <section ref={heroSectionRef} className={`${styles.section} ${styles.heroSection}`}>
        <div ref={containerRef} id="container"></div>
        <div id="stats"></div>
        {/* <div ref={uiContainerRef} id="ui-container"></div> */}

        {/* Scroll-triggered rounded mask overlay */}
        <div
          ref={maskRef}
          className={styles.scrollMask}
          style={{
            inset: `${maskInset}%`,
            borderRadius: `${maskBorderRadius}px`,
            opacity: scrollProgress > 0.01 ? 1 : 0,
            boxShadow: `0 0 0 100vmax rgba(0, 0, 0, ${maskOpacity})`,
          }}
        />

        <div className={styles.headerArea}>
          {/* Logo will be added here later */}
          {/* Center logo removed */}
        </div>

        {/* BIMO TECH 2030 - Simplified Hero */}
        <div className={styles.hero2030}>
          {/* Value Proposition */}
          <div className={styles.heroHeadline}>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleStatic}>Precision </span>
              <span className={styles.titleCarouselWrapper}>
                <span className={styles.titleCarousel}>
                  <span className={styles.titleSlide}>Refractory Metals</span>
                  <span className={styles.titleSlide}>Sputtering Targets</span>
                  <span className={styles.titleSlide}>High-Entropy Alloys</span>
                  <span className={styles.titleSlide}>Tungsten Components</span>
                  <span className={styles.titleSlide}>Custom Machining</span>
                  <span className={styles.titleSlide}>Refractory Metals</span>
                </span>
              </span>
            </h1>
            <p className={styles.heroSubtitle}>Tungsten, Molybdenum, Tantalum, Niobium — engineered for extreme environments.</p>
            <div className={styles.heroCtas}>
              <Link href={`/${language}/quote`} className={styles.primaryCta}>
                Request Quote <ArrowRight size={18} />
              </Link>
              <Link href={`/${language}/products`} className={styles.secondaryCta}>
                Browse Materials
              </Link>
            </div>
          </div>

          {/* Intent Selection */}
          <div className={styles.intentSection}>
            <p className={styles.intentLabel}>What are you looking for?</p>
            <div className={styles.intentButtons}>
              <Link href={`/${language}/products`} className={styles.intentButton}>
                <Package size={24} className={styles.intentIcon} />
                <div>
                  <span className={styles.intentTitle}>Materials Supply</span>
                  <span className={styles.intentDesc}>Refractory metals, semi-finished products, reliable supplier.</span>
                </div>
              </Link>
              <Link href={`/${language}/services`} className={styles.intentButton}>
                <Settings size={24} className={styles.intentIcon} />
                <div>
                  <span className={styles.intentTitle}>Manufacturing</span>
                  <span className={styles.intentDesc}>Custom components, precision machining, finishing.</span>
                </div>
              </Link>
              <Link href={`/${language}/contact`} className={styles.intentButton}>
                <Beaker size={24} className={styles.intentIcon} />
                <div>
                  <span className={styles.intentTitle}>R&D Partnership</span>
                  <span className={styles.intentDesc}>Advanced materials research, new alloy development.</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.coordinates}>
          <p>BimoTech • Advanced Materials</p>
          <p>Wrocław, Poland</p>
        </div>
      </section>

      {/* Fin section removed */}
    </>
  );
}
