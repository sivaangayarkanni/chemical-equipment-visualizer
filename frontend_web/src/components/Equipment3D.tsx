import React, { useRef, useEffect } from 'react';
import { Equipment } from '../types';

interface Equipment3DProps {
  equipment: Equipment[];
}

const Equipment3D: React.FC<Equipment3DProps> = ({ equipment }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawEquipment = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw equipment as 3D-like boxes
      equipment.forEach((item, index) => {
        const x = (index % 4) * 120 + 60;
        const y = Math.floor(index / 4) * 100 + 60;
        const size = Math.max(20, Math.min(60, item.flowrate / 5));
        
        // Equipment color based on temperature
        const tempRatio = Math.min(1, item.temperature / 200);
        const red = Math.floor(255 * tempRatio);
        const blue = Math.floor(255 * (1 - tempRatio));
        
        // Draw 3D effect
        ctx.fillStyle = `rgba(${red}, 100, ${blue}, 0.8)`;
        ctx.fillRect(x, y, size, size);
        
        // 3D shadow effect
        ctx.fillStyle = `rgba(${red}, 80, ${blue}, 0.6)`;
        ctx.fillRect(x + 5, y + 5, size, size);
        
        // Equipment label
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.name.substring(0, 8), x + size/2, y + size + 15);
        
        // Status indicator
        const statusColor = item.temperature > 150 ? '#ef4444' : '#10b981';
        ctx.fillStyle = statusColor;
        ctx.beginPath();
        ctx.arc(x + size - 5, y + 5, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    drawEquipment();
    
    // Animate on hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Redraw with hover effects
      drawEquipment();
      
      // Highlight hovered equipment
      equipment.forEach((item, index) => {
        const x = (index % 4) * 120 + 60;
        const y = Math.floor(index / 4) * 100 + 60;
        const size = Math.max(20, Math.min(60, item.flowrate / 5));
        
        if (mouseX >= x && mouseX <= x + size && mouseY >= y && mouseY <= y + size) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.strokeRect(x - 2, y - 2, size + 4, size + 4);
          
          // Show tooltip
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(mouseX + 10, mouseY - 40, 150, 35);
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(`${item.name}`, mouseX + 15, mouseY - 25);
          ctx.fillText(`T: ${item.temperature}°C P: ${item.pressure}bar`, mouseX + 15, mouseY - 10);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [equipment]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      color: 'white',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: '#60a5fa', marginBottom: '20px', margin: '0 0 20px 0' }}>🏭 Interactive Plant Layout</h3>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        style={{
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.2)',
          cursor: 'crosshair',
          width: '100%'
        }}
      />
      <div style={{ color: '#d1d5db', fontSize: '0.8rem', marginTop: '10px' }}>
        💡 Hover over equipment for details. Color indicates temperature (blue=cool, red=hot)
      </div>
    </div>
  );
};

export default Equipment3D;