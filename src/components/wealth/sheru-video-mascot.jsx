import React, { useRef, useEffect, useState } from "react";

/**
 * SheruVideoMascot
 * Renders the Sheru mascot video using real-time HTML5 Canvas keying to remove
 * the baked-in checkerboard background, delivering authentic alpha transparency
 * that blends seamlessly into the page background.
 */
export function SheruVideoMascot({
  src,
  poster,
  alt = "Sheru — AI Relationship Manager",
  className = "",
  onClick,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId;
    let isMounted = true;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const handleReady = () => {
      if (!isMounted) return;
      const w = video.videoWidth || 512;
      const h = video.videoHeight || 512;
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        setIsReady(true);
      }
    };

    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("canplay", handleReady);
    video.addEventListener("playing", handleReady);

    if (video.readyState >= 1) {
      handleReady();
    }

    // Checkerboard detector: very low color saturation (< 26) and bright (> 165)
    const isCheckerboard = (data, p) => {
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;
      const bri = (r + g + b) / 3;
      return sat < 26 && bri > 165;
    };

    const renderLoop = () => {
      if (!isMounted) return;

      if (video.readyState >= 2 && !video.paused && !video.ended) {
        const w = canvas.width;
        const h = canvas.height;

        if (w > 0 && h > 0) {
          ctx.drawImage(video, 0, 0, w, h);
          const frame = ctx.getImageData(0, 0, w, h);
          const data = frame.data;
          const totalPixels = w * h;

          // BFS Flood-Fill starting from outer borders to detect & clear background
          const visited = new Uint8Array(totalPixels);
          const queue = new Int32Array(totalPixels);
          let head = 0;
          let tail = 0;

          // Seed 1: Top row
          for (let x = 0; x < w; x++) {
            if (isCheckerboard(data, x * 4)) {
              visited[x] = 1;
              queue[tail++] = x;
            }
          }

          // Seed 2: Left and right edges
          for (let y = 1; y < h; y++) {
            const leftIdx = y * w;
            if (!visited[leftIdx] && isCheckerboard(data, leftIdx * 4)) {
              visited[leftIdx] = 1;
              queue[tail++] = leftIdx;
            }
            const rightIdx = y * w + (w - 1);
            if (!visited[rightIdx] && isCheckerboard(data, rightIdx * 4)) {
              visited[rightIdx] = 1;
              queue[tail++] = rightIdx;
            }
          }

          // Seed 3: Bottom corners (left 25% and right 25% of bottom edge)
          const cornerW = Math.floor(w * 0.25);
          for (let x = 0; x < cornerW; x++) {
            const bLeft = (h - 1) * w + x;
            if (!visited[bLeft] && isCheckerboard(data, bLeft * 4)) {
              visited[bLeft] = 1;
              queue[tail++] = bLeft;
            }
            const bRight = (h - 1) * w + (w - 1 - x);
            if (!visited[bRight] && isCheckerboard(data, bRight * 4)) {
              visited[bRight] = 1;
              queue[tail++] = bRight;
            }
          }

          // Expand flood-fill across all connected checkerboard pixels
          while (head < tail) {
            const curr = queue[head++];
            const cx = curr % w;
            const cy = (curr / w) | 0;

            // Clear alpha to 0 (make 100% transparent)
            data[curr * 4 + 3] = 0;

            // 4-way neighbors
            if (cy > 0) {
              const up = curr - w;
              if (!visited[up] && isCheckerboard(data, up * 4)) {
                visited[up] = 1;
                queue[tail++] = up;
              }
            }
            if (cy < h - 1) {
              const down = curr + w;
              if (!visited[down] && isCheckerboard(data, down * 4)) {
                visited[down] = 1;
                queue[tail++] = down;
              }
            }
            if (cx > 0) {
              const left = curr - 1;
              if (!visited[left] && isCheckerboard(data, left * 4)) {
                visited[left] = 1;
                queue[tail++] = left;
              }
            }
            if (cx < w - 1) {
              const right = curr + 1;
              if (!visited[right] && isCheckerboard(data, right * 4)) {
                visited[right] = 1;
                queue[tail++] = right;
              }
            }
          }

          // Edge anti-aliasing / feathering to eliminate halo
          const featherLimit = Math.min(tail, totalPixels);
          for (let i = 0; i < featherLimit; i++) {
            const idx = queue[i];
            const cx = idx % w;
            const cy = (idx / w) | 0;
            const neighbors = [
              cy > 0 ? idx - w : -1,
              cy < h - 1 ? idx + w : -1,
              cx > 0 ? idx - 1 : -1,
              cx < w - 1 ? idx + 1 : -1,
            ];
            for (let j = 0; j < 4; j++) {
              const n = neighbors[j];
              if (n !== -1 && visited[n] === 0) {
                const np = n * 4;
                const r = data[np];
                const g = data[np + 1];
                const b = data[np + 2];
                const sat = Math.max(r, g, b) - Math.min(r, g, b);
                const bri = (r + g + b) / 3;
                if (sat < 36 && bri > 155) {
                  data[np + 3] = Math.round(data[np + 3] * 0.35);
                }
              }
            }
          }

          ctx.putImageData(frame, 0, 0);
        }
      }

      if ("requestVideoFrameCallback" in video) {
        animId = video.requestVideoFrameCallback(renderLoop);
      } else {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    video.play().catch(() => {});

    if ("requestVideoFrameCallback" in video) {
      animId = video.requestVideoFrameCallback(renderLoop);
    } else {
      animId = requestAnimationFrame(renderLoop);
    }

    return () => {
      isMounted = false;
      if (animId) {
        if ("cancelVideoFrameCallback" in video) {
          video.cancelVideoFrameCallback(animId);
        } else {
          cancelAnimationFrame(animId);
        }
      }
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("playing", handleReady);
    };
  }, [src]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      {/* Hidden source video for frame extraction (off-screen so decoding stays active) */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute -z-50 h-px w-px opacity-0"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
        <source src={`/public${src}`} type="video/mp4" />
      </video>

      {/* Ambient soft glow behind Sheru */}
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-gradient-to-tr from-amber-500/15 via-orange-400/10 to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* Floor contact shadow */}
      <div
        className="pointer-events-none absolute bottom-4 left-1/2 -z-10 h-7 w-3/4 -translate-x-1/2 rounded-full bg-black/15 blur-xl"
        aria-hidden="true"
      />

      {/* Real-time keyed transparent canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 h-full w-auto max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] drop-shadow-[0_4px_12px_rgba(245,158,11,0.12)]"
        style={{
          display: isReady ? "block" : "none",
        }}
      />

      {/* Loading poster until video canvas is ready */}
      {!isReady && poster && (
        <img
          src={poster}
          alt={alt}
          className="relative z-10 h-full w-auto max-w-full object-contain drop-shadow-xl"
        />
      )}
    </div>
  );
}