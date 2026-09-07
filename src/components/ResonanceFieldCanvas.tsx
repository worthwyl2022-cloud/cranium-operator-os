import React, { useEffect, useRef } from 'react';
import { CognitiveAtom, Metrics } from '../types/creativeOs';

interface Props {
  atoms: CognitiveAtom[];
  metrics: Metrics;
  selectedAtomId: string | null;
  onSelectAtom: (atom: CognitiveAtom) => void;
}

export default function ResonanceFieldCanvas({ atoms, metrics, selectedAtomId, onSelectAtom }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Responsive setup
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 600;
    const height = 320;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Center Baseline Axis
      const centerY = height / 2 - metrics.emotional_baseline * 40;
      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Baseline Label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(`BASELINE VALENCE: ${metrics.emotional_baseline > 0 ? '+' : ''}${metrics.emotional_baseline}`, 12, centerY - 6);

      // Node coordinates calculation
      const atomNodes = atoms.map((atom, idx) => {
        const total = Math.max(1, atoms.length);
        const spread = (width - 120) / total;
        const baseX = 60 + idx * spread;
        // Y based on valence charge (-1 to 1) + dynamic oscillation
        const amp = 8 * (atom.velocity || 0.5);
        const offsetY = Math.sin(time * 2 + idx) * amp;
        const posY = centerY - atom.charge * 75 + offsetY;
        const radius = Math.max(7, Math.min(22, 6 + (atom.mass || 2) * 1.8));

        return { atom, x: baseX, y: posY, radius };
      });

      // Draw Resonance vectors / Force lines between adjacent atoms
      for (let i = 0; i < atomNodes.length; i++) {
        for (let j = i + 1; j < atomNodes.length; j++) {
          const a = atomNodes[i];
          const b = atomNodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);

          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            // Dissonance if opposite charge, harmonic if same sign
            const isOpposite = a.atom.charge * b.atom.charge < 0;
            if (isOpposite) {
              ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0.1, 0.4 - dist / 500)})`; // Red dissonance
            } else {
              ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(0.1, 0.5 - dist / 400)})`; // Blue harmonic
            }
            ctx.lineWidth = Math.min(2, Math.max(0.5, (a.atom.mass + b.atom.mass) / 8));
            ctx.stroke();
          }
        }
      }

      // Draw Atom Nodes
      atomNodes.forEach(node => {
        const isSelected = selectedAtomId === node.atom.id;
        const isTheme = node.atom.kind === 'theme';

        // Outer glow
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
          ctx.fill();
        }

        // Atom Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // Fill based on charge and kind
        if (isTheme) {
          ctx.fillStyle = '#0f172a'; // Deep obsidian for canonical theme atoms
        } else if (node.atom.charge > 0.2) {
          ctx.fillStyle = '#2563eb'; // Royal Blue for positive valence
        } else if (node.atom.charge < -0.2) {
          ctx.fillStyle = '#dc2626'; // Crimson for tension/conflict
        } else {
          ctx.fillStyle = '#475569'; // Neutral slate
        }
        ctx.fill();

        // Border / ring
        ctx.lineWidth = isTheme ? 2.5 : 1.5;
        ctx.strokeStyle = isTheme ? '#f59e0b' : '#ffffff';
        ctx.stroke();

        // Text label inside or above
        ctx.fillStyle = '#1e293b';
        ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
        const labelText = node.atom.label || node.atom.id;
        const shortName = labelText.length > 14 ? labelText.slice(0, 12) + '…' : labelText;
        ctx.fillText(shortName, node.x - ctx.measureText(shortName).width / 2, node.y - node.radius - 6);

        // Kind indicator
        if (isTheme) {
          ctx.fillStyle = '#d97706';
          ctx.font = '700 8px ui-sans-serif, system-ui, sans-serif';
          const badge = 'CANON THEME';
          ctx.fillText(badge, node.x - ctx.measureText(badge).width / 2, node.y + node.radius + 12);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    // Canvas click handler for node selection
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const centerY = height / 2 - metrics.emotional_baseline * 40;

      const total = Math.max(1, atoms.length);
      const spread = (width - 120) / total;
      for (let idx = 0; idx < atoms.length; idx++) {
        const atom = atoms[idx];
        const baseX = 60 + idx * spread;
        const posY = centerY - atom.charge * 75;
        const radius = Math.max(12, 6 + (atom.mass || 2) * 1.8);
        if (Math.hypot(clickX - baseX, clickY - posY) <= radius + 10) {
          onSelectAtom(atom);
          return;
        }
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [atoms, metrics, selectedAtomId, onSelectAtom]);

  return (
    <div className="w-full bg-white rounded-xl border border-neutral-200 p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Resonance Field Simulation (Cranium Physical Substrate)
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Positive Valence
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" /> Tension/Crisis
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Canon Theme
          </span>
        </div>
      </div>
      <div className="relative w-full h-[320px]">
        <canvas ref={canvasRef} className="w-full h-full block cursor-pointer rounded-lg bg-neutral-50/50" />
      </div>
    </div>
  );
}
