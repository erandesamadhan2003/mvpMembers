import { memo } from 'react'
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

type LoginValues = z.infer<typeof loginSchema>

export const LoginPage = memo(function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onLogin = loginForm.handleSubmit(async (values) => {
    try {
      await login.mutateAsync({ email: values.email, password: values.password })
      if (values.rememberMe) {
        storage.set('remember_email', values.email)
      }
      navigate(ROUTES.dashboard, { replace: true })
    } catch (error) {
      loginForm.setError('password', { message: getApiErrorMessage(error) })
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
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the platform.
            </p>
          </CardHeader>
          <CardContent>
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
                {login.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
})