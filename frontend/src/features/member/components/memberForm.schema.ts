import { z } from 'zod'

const optionalString = z.string().max(200).optional().nullable()

export const memberFormSchema = z.object({
  nameTitleID: z.number().int().positive().optional().nullable(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: optionalString,
  middleName: optionalString,
  nameInNativeLanguage: optionalString,
  phoneNo: optionalString,
  eMail: z
    .string()
    .max(200)
    .optional()
    .nullable()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: 'Invalid email address',
    }),
  memberSectionID: z.coerce.number().int().positive().optional().nullable(),
  organizationMemberCenterID: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),
  city: optionalString,
  taluka: optionalString,
  district: optionalString,
  states: optionalString,
  pinCode: optionalString,
  pCity: optionalString,
  pTaluka: optionalString,
  pDistrict: optionalString,
  pPinCode: optionalString,
  gender: optionalString,
  dob: optionalString,
  qualification: optionalString,
  nominee: optionalString,
  adharID: optionalString,
  panNo: optionalString,
  memberNo: optionalString,
  registrationDate: optionalString,
})

export type MemberFormValues = z.infer<typeof memberFormSchema>
