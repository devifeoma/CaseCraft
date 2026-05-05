import { LandingNav } from './landing-nav';
import { LandingContent } from './landing-content';
import { createClient } from '@/utils/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="relative min-h-screen bg-background text-foreground bg-grid-pattern selection:bg-brand-500/30 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <LandingNav userEmail={user?.email} />
      <LandingContent userEmail={user?.email} />
    </div>
  );
}
