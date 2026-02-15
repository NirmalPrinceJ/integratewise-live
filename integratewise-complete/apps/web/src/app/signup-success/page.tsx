import { Check } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#2D7A3E] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-500 mb-8">
          We've sent a confirmation link to your email address. Please click the link to activate your account.
        </p>
        <a
          href="/login"
          className="inline-block bg-[#2D7A3E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#236B31] transition-colors"
        >
          Back to Sign In
        </a>
      </div>
    </div>
  )
}
