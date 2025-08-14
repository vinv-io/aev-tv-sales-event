
'use client';

import { Logo } from "../icons/Logo";
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { memo } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, YoutubeIcon, Youtube } from 'lucide-react';
import { Button } from '../ui/button';

// Types for better structure
interface QuickLink {
  href: string;
  label: string;
  external?: boolean;
}

interface SocialLink {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

// Constants
const QUICK_LINKS: QuickLink[] = [
  { href: '/order', label: 'order' },
  { href: '/admin/login', label: 'admin', external: true },
] as const;

const SOCIAL_LINKS: SocialLink[] = [
  { href: 'https://www.facebook.com/aquavietnam', icon: Facebook, label: 'Facebook' },
  { href: 'https://www.youtube.com/c/AquavietnamVn2014', icon: Youtube, label: 'Youtube' },
  { href: 'https://www.instagram.com/aquavietnam.vn/', icon: Instagram, label: 'Instagram' },
] as const;

// Memoized sub-components
const QuickLinksSection = memo(({ t }: { t: any }) => (
  <div>
    <h3 className="font-semibold mb-4 text-foreground">{t('quickLinks')}</h3>
    <nav role="navigation" aria-label="Footer navigation">
      <ul className="space-y-2 text-sm">
        {QUICK_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 focus:text-primary outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-0.5 inline-block"
              {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {t(link.label)}
              {link.external && <span className="sr-only"> (opens in new tab)</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>
));

QuickLinksSection.displayName = 'QuickLinksSection';

const ContactSection = memo(({ t }: { t: any }) => (
  <div>
    <h3 className="font-semibold mb-4 text-foreground">{t('contact')}</h3>
    <address className="text-sm text-muted-foreground not-italic space-y-3">
      <div className="flex items-start gap-2">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <span>
          Lầu 17 Tòa nhà Sonatus, Số 15 Lê Thánh Tôn,<br />
          Phường Sài Gòn, TP. HCM
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <a 
          href="tel:1800585832" 
          className="hover:text-primary transition-colors duration-200 focus:text-primary outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
        >
          Hotline: 1800 585832
        </a>
      </div>
    </address>
  </div>
));

ContactSection.displayName = 'ContactSection';

const SocialLinks = memo(() => (
  <div className="flex gap-2">
    {SOCIAL_LINKS.map((social) => {
      const Icon = social.icon;
      return (
        <Button
          key={social.href}
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 text-muted-foreground hover:text-primary"
        >
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${social.label}`}
          >
            <Icon className="h-4 w-4" />
          </a>
        </Button>
      );
    })}
  </div>
));

SocialLinks.displayName = 'SocialLinks';

export const Footer = memo(() => {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 text-secondary-foreground py-12 mt-auto" role="contentinfo">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {t('tagline', { default: 'Khơi nguồn cảm hứng sống' })}
            </p>
            <SocialLinks />
          </div>

          {/* Quick links */}
          <QuickLinksSection t={t} />

          {/* Contact information */}
          <ContactSection t={t} />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>
              © {currentYear} AQUA VN. {t('allRightsReserved', { default: 'All rights reserved.' })}
            </p>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{t('language', { default: 'Language' })}:</span>
                <LanguageSwitcher />
              </div>
              
              {/* Legal Navigation */}
              <nav role="navigation" aria-label="Legal navigation">
                <ul className="flex gap-4">
                  <li>
                    <Link
                      href="https://aquavietnam.com.vn/chinh-sach-bao-mat-thong-tin/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors duration-200 focus:text-primary outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-0.5"
                    >
                      {t('privacy', { default: 'Privacy Policy' })}
                      <span className="sr-only"> (opens in new tab)</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://aquavietnam.com.vn/dieu-kien-dieu-khoan/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors duration-200 focus:text-primary outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-0.5"
                    >
                      {t('terms', { default: 'Terms of Service' })}
                      <span className="sr-only"> (opens in new tab)</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
