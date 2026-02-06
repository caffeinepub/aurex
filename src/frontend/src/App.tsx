import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/queries/useCurrentUserProfile';
import LoginButton from './components/auth/LoginButton';
import AuthGate from './components/auth/AuthGate';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import DisclaimerBanner from './components/DisclaimerBanner';
import AurexBrand from './components/branding/AurexBrand';
import MainNav from './components/navigation/MainNav';
import DashboardPage from './pages/DashboardPage';
import TradePage from './pages/TradePage';
import PortfolioPage from './pages/PortfolioPage';
import HistoryPage from './pages/HistoryPage';
import AboutSection from './components/branding/AboutSection';
import { Heart } from 'lucide-react';

type ActivePage = 'dashboard' | 'trade' | 'portfolio' | 'history';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <AurexBrand />
            <LoginButton />
          </div>
        </header>

        {/* Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <AuthGate>
            {/* Navigation */}
            <MainNav activePage={activePage} onPageChange={setActivePage} />

            {/* Page Content */}
            <div className="mt-6">
              {activePage === 'dashboard' && <DashboardPage />}
              {activePage === 'trade' && <TradePage />}
              {activePage === 'portfolio' && <PortfolioPage />}
              {activePage === 'history' && <HistoryPage />}
            </div>

            {/* About Section in Dashboard */}
            {activePage === 'dashboard' && (
              <div className="mt-12">
                <AboutSection />
              </div>
            )}
          </AuthGate>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-card/30 mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              © 2026. Built with <Heart className="inline h-4 w-4 text-destructive fill-destructive" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>

        {/* Profile Setup Dialog */}
        {showProfileSetup && <ProfileSetupDialog />}

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
