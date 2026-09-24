import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Heart, RotateCcw } from "lucide-react";

const rosePetal = confetti.shapeFromPath({
  path: "M 0,-7 C 5,-5 8,-1 6,4 C 4,9 -3,9 -6,4 C -8,-1 -5,-5 0,-7 Z",
});

const glitterParticles = [
  [7, 24, 0.1],
  [14, 68, 1.4],
  [23, 38, 2.7],
  [31, 79, 0.8],
  [42, 19, 2.1],
  [49, 57, 3.2],
  [58, 31, 1.1],
  [66, 74, 2.4],
  [74, 15, 0.5],
  [82, 48, 1.8],
  [91, 27, 2.9],
  [96, 83, 1.3],
  [18, 91, 3.5],
  [37, 51, 1.7],
  [55, 88, 0.3],
  [87, 63, 3.8],
];

function showerRosePetals() {
  const colors = ["#b94e68", "#d47788", "#e8a0a8", "#f2c7bd", "#ad8d53"];
  const burst = (particleCount, spread, startVelocity, origin) =>
    confetti({
      particleCount,
      spread,
      startVelocity,
      gravity: 0.72,
      ticks: 460,
      scalar: 0.85,
      drift: (Math.random() - 0.5) * 0.8,
      origin,
      colors,
      shapes: [rosePetal],
      disableForReducedMotion: true,
    });

  burst(55, 55, 32, { x: 0.5, y: 0.62 });
  window.setTimeout(() => burst(45, 75, 25, { x: 0.25, y: 0.68 }), 180);
  window.setTimeout(() => burst(45, 75, 25, { x: 0.75, y: 0.68 }), 340);
  window.setTimeout(() => burst(35, 110, 20, { x: 0.5, y: 0.5 }), 520);
}

export default function ScratchCard({ onReveal }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const pointsRef = useRef(0);
  const lastPointRef = useRef(null);

  const getScratchedArea = (context, canvas) => {
    const sampleStep = 10;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentPixels = 0;
    let sampledPixels = 0;

    for (let y = 0; y < canvas.height; y += sampleStep) {
      for (let x = 0; x < canvas.width; x += sampleStep) {
        const alpha = pixels[(y * canvas.width + x) * 4 + 3];
        sampledPixels += 1;
        if (alpha < 32) transparentPixels += 1;
      }
    }

    return transparentPixels / sampledPixels;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#b6a77d";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(255, 244, 199, 0.25)";
    for (let index = 0; index < 180; index += 1) {
      context.beginPath();
      context.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 0.5,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }, []);

  const scratch = (event) => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const bounds = canvas.getBoundingClientRect();
    const point = "touches" in event ? event.touches[0] : event;
    const x = (point.clientX - bounds.left) * (canvas.width / bounds.width);
    const y = (point.clientY - bounds.top) * (canvas.height / bounds.height);
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "destination-out";
    const lastPoint = lastPointRef.current;
    lastPointRef.current = { x, y };
    context.beginPath();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 62;
    context.moveTo(lastPoint?.x ?? x, lastPoint?.y ?? y);
    context.lineTo(x, y);
    context.stroke();
    pointsRef.current += 1;

    const movedDistance = lastPoint
      ? Math.hypot(x - lastPoint.x, y - lastPoint.y)
      : 0;

    if (
      pointsRef.current >= 24 &&
      movedDistance > 0 &&
      getScratchedArea(context, canvas) >= 0.4
    ) {
      setRevealed(true);
      showerRosePetals();
      onReveal();
    }
  };

  const reset = () => {
    pointsRef.current = 0;
    lastPointRef.current = null;
    setRevealed(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#b6a77d";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(255, 244, 199, 0.25)";
    for (let index = 0; index < 180; index += 1) {
      context.beginPath();
      context.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 0.5,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  };

  return (
    <div className="scratch-card-wrap">
      <div className="date-card">
        <Heart className="date-card__heart" size={18} fill="currentColor" />
        <p className="eyebrow">A little something to remember</p>
        <p className="date-card__date">
          January 31<sup>st</sup>, 2027
        </p>
        <p>We cannot wait to celebrate with you.</p>
      </div>
      <div
        className={`scratch-glitter ${revealed ? "is-revealed" : ""}`}
        aria-hidden="true"
      >
        {glitterParticles.map(([left, top, delay]) => (
          <span
            className="scratch-glitter__particle"
            key={`${left}-${top}`}
            style={{
              "--particle-left": `${left}%`,
              "--particle-top": `${top}%`,
              "--particle-delay": `${delay}s`,
            }}
          />
        ))}
      </div>
      <div
        className={`scratch-copy ${isScratching || revealed ? "is-revealed" : ""}`}
        aria-hidden="true"
      >
        <span>SCRATCH TO REVEAL</span>
        <strong>the date</strong>
      </div>
      <canvas
        ref={canvasRef}
        className={`scratch-canvas ${isScratching ? "is-scratching" : ""} ${revealed ? "is-revealed" : ""}`}
        width="700"
        height="400"
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => {
          setIsScratching(false);
          lastPointRef.current = null;
        }}
        onMouseMove={(event) => isScratching && scratch(event)}
        onTouchMove={scratch}
        onTouchStart={() => setIsScratching(true)}
        onTouchEnd={() => {
          setIsScratching(false);
          lastPointRef.current = null;
        }}
        aria-label="Scratch the card to reveal the date"
      />
      {revealed && (
        <button className="reset-scratch" type="button" onClick={reset}>
          <RotateCcw size={14} /> Reset scratch
        </button>
      )}
    </div>
  );
}
