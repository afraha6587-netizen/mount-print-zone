import { db } from './db';

const defaultSettings: Record<string, string> = {
  company_name: 'Mount Print Zone',
  tagline: 'Precision Printing. Premium Finishing.',
  phone: '+91 88675 09334',
  whatsapp: '+91 88675 09334',
  email: 'contact@mountprintzone.com',
  address: '16 1st Cross, 12th Main Rd, near MOUNT CARMEL COLLEGE, Vasanth Nagar, Bengaluru, Karnataka 560001',
  business_hours: 'Monday - Saturday: 9:30 AM - 8:30 PM (Sunday Closed)',
  google_map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6974786481617!2d77.587889!3d12.991206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae166a3d7b8893%3A0xb35a3998f48039d9!2sMount%20Carmel%20College%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  hero_headline: 'Transforming Ideas into Premium Prints',
  hero_subtitle: 'From luxury business cards to large-format outdoor flex and custom merch. Uncompromising quality delivered fast.',
  gst_rate: '18',
  delivery_charge: '99',
  free_delivery_threshold: '1499',
  max_upload_size_mb: '50',
  accepted_file_types: 'PDF, AI, PSD, CDR, PNG, JPG, DOCX',
  instagram_url: 'https://instagram.com/mountprintzone',
  facebook_url: 'https://facebook.com/mountprintzone',
};

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const dbSettings = await db.siteSetting.findMany();
    const result = { ...defaultSettings };
    for (const setting of dbSettings) {
      result[setting.key] = setting.value;
    }
    return result;
  } catch {
    return defaultSettings;
  }
}
