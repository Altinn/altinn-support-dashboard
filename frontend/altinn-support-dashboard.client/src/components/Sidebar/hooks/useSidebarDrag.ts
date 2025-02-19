// Sidebar/hooks/useSidebarDrag.ts
import { useState, useEffect, MouseEvent } from 'react';

export const useSidebarDrag = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleDragStart = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleDragMove = (e: MouseEvent | MouseEvent) => {
    if (!isDragging) return;
    const dragDistance = e.clientX - dragStartX;
    if (Math.abs(dragDistance) > 50) { // Threshold for triggering expand/collapse
      setIsCollapsed(dragDistance < 0);
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, dragStartX]);

  return { isCollapsed, toggleCollapse, handleDragStart };
};
