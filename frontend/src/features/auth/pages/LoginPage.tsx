import { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Building2, ShieldCheck } from 'lucide-react'
import { getApiErrorMessage } from '@/api'
import { ROUTES } from '@/constants/routes.constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks'
import { storage } from '@/utils/storage'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4, 'Enter the OTP sent to your email'),
})

type LoginValues = z.infer<typeof loginSchema>
type OtpValues = z.infer<typeof otpSchema>

export const LoginPage = memo(function LoginPage() {
  const navigate = useNavigate()
  const { login, verifyOtp } = useAuth()
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [loginEmail, setLoginEmail] = useState('')

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: '', otp: '' },
  })

  const onLogin = loginForm.handleSubmit(async (values) => {
    try {
      await login.mutateAsync({
        email: values.email,
        password: values.password,
      })
      setLoginEmail(values.email)
      otpForm.setValue('email', values.email)
      if (values.rememberMe) {
        storage.set('remember_email', values.email)
      }
      setStep('otp')
    } catch (error) {
      loginForm.setError('password', { message: getApiErrorMessage(error) })
    }
  })

  const onVerifyOtp = otpForm.handleSubmit(async (values) => {
    try {
      await verifyOtp.mutateAsync(values)
      navigate(ROUTES.dashboard, { replace: true })
    } catch (error) {
      otpForm.setError('otp', { message: getApiErrorMessage(error) })
    }
  })

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section
        className="login-brand-panel relative hidden flex-col justify-between p-10 text-white lg:flex"
        aria-hidden
      >
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-white/15">
            <Building2 className="size-7" />
          </div>
          <div>
            <p className="text-lg font-bold">MVP Members ERP</p>
            <p className="text-sm text-white/80">Enterprise Membership Platform</p>
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold leading-tight">
            Manage members, centers, and documents in one place.
          </h1>
          <p className="max-w-md text-sm text-white/85">
            Secure role-based access, master data management, and professional
            reporting built for growing organizations.
          </p>
        </div>
        <p className="text-xs text-white/70">© {new Date().getFullYear()} MVP Members</p>
      </section>

      <section className="login-form-panel flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-6" aria-hidden />
            </div>
            <CardTitle className="text-xl">
              {step === 'credentials' ? 'Sign in to your account' : 'Verify OTP'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {step === 'credentials'
                ? 'Enter your credentials to receive a one-time password.'
                : `OTP sent to ${loginEmail}`}
            </p>
          </CardHeader>
          <CardContent>
            {step === 'credentials' ? (
              <form onSubmit={onLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email ? (
                    <p className="text-sm text-destructive" role="alert">
                      {loginForm.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...loginForm.register('password')}
                  />
                  {loginForm.formState.errors.password ? (
                    <p className="text-sm text-destructive" role="alert">
                      {loginForm.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border accent-primary"
                    {...loginForm.register('rememberMe')}
                  />
                  Remember me
                </label>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={login.isPending}
                >
                  {login.isPending ? 'Signing in...' : 'Continue'}
                </Button>
              </form>
            ) : (
              <form onSubmit={onVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    {...otpForm.register('otp')}
                  />
                  {otpForm.formState.errors.otp ? (
                    <p className="text-sm text-destructive" role="alert">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifyOtp.isPending}
                >
                  {verifyOtp.isPending ? 'Verifying...' : 'Login'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep('credentials')}
                >
                  Back
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
})
