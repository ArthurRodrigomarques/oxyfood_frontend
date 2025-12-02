import { OnboardingRestaurant } from "@/components/admin/onboarding-restaurant";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        <OnboardingRestaurant />
      </div>
    </div>
  );
}
