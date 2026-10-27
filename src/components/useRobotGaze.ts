import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils, Vector3 } from "three";

export interface GazeTarget {
  x: number;
  y: number;
  active: boolean;
}

export function useRobotGaze(
  head: RefObject<Group | null>,
  eyes: RefObject<Group | null>,
  target?: RefObject<GazeTarget>,
) {
  const { gl, camera, invalidate } = useThree();
  const pointer = useRef<GazeTarget>({ x: 0, y: 0, active: false });
  const world = useRef(new Vector3());
  const visible = useRef(true),
    reduced = useRef(false),
    blink = useRef(-1);
  const pose = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reduced.current = preference.matches;
      invalidate();
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !visible.current || reduced.current)
        return;
      pointer.current = { x: event.clientX, y: event.clientY, active: true };
      invalidate();
    };
    const leave = () => {
      pointer.current.active = false;
      invalidate();
    };
    const focus = () => {
      if (visible.current) invalidate();
    };
    const capture = () => {
      blink.current = -1;
      pose.current = { x: 0, y: 0 };
      head.current?.rotation.set(0, 0, 0);
      if (eyes.current) {
        eyes.current.position.set(0, 0, 0);
        eyes.current.scale.y = 1;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting) invalidate();
    });
    observer.observe(gl.domElement);
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        if (
          visible.current &&
          !document.hidden &&
          !reduced.current &&
          document.documentElement.dataset.realmMotion !== "off"
        ) {
          blink.current = performance.now();
          invalidate();
        }
        schedule();
      }, 4800);
    };
    schedule();
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("robot-look-target", focus);
    if (import.meta.env.DEV) window.addEventListener("robot-capture", capture);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("robot-look-target", focus);
      window.removeEventListener("robot-capture", capture);
    };
  }, [gl, invalidate]);
  useFrame((_, delta) => {
    if (!head.current || !eyes.current || !visible.current) return;
    let ancestor = head.current.parent;
    while (ancestor) {
      if (!ancestor.visible) return;
      ancestor = ancestor.parent;
    }
    const gaze = target?.current.active ? target.current : pointer.current;
    if (import.meta.env.DEV && target) gl.domElement.dataset.gazeInput = JSON.stringify({gaze, visible: visible.current, reduced: reduced.current, motion: document.documentElement.dataset.realmMotion});
    let x = 0,
      y = 0;
    if (
      !reduced.current &&
      document.documentElement.dataset.realmMotion !== "off" &&
      gaze.active
    ) {
      const bounds = gl.domElement.getBoundingClientRect();
      head.current.getWorldPosition(world.current);
      world.current.project(camera);
      const originX = bounds.left + ((world.current.x + 1) * bounds.width) / 2;
      const originY = bounds.top + ((1 - world.current.y) * bounds.height) / 2;
      const targeted = target?.current.active;
      x = MathUtils.clamp(
        (gaze.x - originX) /
          Math.max(
            targeted ? window.innerWidth * 0.65 : bounds.width * 0.45,
            180,
          ),
        -1,
        1,
      );
      y = MathUtils.clamp(
        (originY - gaze.y) /
          Math.max(
            targeted ? window.innerHeight * 0.5 : bounds.height * 0.4,
            180,
          ),
        -1,
        1,
      );
    }
    const damping = reduced.current
      ? 1
      : 1 - Math.exp(-Math.min(delta, 0.05) * 12);
    pose.current.x = MathUtils.lerp(pose.current.x, x, damping);
    pose.current.y = MathUtils.lerp(pose.current.y, y, damping);
    head.current.rotation.y = pose.current.x * 0.24;
    head.current.rotation.x = -pose.current.y * 0.14;
    head.current.rotation.z = -pose.current.x * 0.035;
    eyes.current.position.x = pose.current.x * 0.055;
    eyes.current.position.y = pose.current.y * 0.035;
    const elapsed = performance.now() - blink.current;
    const blinking =
      !reduced.current &&
      document.documentElement.dataset.realmMotion !== "off" &&
      blink.current >= 0 &&
      elapsed < 190;
    eyes.current.scale.y = blinking
      ? 1 - Math.sin((elapsed / 190) * Math.PI) * 0.94
      : 1;
    // No continuous render loop once the gaze settles, or while offscreen.
    if (
      blinking ||
      Math.abs(pose.current.x - x) + Math.abs(pose.current.y - y) > 0.001
    )
      invalidate();
    if (import.meta.env.DEV)
      gl.domElement.dataset[target ? "reviewGaze" : "gaze"] = `${pose.current.x.toFixed(3)},${pose.current.y.toFixed(3)}`;
  });
}
