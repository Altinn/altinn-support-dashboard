import { vi } from "vitest";





vi.mock('../../../../src/hooks/hooks', () => ({
    useOrgDetails: vi.fn(),
}));