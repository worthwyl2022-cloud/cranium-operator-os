// ScreenshotService: Generates high-fidelity visual episodic snapshot canvases
export class ScreenshotService {
  static capture(
    title: string,
    episodeNum: number,
    excerpt: string,
    tone: string,
    pacing: string,
    novelTitle: string = 'WORTHWYL SERIAL'
  ): string {
    if (typeof window === 'undefined') return '';

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      // High contrast deep obsidian gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 640);
      bgGrad.addColorStop(0, '#111216');
      bgGrad.addColorStop(0.5, '#0b0c0f');
      bgGrad.addColorStop(1, '#060709');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 480, 640);

      // Fine border frame with technical ticks
      ctx.strokeStyle = '#262930';
      ctx.lineWidth = 1;
      ctx.strokeRect(18, 18, 444, 604);

      // Top corner brackets
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(18, 38); ctx.lineTo(18, 18); ctx.lineTo(38, 18);
      ctx.moveTo(462, 38); ctx.lineTo(462, 18); ctx.lineTo(442, 18);
      ctx.moveTo(18, 602); ctx.lineTo(18, 622); ctx.lineTo(38, 622);
      ctx.moveTo(462, 602); ctx.lineTo(462, 622); ctx.lineTo(442, 622);
      ctx.stroke();

      // Header stamp
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`WORTHWYL OS // EPISODE ${episodeNum.toString().padStart(2, '0')}`, 34, 46);

      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.fillText(`${novelTitle.toUpperCase()}`, 34, 60);

      // Diagnostic Pills
      // Tone
      ctx.fillStyle = '#1e2129';
      ctx.fillRect(34, 76, 116, 24);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`TONE: ${tone.toUpperCase()}`, 44, 92);

      // Pacing
      ctx.fillStyle = '#1e2129';
      ctx.fillRect(160, 76, 116, 24);
      ctx.fillStyle = pacing === 'fast' ? '#f87171' : pacing === 'medium' ? '#fbbf24' : '#34d399';
      ctx.fillText(`PACING: ${pacing.toUpperCase()}`, 170, 92);

      // Episode Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px serif';
      // Truncate if long
      const displayTitle = title.length > 32 ? title.slice(0, 30) + '...' : title;
      ctx.fillText(displayTitle, 34, 136);

      // Thin accent divider
      ctx.fillStyle = '#334155';
      ctx.fillRect(34, 150, 412, 1);

      // Body text wrapped
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px serif';
      const cleanExcerpt = excerpt.replace(/\n+/g, ' ');
      const words = cleanExcerpt.split(' ');
      let line = '';
      let y = 180;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 400 && i > 0) {
          ctx.fillText(line, 34, y);
          line = words[i] + ' ';
          y += 22;
          if (y > 550) break;
        } else {
          line = testLine;
        }
      }
      if (y <= 550) {
        ctx.fillText(line, 34, y);
      }

      // Canonical seal watermark
      ctx.fillStyle = '#334155';
      ctx.fillRect(34, 574, 412, 1);

      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.fillText("CRANIUM CORE // VISUAL-TEXT HYBRID COHERENCE ENGINE", 34, 594);
      ctx.fillText(`CANON SEAL VERIFIED // ZERO DRIFT LATTICE`, 34, 608);

      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error('ScreenshotService capture error:', e);
      return '';
    }
  }
}
