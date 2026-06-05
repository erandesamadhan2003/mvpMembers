import { memo, useMemo } from 'react'
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { FormSelectField } from '@/components/common/FormSelectField'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { NAME_TITLES } from '@/features/member/constants/nameTitles.constants'
import type { MemberFormValues } from '@/features/member/components/memberForm.schema'
import { useMemberCentersQuery } from '@/features/memberCenter/hooks'
import { useMemberSectionsQuery } from '@/features/memberSection/hooks'

interface MemberFormFieldsProps {
  register: UseFormRegister<MemberFormValues>
  control: Control<MemberFormValues>
  errors: FieldErrors<MemberFormValues>
  disabled?: boolean
  memberNoReadOnly?: boolean
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
      <Label htmlFor={id}>{label}</Label>
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
}: MemberFormFieldsProps) {
  const { data: sections = [] } = useMemberSectionsQuery()
  const { data: centers = [] } = useMemberCentersQuery()

  const sectionOptions = useMemo(
    () =>
      sections.map((s) => ({
        value: String(s.memberSectionID),
        label: s.memberSectionName,
      })),
    [sections],
  )

  const centerOptions = useMemo(
    () =>
      centers.map((c) => ({
        value: String(c.organizationMemberCenterID),
        label: `${c.centerName} (${c.organizationMemberTown?.townName ?? '—'})`,
      })),
    [centers],
  )

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="address">Address</TabsTrigger>
        <TabsTrigger value="membership">Membership</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="name-title" label="Title" error={errors.nameTitleID?.message}>
            <Controller
              control={control}
              name="nameTitleID"
              render={({ field }) => (
                <select
                  id="name-title"
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
                  disabled={disabled}
                  value={field.value != null ? String(field.value) : ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">Select title</option>
                  {NAME_TITLES.map((title) => (
                    <option key={title.id} value={title.id}>
                      {title.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </Field>
          <Field id="first-name" label="First Name *" error={errors.firstName?.message}>
            <Input
              id="first-name"
              disabled={disabled}
              {...register('firstName')}
              aria-invalid={Boolean(errors.firstName)}
            />
          </Field>
          <Field id="middle-name" label="Middle Name" error={errors.middleName?.message}>
            <Input id="middle-name" disabled={disabled} {...register('middleName')} />
          </Field>
          <Field id="last-name" label="Last Name" error={errors.lastName?.message}>
            <Input id="last-name" disabled={disabled} {...register('lastName')} />
          </Field>
          <Field
            id="native-name"
            label="Name in Native Language"
            error={errors.nameInNativeLanguage?.message}
          >
            <Input
              id="native-name"
              disabled={disabled}
              {...register('nameInNativeLanguage')}
            />
          </Field>
          <Field id="phone-no" label="Phone" error={errors.phoneNo?.message}>
            <Input id="phone-no" disabled={disabled} {...register('phoneNo')} />
          </Field>
          <Field id="email" label="Email" error={errors.eMail?.message}>
            <Input
              id="email"
              type="email"
              disabled={disabled}
              {...register('eMail')}
              aria-invalid={Boolean(errors.eMail)}
            />
          </Field>
          <Field id="gender" label="Gender" error={errors.gender?.message}>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <select
                  id="gender"
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
                  disabled={disabled}
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
            <Input id="dob" type="date" disabled={disabled} {...register('dob')} />
          </Field>
          <Field
            id="qualification"
            label="Qualification"
            error={errors.qualification?.message}
          >
            <Input
              id="qualification"
              disabled={disabled}
              {...register('qualification')}
            />
          </Field>
          <Field id="adhar-id" label="Aadhaar ID" error={errors.adharID?.message}>
            <Input id="adhar-id" disabled={disabled} {...register('adharID')} />
          </Field>
          <Field id="pan-no" label="PAN No." error={errors.panNo?.message}>
            <Input id="pan-no" disabled={disabled} {...register('panNo')} />
          </Field>
        </div>
      </TabsContent>

      <TabsContent value="address" className="mt-4 space-y-6">
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            Current / Temporary Address
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="city" label="City" error={errors.city?.message}>
              <Input id="city" disabled={disabled} {...register('city')} />
            </Field>
            <Field id="taluka" label="Taluka" error={errors.taluka?.message}>
              <Input id="taluka" disabled={disabled} {...register('taluka')} />
            </Field>
            <Field id="district" label="District" error={errors.district?.message}>
              <Input id="district" disabled={disabled} {...register('district')} />
            </Field>
            <Field id="states" label="State" error={errors.states?.message}>
              <Input id="states" disabled={disabled} {...register('states')} />
            </Field>
            <Field id="pin-code" label="PIN Code" error={errors.pinCode?.message}>
              <Input id="pin-code" disabled={disabled} {...register('pinCode')} />
            </Field>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            Permanent Address
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="p-city" label="City" error={errors.pCity?.message}>
              <Input id="p-city" disabled={disabled} {...register('pCity')} />
            </Field>
            <Field id="p-taluka" label="Taluka" error={errors.pTaluka?.message}>
              <Input id="p-taluka" disabled={disabled} {...register('pTaluka')} />
            </Field>
            <Field id="p-district" label="District" error={errors.pDistrict?.message}>
              <Input id="p-district" disabled={disabled} {...register('pDistrict')} />
            </Field>
            <Field id="p-pin-code" label="PIN Code" error={errors.pPinCode?.message}>
              <Input id="p-pin-code" disabled={disabled} {...register('pPinCode')} />
            </Field>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="membership" className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormSelectField
            control={control}
            name="memberSectionID"
            label="Section *"
            options={sectionOptions}
            placeholder="Select section"
            disabled={disabled}
            error={errors.memberSectionID?.message}
            id="member-section"
          />
          <FormSelectField
            control={control}
            name="organizationMemberCenterID"
            label="Center"
            options={centerOptions}
            placeholder="Select center"
            disabled={disabled}
            error={errors.organizationMemberCenterID?.message}
            id="member-center"
          />
          <Field id="member-no" label="Member No." error={errors.memberNo?.message}>
            <Input
              id="member-no"
              disabled={disabled || memberNoReadOnly}
              readOnly={memberNoReadOnly}
              {...register('memberNo')}
              placeholder={memberNoReadOnly ? 'Select section to generate' : undefined}
            />
          </Field>
          <Field
            id="registration-date"
            label="Registration Date"
            error={errors.registrationDate?.message}
          >
            <Input
              id="registration-date"
              type="date"
              disabled={disabled}
              {...register('registrationDate')}
            />
          </Field>
          <Field id="nominee" label="Nominee" error={errors.nominee?.message}>
            <Input id="nominee" disabled={disabled} {...register('nominee')} />
          </Field>
        </div>
      </TabsContent>
    </Tabs>
  )
})
