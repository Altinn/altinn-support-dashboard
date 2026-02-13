import { beforeEach, describe, expect, vi } from "vitest";
import { showPopup } from "../src/components/Popup";
import { toast } from "react-toastify";



vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    }
}));

describe('showPopup', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call toast.error when type is "error"', () => {
        showPopup('Test error message', 'error');

        expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it('should pass correct message to toast.error', () => {
        showPopup('Test error message', 'error');

        expect(toast.error).toHaveBeenCalledWith(
            'Test error message', 
            expect.any(Object));
    });

    it('should pass correct options to toast.error', () => {
        showPopup('Test error message', 'error');

        expect(toast.error).toHaveBeenCalledWith(expect.any(String), {
            position: "bottom-right",
            autoClose: 5000,
            className: expect.any(String),
        });
    });

    it('should return the result from toast.error', () => {
        const mockToastId = 'mock-toast-id';
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (toast.error as any).mockReturnValue(mockToastId);

        const result = showPopup('Test error message', 'error');

        expect(result).toBe(mockToastId);
    });

    it('should return undefined when type is not "error"', () => {
        const result = showPopup('Test message', 'info');

        expect(toast.error).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it('should return undefined when type is undefined', () => {
        const result = showPopup('Test message');

        expect(toast.error).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });
})