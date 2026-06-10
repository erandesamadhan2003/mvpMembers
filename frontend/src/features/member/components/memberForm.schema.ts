import { z } from 'zod'

const optionalString = z.string().max(200).optional().nullable()

export const memberFormSchema = z.object({
  nameTitleID: z.number().int().positive().optional().nullable(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: optionalString,
  middleName: optionalString,
  nameInNativeLanguage: optionalString,
  phoneNo: optionalString,
  mobileNo: optionalString,
  eMail: z.string().max(200).optional().nullable().refine(
    (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    { message: 'Invalid email address' },
  ),
  memberSectionID: z.coerce.number().int().positive().optional().nullable(),
  organizationMemberSubTownID: z.coerce.number().int().positive().optional().nullable(),

  // Permanent Address
  town: optionalString,
  city: optionalString,
  taluka: optionalString,
  district: optionalString,
  states: optionalString,
  pinCode: optionalString,

  // Present Address
  pTown: optionalString,
  pCity: optionalString,
  pTaluka: optionalString,
  pDistrict: optionalString,
  pPinCode: optionalString,

  // Marathi Permanent Address
  mTown: optionalString,
  mCity: optionalString,
  mTaluka: optionalString,
  mDistrict: optionalString,
  mStates: optionalString,
  mPinCode: optionalString,

  // Marathi Present Address
  mPTown: optionalString,
  mPCity: optionalString,
  mPTaluka: optionalString,
  mPDistrict: optionalString,
  mPPinCode: optionalString,

  gender: optionalString,
  dob: optionalString,
  qualification: optionalString,
  nominee: optionalString,
  adharID: optionalString,
  panNo: optionalString,
  regNo: optionalString,
  applicationNo: z.coerce.number().int().positive().optional().nullable(),
  prvShareHolder: optionalString,
  objection: optionalString,
  memberNo: optionalString,
  registrationDate: optionalString,

  // Edit-only death fields
  death: z.boolean().optional(),
  deathDate: optionalString,
  deathRef: optionalString,
})

export type MemberFormValues = z.infer<typeof memberFormSchema>