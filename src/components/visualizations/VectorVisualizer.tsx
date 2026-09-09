"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface VecDef {
  x: number;
  y: number;
  color: string;
  label: string;
}

interface VectorVisualizerProps {
  vectors?: VecDef[];
  showDotProduct?: boolean;
}

const DEFAULT_VECTORS: VecDef[] = [
  { x: 3, y: 1, color: "#10b981", label: "u" },
  { x: 1, y: 2, color: "#f59e0b", label: "v" },
];

export function VectorVisualizer({
  vectors: initial = DEFAULT_VECTORS,
  showDotProduct = true,
}: VectorVisualizerProps) {
  const [vecs, setVecs] = useState<VecDef[]>(initial);
  const W = 280, H = 280;
  const PAD = 28;
  const SCALE = 30; // pixels per unit

  function toPx(x: number, y: number) {
    return [W / 2 + x * SCALE, H / 2 - y * SCALE];
  }

  const dot = vecs.length >= 2 ? vecs[0].x * vecs[1].x + vecs[0].y * vecs[1].y : 0;
  const n1 = Math.hypot(vecs[0]?.x || 0, vecs[0]?.y || 0);
  const n2 = Math.hypot(vecs[1]?.x || 0, vecs[1]?.y || 0);
  const cosTheta = n1 && n2 ? dot / (n1 * n2) : 0;
  const angle = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180 / Math.PI;

  return (
    <Card className="border-border bg-card/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="mono-chip">Vectores en el plano 2D</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <svg width={W} height={H} className="rounded-md border border-border bg-background">
          {/* grid */}
          {Array.from({ length: Math.floor(W / SCALE) + 1 }).map((_, i) => {
            const x = i * SCALE;
            return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={H} stroke="currentColor" strokeWidth={0.4} opacity={0.15} />;
          })}
          {Array.from({ length: Math.floor(H / SCALE) + 1 }).map((_, i) => {
            const y = i * SCALE;
            return <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} stroke="currentColor" strokeWidth={0.4} opacity={0.15} />;
          })}
          {/* axes */}
          <line x1={W/2} y1={0} x2={W/2} y2={H} stroke="currentColor" strokeWidth={1} opacity={0.4} />
          <line x1={0} y1={H/2} x2={W} y2={H/2} stroke="currentColor" strokeWidth={1} opacity={0.4} />
          {/* arrows */}
          {vecs.map((v, i) => {
            const [x2, y2] = toPx(v.x, v.y);
            return (
              <g key={i}>
                <line x1={W/2} y1={H/2} x2={x2} y2={y2} stroke={v.color} strokeWidth={2.5} />
                <polygon
                  points={`${x2},${y2} ${x2 - 6},${y2 + 4} ${x2 - 6},${y2 - 4}`}
                  fill={v.color}
                  transform={`rotate(${Math.atan2(-v.y, v.x) * 180 / Math.PI}, ${x2}, ${y2})`}
                />
                <text x={x2 + 6} y={y2 - 4} fontSize={12} fill={v.color} fontWeight={600}>
                  {v.label} ({v.x}, {v.y})
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex-1 space-y-3">
          {vecs.map((v, i) => (
            <div key={i} className="space-y-1.5">
              <Label className="text-xs" style={{ color: v.color }}>
                Vector {v.label} — magnitud {Math.hypot(v.x, v.y).toFixed(2)}
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-6">x</span>
                <Slider
                  value={[v.x]}
                  min={-5}
                  max={5}
                  step={0.5}
                  onValueChange={(val) => {
                    setVecs((prev) => prev.map((p, idx) => (idx === i ? { ...p, x: val[0] } : p)));
                  }}
                />
                <span className="text-xs font-mono w-8 text-right">{v.x.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-6">y</span>
                <Slider
                  value={[v.y]}
                  min={-5}
                  max={5}
                  step={0.5}
                  onValueChange={(val) => {
                    setVecs((prev) => prev.map((p, idx) => (idx === i ? { ...p, y: val[0] } : p)));
                  }}
                />
                <span className="text-xs font-mono w-8 text-right">{v.y.toFixed(1)}</span>
              </div>
            </div>
          ))}

          {showDotProduct && vecs.length >= 2 && (
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs space-y-1">
              <div>Producto punto <span className="mono-chip">u · v</span> = <span className="font-mono font-semibold">{dot.toFixed(2)}</span></div>
              <div>||u|| = {n1.toFixed(2)}, ||v|| = {n2.toFixed(2)}</div>
              <div>cos(θ) = {cosTheta.toFixed(3)} → θ = <span className="font-mono font-semibold">{angle.toFixed(1)}°</span></div>
              {Math.abs(dot) < 0.01 && <div className="text-chart-5">→ Vectores ortogonales (perpendiculares)</div>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
