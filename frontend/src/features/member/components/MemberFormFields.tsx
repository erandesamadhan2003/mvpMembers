import { memo, useMemo } from 'react'
import { Controller, useWatch, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NAME_TITLES } from '@/features/member/constants/nameTitles.constants'
import type { MemberFormValues } from '@/features/member/components/memberForm.schema'
import { useMemberSectionsQuery } from '@/features/memberSection/hooks'
import { useMemberSubTownsQuery } from '@/features/memberSubTown/hooks'
import { MarathiInput } from '@/components/common/MarathiInput'

interface MemberFormFieldsProps {
  register: UseFormRegister<MemberFormValues>
  control: Control<MemberFormValues>
  errors: FieldErrors<MemberFormValues>
  disabled?: boolean
  memberNoReadOnly?: boolean
  readOnly?: boolean
  isEdit?: boolean
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base font-medium">
        {label}
      </Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

export const MemberFormFields = memo(function MemberFormFields({
  register,
  control,
  errors = {},
  disabled = false,
  memberNoReadOnly = false,
  readOnly = false,
  isEdit = false,
}: MemberFormFieldsProps) {
  const fieldClass = readOnly
    ? 'flex h-10 w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-base text-foreground cursor-default'
    : 'flex h-10 w-full rounded-md border border-input bg-card px-3 text-base'
  const inputClass = readOnly
    ? 'h-10 text-base md:text-base bg-muted/40 border-border cursor-default'
    : 'h-10 text-base md:text-base'

  const { data: sections = [] } = useMemberSectionsQuery()
  const { data: subTowns = [] } = useMemberSubTownsQuery()

  const sectionOptions = useMemo(
    () => sections.map((s) => ({ value: String(s.memberSectionID), label: s.memberSectionName })),
    [sections],
  )

  const subTownOptions = useMemo(
    () =>
      subTowns.map((st) => ({
        value: String(st.organisationMemberSubTownID),
        label: `${st.subTownName} (${st.organizationMemberCenter?.centerName ?? '—'})`,
        centerName: st.organizationMemberCenter?.centerName ?? '—',
        townName: st.organizationMemberCenter?.organizationMemberTown?.townName ?? '—',
      })),
    [subTowns],
  )

  // Watch English address fields to auto-feed Marathi inputs
  const [
    town, city, taluka, district, states,
    pTown, pCity, pTaluka, pDistrict,
  ] = useWatch({
    control,
    name: ['town', 'city', 'taluka', 'district', 'states', 'pTown', 'pCity', 'pTaluka', 'pDistrict'],
  })

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="w-full justify-start bg-orange-300">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="address">Address</TabsTrigger>
        <TabsTrigger value="marathi-address">Marathi Address</TabsTrigger>
        <TabsTrigger value="membership">Membership</TabsTrigger>
        {isEdit ? <TabsTrigger value="status">Status</TabsTrigger> : null}
      </TabsList>

      {/* ── Personal ── */}
      <TabsContent value="personal" className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="name-title" label="Title" error={errors.nameTitleID?.message}>
            <Controller
              control={control}
              name="nameTitleID"
              render={({ field }) => (
                <select
                  id="name-title"
                  className={fieldClass}
                  disabled={disabled || readOnly}
                  value={field.value != null ? String(field.value) : ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Select title</option>
                  {NAME_TITLES.map((title) => (
                    <option key={title.id} value={title.id}>{title.label}</option>
                  ))}
                </select>
              )}
            />
          </Field>
          <Field id="first-name" label="First Name *" error={errors.firstName?.message}>
            <Input id="first-name" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('firstName')} aria-invalid={Boolean(errors.firstName)} />
          </Field>
          <Field id="middle-name" label="Middle Name" error={errors.middleName?.message}>
            <Input id="middle-name" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('middleName')} />
          </Field>
          <Field id="last-name" label="Last Name" error={errors.lastName?.message}>
            <Input id="last-name" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('lastName')} />
          </Field>

          {/* Native name with Marathi transliteration */}
          <Field id="native-name" label="Name in Native Language (मराठी)" error={errors.nameInNativeLanguage?.message}>
            <Controller
              control={control}
              name="nameInNativeLanguage"
              render={({ field }) => (
                <MarathiInput
                  id="native-name"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  disabled={disabled}
                  readOnly={readOnly}
                />
              )}
            />
          </Field>

