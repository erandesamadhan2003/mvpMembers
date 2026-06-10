export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    verifyOtp: '/api/auth/verify-otp',
  },
  memberSections: {
    base: '/api/member-sections',
    byId: (id: number) => `/api/member-sections/${id}`,
  },
  memberTowns: {
    base: '/api/organization-member-towns',
    byId: (id: number) => `/api/organization-member-towns/${id}`,
    byName: (townName: string) =>
      `/api/organization-member-towns/by-name/${encodeURIComponent(townName)}`,
  },
  memberCenters: {
    base: '/api/organization-member-centers',
    byId: (id: number) => `/api/organization-member-centers/${id}`,
    byTownId: (townId: number) =>
      `/api/organization-member-centers/by-town/${townId}`,
    byCenterId: (centerId: string) =>
      `/api/organization-member-centers/by-center-id/${encodeURIComponent(centerId)}`,
  },
  members: {
    base: '/api/organization-members',
    byId: (id: number) => `/api/organization-members/${id}`,
    byMemberNo: (memberNo: string) =>
      `/api/organization-members/by-member-no/${encodeURIComponent(memberNo)}`,
    bySection: (memberSectionId: number) =>
      `/api/organization-members/by-section/${memberSectionId}`,
    byCenter: (centerId: number) =>
      `/api/organization-members/by-center/${centerId}`,
  },
  documents: {
    base: '/api/organization-member-documents',
    byId: (id: number) => `/api/organization-member-documents/${id}`,
    byMemberId: (memberId: number) =>
      `/api/organization-member-documents/by-member/${memberId}`,
  },
  memberSubTowns: {
    base: '/api/organisation-member-sub-towns',
    byId: (id: number) => `/api/organisation-member-sub-towns/${id}`,
    byCenterId: (centerId: number) => `/api/organisation-member-sub-towns/by-center/${centerId}`,
    bySubTownId: (subTownId: string) => `/api/organisation-member-sub-towns/by-sub-town-id/${subTownId}`,
  },
} as const
