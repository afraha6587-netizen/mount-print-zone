import { getSiteSettings } from '@/lib/settings';
import { Navbar } from '@/components/customer/navbar';
import { Footer } from '@/components/customer/footer';
import { WhatsAppFloat } from '@/components/customer/whatsapp-float';

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-sky-500 selection:text-white">
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <WhatsAppFloat whatsappNumber={settings.whatsapp} phone={settings.phone} />
      <Footer settings={settings} />
    </div>
  );
}
