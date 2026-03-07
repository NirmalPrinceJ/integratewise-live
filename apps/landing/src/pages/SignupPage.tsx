import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, Cpu, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    workspace: '',
    agreeTerms: false,
    agreeMarketing: false,
  });
  
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.name || !formData.email) {
        setError('Please fill in all fields');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.password || formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (!formData.agreeTerms) {
        setError('Please agree to the terms of service');
        return;
      }

      try {
        await signup(formData.name, formData.email, formData.password, formData.workspace);
        navigate('/app');
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const features = [
    'Personal + Work spaces',
    'B0-B5 hydration',
    'Core integrations',
    'AI memory',
  ];

  return (
    <div className="min-h-screen bg-iw-bg flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="p-2 rounded-lg bg-iw-accent/20">
              <Cpu className="w-6 h-6 text-iw-accent" />
            </div>
            <span className="font-display font-bold text-xl text-iw-text">
              IntegrateWise
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-iw-text mb-2">
              {step === 1 ? 'Create your account' : 'Secure your workspace'}
            </h1>
            <p className="text-iw-text-secondary">
              {step === 1 
                ? 'Start your 30-day free trial. No credit card required.' 
                : 'Set up your password and workspace details.'}
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-iw-accent' : 'bg-white/10'}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-iw-accent' : 'bg-white/10'}`} />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-iw-text">
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-iw-text-secondary" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent focus:ring-iw-accent/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-iw-text">
                    Work email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-iw-text-secondary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent focus:ring-iw-accent/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspace" className="text-iw-text">
                    Workspace name <span className="text-iw-text-secondary">(optional)</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-iw-text-secondary" />
                    <Input
                      id="workspace"
                      type="text"
                      placeholder="Acme Inc"
                      value={formData.workspace}
                      onChange={(e) => handleChange('workspace', e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent focus:ring-iw-accent/20"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-iw-text">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-iw-text-secondary" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent focus:ring-iw-accent/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-iw-text-secondary hover:text-iw-text"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-iw-text-secondary">
                    Must be at least 8 characters with a number and special character
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleChange('agreeTerms', checked as boolean)}
                      className="mt-1 border-white/20 data-[state=checked]:bg-iw-accent data-[state=checked]:border-iw-accent"
                    />
                    <Label htmlFor="terms" className="text-sm text-iw-text-secondary cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-iw-accent hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-iw-accent hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="marketing"
                      checked={formData.agreeMarketing}
                      onCheckedChange={(checked) => handleChange('agreeMarketing', checked as boolean)}
                      className="mt-1 border-white/20 data-[state=checked]:bg-iw-accent data-[state=checked]:border-iw-accent"
                    />
                    <Label htmlFor="marketing" className="text-sm text-iw-text-secondary cursor-pointer leading-relaxed">
                      Send me product updates and tips (optional)
                    </Label>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-white/10 text-iw-text hover:bg-white/5"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-iw-accent text-iw-bg font-semibold py-6 btn-lift"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-iw-bg/30 border-t-iw-bg rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : step === 1 ? (
                  <>
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Sign in link */}
          <p className="mt-8 text-center text-iw-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-iw-accent hover:text-iw-accent/80 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/workspace_context.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-iw-bg/70" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="max-w-md">
            <div className="mb-6">
              <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
                Free Plan Includes
              </span>
            </div>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-iw-accent/20">
                    <Check className="w-4 h-4 text-iw-accent" />
                  </div>
                  <span className="text-iw-text">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-iw-text-secondary italic">
                "IntegrateWise transformed how our team works. We went from 12 disconnected 
                tools to one unified workspace."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-iw-accent/20 flex items-center justify-center">
                  <span className="text-iw-accent font-semibold text-sm">RK</span>
                </div>
                <div>
                  <div className="text-sm text-iw-text font-medium">Rajesh Kumar</div>
                  <div className="text-xs text-iw-text-secondary">CTO, TechStart Bangalore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
