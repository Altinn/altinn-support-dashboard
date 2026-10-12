import orgCodes from "../assets/org-codes.json";

type AltinnOrg = {
    name: {nb: string};
};

const orgs = orgCodes.orgs as Record<string, AltinnOrg>;

export const getOrgName = (orgCode?: string): string => {
    if (!orgCode) return "";
    return orgs[orgCode.toLowerCase()]?.name.nb ?? orgCode;
}