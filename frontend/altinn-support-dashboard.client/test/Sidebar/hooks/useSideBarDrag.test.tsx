import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSidebarDrag } from "../../../src/components/Sidebar/hooks/useSidebarDrag";


describe('useSideBarDrag', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize with isCollapsed as false', () => {
        const { result } = renderHook(() => useSidebarDrag());

        expect(result.current.isCollapsed).toBe(false);
    });

    it('should toggle collapse state', () => {
        const { result } = renderHook(() => useSidebarDrag());
        expect(result.current.isCollapsed).toBe(false);

        act(() => {
            result.current.toggleCollapse();
        });
        expect(result.current.isCollapsed).toBe(true);

        act(() => {
            result.current.toggleCollapse();
        });
        expect(result.current.isCollapsed).toBe(false);
    });

    it('should start dragging on handleDragStart', () => {
        const { result } = renderHook(() => useSidebarDrag());
        const mockEvent = {
            preventDefault: vi.fn(),
            clientX: 100
        } as unknown as React.MouseEvent;

        act(() => {
            result.current.handleDragStart(mockEvent);
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should collapse sidebar when dragged left beyond threshold', () => {
        const { result } = renderHook(() => useSidebarDrag());
        const mockStartEvent = {
            preventDefault: vi.fn(),
            clientX: 200
        } as unknown as React.MouseEvent;
        act(() => {
            result.current.handleDragStart(mockStartEvent);
        });

        const mockMoveEvent = new MouseEvent('mousemove', { clientX: 140 });

        act(() => {
            window.dispatchEvent(mockMoveEvent);
        });

        expect(result.current.isCollapsed).toBe(true);
    });

    it('should expand sidebar when dragged right beyond threshold', () => {
        const { result } = renderHook(() => useSidebarDrag());

        act(() => {
            result.current.toggleCollapse();
        });
        expect(result.current.isCollapsed).toBe(true);
        
        const mockStartEvent = {
            preventDefault: vi.fn(),
            clientX: 100
        } as unknown as React.MouseEvent;

        act(() => {
            result.current.handleDragStart(mockStartEvent);
        });

        const mockMoveEvent = new MouseEvent('mousemove', { clientX: 170 });

        act(() => {
            window.dispatchEvent(mockMoveEvent);
        });

        expect(result.current.isCollapsed).toBe(false);
    });

    it('should not change state when drag distance is within threshold', () => {
        const { result } = renderHook(() => useSidebarDrag());
        const mockStartEvent = {
            preventDefault: vi.fn(),
            clientX: 100
        } as unknown as React.MouseEvent;

        act(() => {
            result.current.handleDragStart(mockStartEvent);
        });
        const mockMoveEvent = new MouseEvent('mousemove', { clientX: 130 });

        act(() => {
            window.dispatchEvent(mockMoveEvent);
        });
        expect(result.current.isCollapsed).toBe(false);
    });

    it('should stop dragging on mouseup', () => {
        const { result } = renderHook(() => useSidebarDrag());
        const mockStartEvent = {
            preventDefault: vi.fn(),
            clientX: 100
        } as unknown as React.MouseEvent;

        act(() => {
            result.current.handleDragStart(mockStartEvent);
        });

        const mouseUpEvent = new MouseEvent('mouseup');

        act(() => {
            window.dispatchEvent(mouseUpEvent);
        });

        const mockMoveEvent = new MouseEvent('mousemove', { clientX: 50 });

        act(() => {
            window.dispatchEvent(mockMoveEvent);
        });

        expect(result.current.isCollapsed).toBe(false);
    });

    it('should clean up event listeners on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
        const {  unmount } = renderHook(() => useSidebarDrag());

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));
    });

});