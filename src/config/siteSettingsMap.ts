export interface SiteSettings {
  membershipUrl: string;
  registrationUrl: string;
  contactEmail: string;
  socialInstagram: string;
  socialLinkedin: string;
  whatsappUrl: string;
  pinnedVideoUrl: string;
  heroImages: string; // JSON array of image URLs
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  membershipUrl: 'https://forms.gle/Wtbyryj5fe7vgLy56',
  registrationUrl: '',
  contactEmail: 'apporleader.learn@gmail.com',
  socialInstagram: 'https://www.instagram.com/apporleader/',
  socialLinkedin: 'https://www.linkedin.com/company/apporleader/',
  whatsappUrl: 'https://chat.whatsapp.com/JdlG8D7neCtLwxXRXmoETc',
  pinnedVideoUrl: '',
  heroImages: '[]',
};

const DB_KEYS: Record<keyof SiteSettings, string> = {
  membershipUrl: 'membership_url',
  registrationUrl: 'registration_url',
  contactEmail: 'contact_email',
  socialInstagram: 'social_instagram',
  socialLinkedin: 'social_linkedin',
  whatsappUrl: 'whatsapp_url',
  pinnedVideoUrl: 'pinned_video_url',
  heroImages: 'hero_images',
};

export function rowsToSiteSettings(rows: { key: string; value: string }[]): SiteSettings {
  const getOptional = (k: keyof SiteSettings) => {
    const dbKey = DB_KEYS[k];
    const row = rows.find((r) => r.key === dbKey);
    const v = row?.value?.trim();
    return v ?? '';
  };
  const membershipRow = rows.find((r) => r.key === DB_KEYS.membershipUrl);
  const membershipUrl = membershipRow?.value?.trim() || DEFAULT_SITE_SETTINGS.membershipUrl;
  return {
    membershipUrl,
    registrationUrl: getOptional('registrationUrl'),
    contactEmail: getOptional('contactEmail') || DEFAULT_SITE_SETTINGS.contactEmail,
    socialInstagram: getOptional('socialInstagram') || DEFAULT_SITE_SETTINGS.socialInstagram,
    socialLinkedin: getOptional('socialLinkedin') || DEFAULT_SITE_SETTINGS.socialLinkedin,
    whatsappUrl: getOptional('whatsappUrl') || DEFAULT_SITE_SETTINGS.whatsappUrl,
    pinnedVideoUrl: getOptional('pinnedVideoUrl'),
    heroImages: getOptional('heroImages') || '[]',
  };
}

export function siteSettingsToUpserts(patch: Partial<SiteSettings>): { key: string; value: string }[] {
  const out: { key: string; value: string }[] = [];
  (Object.keys(patch) as (keyof SiteSettings)[]).forEach((k) => {
    const val = patch[k];
    if (val === undefined) return;
    out.push({ key: DB_KEYS[k], value: val });
  });
  return out;
}

/** Join / header secondary CTA: use dedicated registration URL when set, else membership. */
export function effectiveRegistrationUrl(s: SiteSettings): string {
  return s.registrationUrl.trim() || s.membershipUrl;
}
