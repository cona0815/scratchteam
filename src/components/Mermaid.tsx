import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    fontFamily: '"Inter", "Noto Sans TC", sans-serif',
    primaryColor: '#e0e7ff',
    primaryTextColor: '#1e1b4b',
    primaryBorderColor: '#818cf8',
    lineColor: '#94a3b8',
    secondaryColor: '#fef3c7',
    tertiaryColor: '#fee2e2'
  },
  securityLevel: 'loose',
});

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (ref.current && chart) {
        try {
          ref.current.innerHTML = '';
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid render error:', error);
        }
      }
    };
    renderChart();
  }, [chart]);

  return <div ref={ref} className="flex justify-center transition-all bg-transparent w-full" />;
}
