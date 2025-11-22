// Hero metaball settings configuration
// These settings can be imported and modified programmatically

import * as THREE from "three";

export interface MetaballSettings {
    preset: string;
    sphereCount: number;
    fixedTopLeftRadius: number;
    fixedBottomRightRadius: number;
    smallTopLeftRadius: number;
    smallBottomRightRadius: number;
    smoothness: number;
    mouseProximityEffect: boolean;
    minMovementScale: number;
    maxMovementScale: number;
    mouseSmoothness: number;
    cursorRadiusMin: number;
    cursorRadiusMax: number;
    animationSpeed: number;
    movementScale: number;
    ambientIntensity: number;
    diffuseIntensity: number;
    specularIntensity: number;
    specularPower: number;
    fresnelPower: number;
    contrast: number;
    cursorGlowIntensity: number;
    cursorGlowRadius: number;
    cursorGlowColor: THREE.Color;
    fogDensity: number;
    backgroundColor: THREE.Color;
    sphereColor: THREE.Color;
    lightColor: THREE.Color;
    lightPosition: THREE.Vector3;
    mergeDistance: number;
}

export const createPresetSettings = (isMobile: boolean): Record<string, Partial<MetaballSettings>> => ({
    holographic: {
        sphereCount: isMobile ? 5 : 8,
        ambientIntensity: 0.05,
        diffuseIntensity: 0.4,
        specularIntensity: 2.2,
        specularPower: 12,
        fresnelPower: 1.5,
        backgroundColor: new THREE.Color(0x0f0f0f),
        sphereColor: new THREE.Color(0x000000),
        lightColor: new THREE.Color(0x00ffff),
        lightPosition: new THREE.Vector3(1, 0.5, 1),
        smoothness: 0.25,
        animationSpeed: 0.8,
        movementScale: 1.0,
        mouseProximityEffect: true,
        minMovementScale: 0.4,
        maxMovementScale: 1.2,
        cursorGlowIntensity: 0.4,
        cursorGlowRadius: 1.2,
        cursorGlowColor: new THREE.Color(0x00ffff),
        fogDensity: 0.08,
        contrast: 1.1
    },
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
        animationSpeed: 0.5,
        movementScale: 0.8,
        mouseProximityEffect: true,
        minMovementScale: 0.3,
        maxMovementScale: 1.0,
        cursorGlowIntensity: 0.2,
        cursorGlowRadius: 0.8,
        cursorGlowColor: new THREE.Color(0xffffff),
        fogDensity: 0.1,
        contrast: 1.2
    },
    cosmic: {
        sphereCount: isMobile ? 6 : 10,
        ambientIntensity: 0.08,
        diffuseIntensity: 0.5,
        specularIntensity: 2.0,
        specularPower: 16,
        fresnelPower: 1.8,
        backgroundColor: new THREE.Color(0x000000),
        sphereColor: new THREE.Color(0x0a0a0a),
        lightColor: new THREE.Color(0x9966ff),
        lightPosition: new THREE.Vector3(0.5, 1, 1),
        smoothness: 0.4,
        animationSpeed: 1.2,
        movementScale: 1.2,
        mouseProximityEffect: true,
        minMovementScale: 0.5,
        maxMovementScale: 1.4,
        cursorGlowIntensity: 0.6,
        cursorGlowRadius: 1.5,
        cursorGlowColor: new THREE.Color(0x9966ff),
        fogDensity: 0.05,
        contrast: 1.0
    },
    // Add minimal, vibrant, neon, sunset, midnight, toxic, pastel, dithered presets...
});

export const defaultSettings = (isMobile: boolean): MetaballSettings => ({
    preset: "holographic",
    sphereCount: isMobile ? 5 : 8,
    fixedTopLeftRadius: 0.8,
    fixedBottomRightRadius: 0.6,
    smallTopLeftRadius: 0.35,
    smallBottomRightRadius: 0.28,
    smoothness: 0.25,
    mouseProximityEffect: true,
    minMovementScale: 0.4,
    maxMovementScale: 1.2,
    mouseSmoothness: 0.08,
    cursorRadiusMin: 0.08,
    cursorRadiusMax: 0.15,
    animationSpeed: 0.8,
    movementScale: 1.0,
    ambientIntensity: 0.05,
    diffuseIntensity: 0.4,
    specularIntensity: 2.2,
    specularPower: 12,
    fresnelPower: 1.5,
    contrast: 1.1,
    cursorGlowIntensity: 0.4,
    cursorGlowRadius: 1.2,
    cursorGlowColor: new THREE.Color(0x00ffff),
    fogDensity: 0.08,
    backgroundColor: new THREE.Color(0x0f0f0f),
    sphereColor: new THREE.Color(0x000000),
    lightColor: new THREE.Color(0x00ffff),
    lightPosition: new THREE.Vector3(1, 0.5, 1),
    mergeDistance: 1.2
});
