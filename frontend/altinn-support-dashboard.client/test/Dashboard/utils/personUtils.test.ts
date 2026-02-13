import { describe, expect, it } from "vitest";
import { 
    formatFullName, 
    formatPersonStatus,
    formatRoleDescription,
    formatRolePersonInfo,
    formatRoleTypeInfo
} from "../../../src/components/Dashboard/utils/personUtils";
import { ERRoles } from "../../../src/models/models";




describe('formatFullName', () => {
    it('should format full name with all parts', () => {
        const person = { navn: { fornavn: 'Ola', mellomnavn: 'Nord', etternavn: 'Hansen' } };

        expect(formatFullName(person)).toBe('Ola Nord Hansen');
    });

    it('should format full name without middle name', () => {
        const person = { navn: { fornavn: 'Ola', etternavn: 'Hansen' } };

        expect(formatFullName(person)).toBe('Ola Hansen');
    });

    it('should format full name when middle name is null', () => {
        const person = { navn: { fornavn: 'Ola', mellomnavn: null, etternavn: 'Hansen' } };

        expect(formatFullName(person)).toBe('Ola Hansen');
    })

    it('should return empty string when name is undefined', () => {
        const person = {};
        expect(formatFullName(person)).toBe('');
    });
});

describe('formatPersonStatus', () => {
    it('should return " (Død)" if person is deceased', () => {
        const person = { erDoed: true };
        expect(formatPersonStatus(person)).toBe(' (Død)');
    });

    it('should return empty string if person is not deceased', () => {
        const person = { erDoed: false };
        expect(formatPersonStatus(person)).toBe('');
    });

    it('should return empty string if person is undefined', () => {
        expect(formatPersonStatus(undefined)).toBe('');
    });

    it('should return empty string if erDoed is undefined', () => {
        const person = {};
        expect(formatPersonStatus(person)).toBe('');
    });
});

describe('formatRolePersonInfo', () => {
    it('should format person info with name and status', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2026-01-01",
            roller: [{
                type: { kode: "DAGL", beskrivelse: "Daglig leder" },
                person: {
                    fodselsdato: "1980-01-01",
                    navn: { fornavn: "Ole", mellomnavn: null, etternavn: "Hansen" },
                erDoed: false
                },
                fratraadt: false
            }]
        };
        expect(formatRolePersonInfo(role)).toBe('Ole Hansen');
    });

    it('should append " (Død)" to name if person is deceased', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2026-01-01",
            roller: [{
                type: { kode: "DAGL", beskrivelse: "Daglig leder" },
                person: {
                    fodselsdato: "1980-01-01",
                    navn: { fornavn: "Ole", mellomnavn: null, etternavn: "Hansen" },
                    erDoed: true
                },
                fratraadt: false
            }]
        };
        expect(formatRolePersonInfo(role)).toBe('Ole Hansen (Død)');
    });

    it('should return empty string when role is undefined', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2026-01-01",
            roller: []
        };
        expect(formatRolePersonInfo(role)).toBe('');
    });

    it('should return empty string when person is undefined', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2026-01-01",
            roller: [{
                type: { kode: "DAGL", beskrivelse: "Daglig leder" },
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                person: undefined as any,
                fratraadt: false
            }]
        };
        expect(formatRolePersonInfo(role)).toBe('');
    });
});


describe('formatRoleTypeInfo', () => {
    it('should return role type description', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2026-01-01",
            roller: []
        };
        expect(formatRoleTypeInfo(role)).toBe('Daglig leder');
    });

    it('should return empty string when role type is undefined', () => {
        const role: ERRoles = {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: undefined as any,
            sistEndret: "2026-01-01",
            roller: []
        };
        expect(formatRoleTypeInfo(role)).toBe('');
    });

    it('should return empty string when role type description is missing', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "" },
            sistEndret: "2026-01-01",
            roller: []
        };
        expect(formatRoleTypeInfo(role)).toBe('');
    });
});


describe('formatRoleDescription', () => {
    it('should format complete role description', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2026-01-01",
            roller: [{
                type: { kode: "DAGL", beskrivelse: "Daglig leder" },
                person: {
                    fodselsdato: "1980-01-01",
                    navn: { fornavn: "Ole", mellomnavn: null, etternavn: "Hansen" },
                    erDoed: false
                },
                fratraadt: false
            }]
        };
        expect(formatRoleDescription(role)).toBe('Daglig leder: Ole Hansen');
    });

    it('should format role description with deceased person', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2026-01-01",
            roller: [{
                type: { kode: "DAGL", beskrivelse: "Daglig leder" },
                person: {
                    fodselsdato: "1980-01-01",
                    navn: { fornavn: "Ole", mellomnavn: null, etternavn: "Hansen" },
                    erDoed: true
                },
                fratraadt: false
            }]
        };
        expect(formatRoleDescription(role)).toBe('Daglig leder: Ole Hansen (Død)');
    });

    it('should handle missing person info', () => {
        const role: ERRoles = {
            type: { kode: "DAGL", beskrivelse: "Daglig leder" },
            sistEndret: "2026-01-01",
            roller: []
        };
        expect(formatRoleDescription(role)).toBe('Daglig leder:');
    });

    it('should handle missing type info', () => {
        const role: ERRoles = {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: undefined as any,
            sistEndret: "2026-01-01",
            roller: [{
                type: { kode: "DAGL", beskrivelse: "Daglig leder" },
                person: {
                    fodselsdato: "1980-01-01",
                    navn: { fornavn: "Ole", mellomnavn: null, etternavn: "Hansen" },
                    erDoed: false
                },
                fratraadt: false
            }]
        };
        expect(formatRoleDescription(role)).toBe(': Ole Hansen');
    });
})