          <Field id="phone-no" label="Phone" error={errors.phoneNo?.message}>
            <Input id="phone-no" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('phoneNo')} />
          </Field>
          <Field id="mobile-no" label="Mobile" error={errors.mobileNo?.message}>
            <Input id="mobile-no" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('mobileNo')} />
          </Field>
          <Field id="email" label="Email" error={errors.eMail?.message}>
            <Input id="email" type="email" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('eMail')} aria-invalid={Boolean(errors.eMail)} />
          </Field>
          <Field id="gender" label="Gender" error={errors.gender?.message}>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <select
                  id="gender"
                  className={fieldClass}
                  disabled={disabled || readOnly}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || null)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              )}
            />
          </Field>
          <Field id="dob" label="Date of Birth" error={errors.dob?.message}>
            <Input id="dob" type="date" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('dob')} />
          </Field>
          <Field id="qualification" label="Qualification" error={errors.qualification?.message}>
            <Input id="qualification" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('qualification')} />
          </Field>
          <Field id="adhar-id" label="Aadhaar ID" error={errors.adharID?.message}>
            <Input id="adhar-id" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('adharID')} />
          </Field>
          <Field id="pan-no" label="PAN No." error={errors.panNo?.message}>
            <Input id="pan-no" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('panNo')} />
          </Field>
          <Field id="prv-share-holder" label="Prev. Share Holder" error={errors.prvShareHolder?.message}>
            <Input id="prv-share-holder" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('prvShareHolder')} />
          </Field>
          <Field id="objection" label="Objection" error={errors.objection?.message}>
            <Input id="objection" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('objection')} />
          </Field>
        </div>
      </TabsContent>

      {/* ── Address (English) ── */}
      <TabsContent value="address" className="mt-4 space-y-6">
        <div>
          <h4 className="mb-3 text-base font-semibold text-foreground">Permanent Address</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="town" label="Town" error={errors.town?.message}>
              <Input id="town" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('town')} />
            </Field>
            <Field id="city" label="City" error={errors.city?.message}>
              <Input id="city" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('city')} />
            </Field>
            <Field id="taluka" label="Taluka" error={errors.taluka?.message}>
              <Input id="taluka" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('taluka')} />
            </Field>
            <Field id="district" label="District" error={errors.district?.message}>
              <Input id="district" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('district')} />
            </Field>
            <Field id="states" label="State" error={errors.states?.message}>
              <Input id="states" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('states')} />
            </Field>
            <Field id="pin-code" label="PIN Code" error={errors.pinCode?.message}>
              <Input id="pin-code" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('pinCode')} />
            </Field>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-base font-semibold text-foreground">Present Address</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="p-town" label="Town" error={errors.pTown?.message}>
              <Input id="p-town" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('pTown')} />
            </Field>
            <Field id="p-city" label="City" error={errors.pCity?.message}>
              <Input id="p-city" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('pCity')} />
            </Field>
            <Field id="p-taluka" label="Taluka" error={errors.pTaluka?.message}>
              <Input id="p-taluka" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('pTaluka')} />
            </Field>
            <Field id="p-district" label="District" error={errors.pDistrict?.message}>
              <Input id="p-district" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('pDistrict')} />
            </Field>
            <Field id="p-pin-code" label="PIN Code" error={errors.pPinCode?.message}>
              <Input id="p-pin-code" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('pPinCode')} />
            </Field>
          </div>
        </div>
      </TabsContent>

      {/* ── Marathi Address ── */}
      <TabsContent value="marathi-address" className="mt-4 space-y-6">
        <p className="text-sm text-muted-foreground">
          Marathi fields are auto-filled from the English address. You can edit them manually.
        </p>

        <div>
          <h4 className="mb-3 text-base font-semibold text-foreground">कायमचा पत्ता (Permanent Address)</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="m-town" label="गाव (Town)" error={errors.mTown?.message}>
              <Controller control={control} name="mTown"
                render={({ field }) => (
                  <MarathiInput
                    id="m-town"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={town ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="m-city" label="शहर (City)" error={errors.mCity?.message}>
              <Controller control={control} name="mCity"
                render={({ field }) => (
                  <MarathiInput
                    id="m-city"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={city ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="m-taluka" label="तालुका (Taluka)" error={errors.mTaluka?.message}>
              <Controller control={control} name="mTaluka"
                render={({ field }) => (
                  <MarathiInput
                    id="m-taluka"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={taluka ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="m-district" label="जिल्हा (District)" error={errors.mDistrict?.message}>
              <Controller control={control} name="mDistrict"
                render={({ field }) => (
                  <MarathiInput
                    id="m-district"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={district ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="m-states" label="राज्य (State)" error={errors.mStates?.message}>
              <Controller control={control} name="mStates"
                render={({ field }) => (
                  <MarathiInput
                    id="m-states"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={states ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="m-pin-code" label="पिन कोड (PIN Code)" error={errors.mPinCode?.message}>
              <Input id="m-pin-code" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('mPinCode')} />
            </Field>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-base font-semibold text-foreground">सध्याचा पत्ता (Present Address)</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="mp-town" label="गाव (Town)" error={errors.mPTown?.message}>
              <Controller control={control} name="mPTown"
                render={({ field }) => (
                  <MarathiInput
                    id="mp-town"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={pTown ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="mp-city" label="शहर (City)" error={errors.mPCity?.message}>
              <Controller control={control} name="mPCity"
                render={({ field }) => (
                  <MarathiInput
                    id="mp-city"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={pCity ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="mp-taluka" label="तालुका (Taluka)" error={errors.mPTaluka?.message}>
              <Controller control={control} name="mPTaluka"
                render={({ field }) => (
                  <MarathiInput
                    id="mp-taluka"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={pTaluka ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="mp-district" label="जिल्हा (District)" error={errors.mPDistrict?.message}>
              <Controller control={control} name="mPDistrict"
                render={({ field }) => (
                  <MarathiInput
                    id="mp-district"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoTransliterateFrom={pDistrict ?? ''}
                  />
                )}
              />
            </Field>
            <Field id="mp-pin-code" label="पिन कोड (PIN Code)" error={errors.mPPinCode?.message}>
              <Input id="mp-pin-code" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('mPPinCode')} />
            </Field>
          </div>
        </div>
      </TabsContent>

      {/* ── Membership ── */}
      <TabsContent value="membership" className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="member-section" label="Section *" error={errors.memberSectionID?.message}>
            <Controller
              control={control}
              name="memberSectionID"
              render={({ field }) => (
                <select
                  id="member-section"
                  className={fieldClass}
                  disabled={disabled || readOnly}
                  value={field.value != null ? String(field.value) : ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Select section</option>
                  {sectionOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}
            />
          </Field>

          <Field id="member-sub-town" label="Sub Town" error={errors.organizationMemberSubTownID?.message}>
            <Controller
              control={control}
              name="organizationMemberSubTownID"
              render={({ field }) => (
                <select
                  id="member-sub-town"
                  className={fieldClass}
                  disabled={disabled || readOnly}
                  value={field.value != null ? String(field.value) : ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Select sub town</option>
                  {subTownOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}
            />
          </Field>

          <Field id="member-center" label="Center (auto)">
            <Controller
              control={control}
              name="organizationMemberSubTownID"
              render={({ field }) => {
                const selected = subTownOptions.find((o) => o.value === String(field.value ?? ''))
                return (
                  <input
                    id="member-center"
                    readOnly
                    className="flex h-10 w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-base text-foreground cursor-default"
                    value={selected?.centerName ?? '—'}
                  />
                )
              }}
            />
          </Field>

          <Field id="member-town" label="Town (auto)">
            <Controller
              control={control}
              name="organizationMemberSubTownID"
              render={({ field }) => {
                const selected = subTownOptions.find((o) => o.value === String(field.value ?? ''))
                return (
                  <input
                    id="member-town"
                    readOnly
                    className="flex h-10 w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-base text-foreground cursor-default"
                    value={selected?.townName ?? '—'}
                  />
                )
              }}
            />
          </Field>

          <Field id="member-no" label="Member No." error={errors.memberNo?.message}>
            <Input
              id="member-no"
              className={inputClass}
              disabled={disabled || memberNoReadOnly}
              readOnly={memberNoReadOnly || readOnly}
              {...register('memberNo')}
              placeholder={memberNoReadOnly ? 'Select section to generate' : undefined}
            />
          </Field>
          <Field id="reg-no" label="Reg No." error={errors.regNo?.message}>
            <Input id="reg-no" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('regNo')} />
          </Field>
          <Field id="application-no" label="Application No." error={errors.applicationNo?.message}>
            <Input id="application-no" type="number" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('applicationNo')} />
          </Field>
          <Field id="registration-date" label="Registration Date" error={errors.registrationDate?.message}>
            <Input id="registration-date" type="date" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('registrationDate')} />
          </Field>
          <Field id="nominee" label="Nominee" error={errors.nominee?.message}>
            <Input id="nominee" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('nominee')} />
          </Field>
        </div>
      </TabsContent>

      {/* ── Status (edit only) ── */}
      {isEdit ? (
        <TabsContent value="status" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="death" label="Deceased" error={undefined}>
              <Controller
                control={control}
                name="death"
                render={({ field }) => (
                  <label className="flex h-10 cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-input accent-primary"
                      disabled={disabled || readOnly}
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    Mark as deceased
                  </label>
                )}
              />
            </Field>
            <Field id="death-date" label="Death Date" error={errors.deathDate?.message}>
              <Input id="death-date" type="date" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('deathDate')} />
            </Field>
            <Field id="death-ref" label="Death Reference" error={errors.deathRef?.message}>
              <Input id="death-ref" className={inputClass} disabled={disabled} readOnly={readOnly} {...register('deathRef')} />
            </Field>
          </div>
        </TabsContent>
      ) : null}
    </Tabs>
  )
})