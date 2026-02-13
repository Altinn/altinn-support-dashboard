import { describe, expect, it } from "vitest";
import { ErRoleTableItem, PersonalContactAltinn3 } from "../../../src/models/models";
import { filterContacts, sortContacts, sortERRoles } from "../../../src/components/Dashboard/utils/contactUtils";




describe('contactUtils', () => {

    describe('filterContacts', () => {
        const mockContacts: PersonalContactAltinn3[] = [
            { name: 'Test test', nationalIdentityNumber: '12345678901', phone: '12345678', email: 'test@test.com' },
            { name: 'Ola Nordmann', nationalIdentityNumber: '98765432109', phone: '87654321', email: 'olanordmann@test2.com' },
            { name: 'Kari Nord', nationalIdentityNumber: '11111111111', phone: '11223344', email: 'karinord@test3.com' }
        ];

        it('should return all contacts when search query is less than 3 characters', () => {
            const result = filterContacts(mockContacts, 'Te');
            expect(result).toEqual(mockContacts);
        });

        it('should filter by name', () => {
            const result = filterContacts(mockContacts, 'Ola');
            expect(result).toEqual([mockContacts[1]]);
        });

        it('should filter by national identity number', () => {
            const result = filterContacts(mockContacts, '1111');
            expect(result).toEqual([mockContacts[2]]);
        });

        it('should filter by phone', () => {
            const result = filterContacts(mockContacts, '1234');
            expect(result).toEqual([mockContacts[0]]);
        });

        it('should filter by email', () => {
            const result = filterContacts(mockContacts, 'test2');
            expect(result).toEqual([mockContacts[1]]);
        });

        it('should be case insensitive for name and email', () => {
            const result = filterContacts(mockContacts, 'kari');
            expect(result).toEqual([mockContacts[2]]);
        });

        it('should return empty array when there is no matches', () => {
            const result = filterContacts(mockContacts, 'Nonexistent');
            expect(result).toEqual([]);
        });

        it('should handle contacts with null fields', () => {
            const contactsWithNulls: PersonalContactAltinn3[] = [
                { name: "", nationalIdentityNumber: "", phone: "", email: "" },
                { name: 'Valid Name', nationalIdentityNumber: '22222222222', phone: '22334455', email: 'valid@test.com' }
            ];
            const result = filterContacts(contactsWithNulls, 'Valid');
            expect(result).toEqual([contactsWithNulls[1]]);
        });
    });

    describe('sortContacts', () => {
        const mockContacts: PersonalContactAltinn3[] = [
            { name: 'Test test', nationalIdentityNumber: '12345678901', phone: '12345678', email: 'test@test.com' },
            { name: 'Ola Nordmann', nationalIdentityNumber: '98765432109', phone: '87654321', email: 'olanordmann@test2.com' },
            { name: 'Kari Nord', nationalIdentityNumber: '11111111111', phone: '11223344', email: 'karinord@test3.com' }
        ];

        it('should return unsorted contacts when sortField is null', () => {
            const result = sortContacts(mockContacts, null, "ascending");
            expect(result).toEqual(mockContacts);
        });

        it('should sort by name in ascending order', () => {
            const result = sortContacts(mockContacts, 'name', "ascending");
            expect(result[0].name).toBe('Kari Nord');
            expect(result[1].name).toBe('Ola Nordmann');
            expect(result[2].name).toBe('Test test');
        });

        it('should sort by name in descending order', () => {
            const result = sortContacts(mockContacts, 'name', "descending");
            expect(result[0].name).toBe('Test test');
            expect(result[1].name).toBe('Ola Nordmann');
            expect(result[2].name).toBe('Kari Nord');
        });

        it('should sort phone number in ascending order', () => {
            const result = sortContacts(mockContacts, 'phone', "ascending");
            expect(result[0].phone).toBe('11223344');
            expect(result[1].phone).toBe('12345678');
            expect(result[2].phone).toBe('87654321');
        });

        it('should sort phone number in descending order', () => {
            const result = sortContacts(mockContacts, 'phone', "descending");
            expect(result[0].phone).toBe('87654321');
            expect(result[1].phone).toBe('12345678');
            expect(result[2].phone).toBe('11223344');
        });
        
        it('should handle contacts with empty fields', () => {
            const contactsWithNulls: PersonalContactAltinn3[] = [
                { name: "", nationalIdentityNumber: "", phone: "", email: "" },
                { name: 'Valid Name', nationalIdentityNumber: '22222222222', phone: '22334455', email: 'valid@test.com' }
            ];
            const result = sortContacts(contactsWithNulls, 'name', "ascending");
            expect(result).toEqual([contactsWithNulls[0], contactsWithNulls[1]]);
        });
    });

    describe('sortERRoles', () => {
        const mockRoles: ErRoleTableItem[] = [
            { type: { beskrivelse: 'Daglig leder', kode: 'DL' }, person: { navn: { fornavn: 'Ola', mellomnavn: '', etternavn: 'Nordmann' }, erDoed: false }, sistEndret: '2025-12-31', fratraadt: false, groupType: { beskrivelse: 'Type1', kode: 'T1' } },
            { type: { beskrivelse: 'Styremedlem', kode: 'SM' }, person: { navn: { fornavn: 'Kari', mellomnavn: '', etternavn: 'Nord' }, erDoed: false }, sistEndret: '2026-12-31', fratraadt: false, groupType: { beskrivelse: 'Type2', kode: 'T2' } },
        ];

        it('should return unsorted roles when sortField is null', () => {
            const result = sortERRoles(mockRoles, null, "ascending");
            expect(result).toEqual(mockRoles);
        });

        it('should sort by type in ascending order', () => {
            const result = sortERRoles(mockRoles, 'type', "ascending");
            expect(result[0].type.beskrivelse).toBe('Daglig leder');
            expect(result[1].type.beskrivelse).toBe('Styremedlem');
        });

        it('should sort by type in descending order', () => {
            const result = sortERRoles(mockRoles, 'type', "descending");
            expect(result[0].type.beskrivelse).toBe('Styremedlem');
            expect(result[1].type.beskrivelse).toBe('Daglig leder');
        });

        it('should sort by person name in ascending order', () => {
            const result = sortERRoles(mockRoles, 'person', "ascending");
            expect(result[0].person?.navn?.fornavn).toBe('Kari');
            expect(result[1].person?.navn?.fornavn).toBe('Ola');
        });

        it('should sort by person name in descending order', () => {
            const result = sortERRoles(mockRoles, 'person', "descending");
            expect(result[0].person?.navn?.fornavn).toBe('Ola');
            expect(result[1].person?.navn?.fornavn).toBe('Kari');
        });

        it('should sort by sistEndret in ascending order', () => {
            const result = sortERRoles(mockRoles, 'sistEndret', "ascending");
            expect(result[0].sistEndret).toBe('2025-12-31');
            expect(result[1].sistEndret).toBe('2026-12-31');
        });

        it('should sort by sistEndret in descending order', () => {
            const result = sortERRoles(mockRoles, 'sistEndret', "descending");
            expect(result[0].sistEndret).toBe('2026-12-31');
            expect(result[1].sistEndret).toBe('2025-12-31');
        });

        it('should handle roles with missing fields', () => {
            const rolesWithMissingFields: ErRoleTableItem[] = [
                { type: { beskrivelse: '', kode: '' }, person: { navn: { fornavn: '', mellomnavn: '', etternavn: '' }, erDoed: false }, sistEndret: '', fratraadt: false, groupType: { beskrivelse: '', kode: '' } },
                { type: { beskrivelse: 'Valid Type', kode: 'VT' }, person: { navn: { fornavn: 'Valid', mellomnavn: '', etternavn: 'Person' }, erDoed: false }, sistEndret: '2026-01-01', fratraadt: false, groupType: { beskrivelse: 'Type3', kode: 'T3' } }
            ];
            const result = sortERRoles(rolesWithMissingFields, 'type', "ascending");
            expect(result).toEqual([rolesWithMissingFields[0], rolesWithMissingFields[1]]);
        });
    })
})