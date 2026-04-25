import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posParams = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    document.body.classList.add('hide-cursor-global');
    
    const handleMouseMove = (e: MouseEvent) => {
      posParams.current.mx = e.clientX;
      posParams.current.my = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animateCursor = () => {
      const { mx, my, rx, ry } = posParams.current;
      posParams.current.rx += (mx - rx) * 0.15;
      posParams.current.ry += (my - ry) * 0.15;
      
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.transform = `translate(${mx}px, ${my}px)`;
        ringRef.current.style.transform = `translate(${posParams.current.rx - 20}px, ${posParams.current.ry - 20}px)`;
      }
      animationFrameId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const handleMouseDown = () => {
      if (cursorRef.current) cursorRef.current.style.transform += ' scale(0.7)';
      if (ringRef.current) ringRef.current.style.transform += ' scale(0.8)';
    };
    const handleMouseUp = () => {
      if (cursorRef.current) cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(0.7)', '');
      if (ringRef.current) ringRef.current.style.transform = ringRef.current.style.transform.replace(' scale(0.8)', '');
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.classList.remove('hide-cursor-global');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLinkHover = (enter: boolean) => {
    if (ringRef.current) {
      if (enter) {
        ringRef.current.style.width = '50px';
        ringRef.current.style.height = '50px';
        ringRef.current.style.borderColor = 'var(--gold)';
      } else {
        ringRef.current.style.width = '36px';
        ringRef.current.style.height = '36px';
        ringRef.current.style.borderColor = 'var(--rose)';
      }
    }
  };

  const setCursorVisibility = (visible: boolean) => {
    if (visible) {
      document.body.classList.add('hide-cursor-global');
      if (cursorRef.current) cursorRef.current.style.display = 'block';
      if (ringRef.current) ringRef.current.style.display = 'block';
    } else {
      document.body.classList.remove('hide-cursor-global');
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
    }
  };

  return { cursorRef, ringRef, handleLinkHover, setCursorVisibility };
}
