import { useState } from "react";
import OnboardingDashboard from "@/modules/onboarding/OnboardingDashboard";
import OnboardingWizard from "@/modules/onboarding/OnboardingWizard";
import OnboardingRequestDetail from "@/modules/onboarding/OnboardingRequestDetail";
import { OnboardingRequest } from "@/modules/onboarding/types";
import { MOCK_ONBOARDING_REQUESTS } from "@/modules/onboarding/mockData";

export function OnboardingPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardMode, setWizardMode] = useState<"onboarding" | "budget_request">("onboarding");
  const [selectedRequest, setSelectedRequest] = useState<OnboardingRequest | null>(null);

  // Overriding the default dashboard actions to show our wizard
  const handleNewOnboarding = () => {
    setWizardMode("onboarding");
    setShowWizard(true);
  };

  const handleNewBudgetRequest = () => {
    setWizardMode("budget_request");
    setShowWizard(true);
  };

  const handleViewDetails = (request: OnboardingRequest) => {
    setSelectedRequest(request);
  };

  if (selectedRequest) {
    return (
      <OnboardingRequestDetail 
        request={selectedRequest} 
        onBack={() => setSelectedRequest(null)} 
      />
    );
  }

  return (
    <div className="h-[calc(100vh-80px)]">
      <div className="relative h-full">
        <OnboardingDashboard 
          onNewOnboarding={handleNewOnboarding}
          onViewDetails={handleViewDetails}
        />
      </div>

      {showWizard && (
        <OnboardingWizard 
          initialMode={wizardMode} 
          onRequestClose={() => setShowWizard(false)} 
        />
      )}
    </div>
  );
}
