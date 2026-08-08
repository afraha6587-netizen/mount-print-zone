import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Mount Print Zone exact service catalog with curated high-res images...');

  // Clean existing tables
  await prisma.notification.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.orderTimeline.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.pricingRule.deleteMany({});
  await prisma.portfolioItem.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Production Admin & Staff Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const staffPasswordHash = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Mount Print Zone Admin',
      email: 'admin@mountprintzone.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: 'Store Staff Manager',
      email: 'staff@mountprintzone.com',
      passwordHash: staffPasswordHash,
      role: 'STAFF',
    },
  });

  console.log('👤 Configured production accounts:', { admin: admin.email, staff: staff.email });

  // 2. Service Categories
  const categoriesData = [
    {
      name: 'Architectural & Large Format (A0, A1, A2)',
      slug: 'architectural-large-format',
      description: 'Jumbo Xerox, Digital Blue Prints, Tracing Prints, CAD Plotting & High-Gloss Poster Prints.',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    },
    {
      name: 'Document Printing & Scanning',
      slug: 'document-printing-scanning',
      description: 'High-speed Black & White Printouts, HD Color Prints, Xerox & Document Scanning.',
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    },
    {
      name: 'Thesis & Project Binding',
      slug: 'thesis-project-binding',
      description: 'University Standard Hardcover Thesis Binding, Project Binding, Spiral & Twin-Loop Wiro Binding.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      displayOrder: 3,
    },
    {
      name: 'PVC Cards & Passport Photos',
      slug: 'pvc-cards-photos',
      description: 'High-durability PVC Plastic ID Cards, Ayushman Bharat Cards & Studio Passport Photos.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      displayOrder: 4,
    },
    {
      name: 'Lamination & Finishing',
      slug: 'lamination-finishing',
      description: 'Thermal pouch & roll lamination for A0, A1, A2, A3, and A4 size documents & posters.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      displayOrder: 5,
    },
    {
      name: 'Mugs & Digital Media',
      slug: 'mugs-digital-media',
      description: 'Custom Sublimation Photo Mugs & CD / DVD Data Writing services.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      displayOrder: 6,
    },
    {
      name: 'Office Stationery & CSC Services',
      slug: 'office-stationery-csc',
      description: 'Letterheads, Envelopes, Bill Books, Stamps & Online CSC Application Submissions.',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      displayOrder: 7,
    },
  ];

  const categoriesMap: Record<string, any> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.serviceCategory.create({ data: cat });
    categoriesMap[cat.slug] = createdCat;
  }

  // 3. Exact Services List with Dedicated Unique High-Res Images
  const servicesData = [
    // Large Format & Architectural
    {
      name: 'Digital Blue Prints Printing (A0, A1, A2)',
      slug: 'digital-blue-prints-printing',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      description: 'Crisp digital engineering & architectural blue prints in A0, A1, A2 sizes.',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 45.0,
      discountPercent: 10,
      estimatedDelivery: 'Same Day / 2 Hours',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'Jumbo Xerox Copying (A0, A1, A2)',
      slug: 'jumbo-xerox-copying',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      description: 'Large-scale jumbo photocopying for engineering drawings, site plans, and blueprints (A0, A1, A2).',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 50.0,
      discountPercent: 10,
      estimatedDelivery: 'Express 1 Hour',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'Tracing Paper Prints (A0, A1, A2, A3)',
      slug: 'tracing-paper-prints',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      description: 'High-precision drafting prints on gateway tracing paper for architects & civil engineers.',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 65.0,
      discountPercent: 5,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'CAD / Plotter Line Prints',
      slug: 'cad-plotter-line-prints',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      description: 'High-speed inkjet CAD line plotting for Autocad, Revit & GIS drawings in A0, A1, A2.',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 40.0,
      discountPercent: 10,
      estimatedDelivery: 'Express 1 Hour',
      isFeatured: false,
      isHidden: false,
    },
    {
      name: 'High-Gloss & Matte Poster Prints',
      slug: 'poster-prints',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant indoor & outdoor photo posters printed on 220 GSM photo paper (A0, A1, A2, A3).',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 120.0,
      discountPercent: 15,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },

    // Document Printing & Scanning
    {
      name: 'High-Speed B&W Printouts & Xerox',
      slug: 'bw-printouts-xerox',
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
      description: 'Crisp black & white laser printing & Xerox copying on 75/80 GSM paper (A4, A3).',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 2.0,
      discountPercent: 20,
      estimatedDelivery: 'Instant / Express',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'HD Color Document Printouts',
      slug: 'hd-color-document-printouts',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant color laser prints for presentations, reports, brochures, and certificates (A4, A3).',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 10.0,
      discountPercent: 15,
      estimatedDelivery: 'Instant / Express',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'CorelDraw & Vector Graphics Prints',
      slug: 'coreldraw-vector-prints',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      description: 'Direct high-fidelity vector color printing from CDR, AI, PSD, and PDF artwork files.',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 15.0,
      discountPercent: 10,
      estimatedDelivery: 'Express',
      isFeatured: false,
      isHidden: false,
    },
    {
      name: 'High-Resolution Document & Map Scanning',
      slug: 'high-resolution-scanning',
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
      description: 'Color & B&W scanning into PDF/JPG formats for documents, books, and large A0/A1 drawings.',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 5.0,
      discountPercent: 0,
      estimatedDelivery: 'Instant',
      isFeatured: true,
      isHidden: false,
    },

    // Binding & Finishing
    {
      name: 'Hardcover Thesis Binding (Golden Embossed)',
      slug: 'thesis-binding-golden-embossed',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      description: 'University standard hardcover thesis binding with gold foil letter stamping on spine & cover.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 350.0,
      discountPercent: 0,
      estimatedDelivery: 'Same Day / 3 Hours',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'Project & Hard Leatherette Binding',
      slug: 'project-hard-leatherette-binding',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      description: 'Deluxe leatherette hard binding for college project reports, company profiles & manuals.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 250.0,
      discountPercent: 5,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'Heavy Duty Spiral Binding',
      slug: 'spiral-binding',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
      description: 'Durable PVC coil spiral binding with transparent front sheet & black back cover.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 40.0,
      discountPercent: 0,
      estimatedDelivery: 'Express 15 Mins',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'Twin-Loop Wiro Wire-O Binding',
      slug: 'wiro-wire-o-binding',
      image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
      description: 'Premium metallic double loop Wire-O binding for calendars, corporate notebooks & reports.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 60.0,
      discountPercent: 0,
      estimatedDelivery: 'Express 15 Mins',
      isFeatured: false,
      isHidden: false,
    },

    // Identity Cards & Photos
    {
      name: 'PVC Plastic ID Cards Printing',
      slug: 'pvc-plastic-id-cards',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      description: 'High-durability plastic PVC smart cards for corporate employee IDs, student badges & visitor passes.',
      categoryId: categoriesMap['pvc-cards-photos'].id,
      basePrice: 80.0,
      discountPercent: 10,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'Ayushman Bharat PVC Health Card',
      slug: 'ayushman-pvc-health-card',
      image: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=800&q=80',
      description: 'Government Ayushman Bharat health card printed on durable waterproof PVC smart card.',
      categoryId: categoriesMap['pvc-cards-photos'].id,
      basePrice: 70.0,
      discountPercent: 0,
      estimatedDelivery: 'Express 15 Mins',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'Express Passport Size Studio Photos (8 Pcs)',
      slug: 'passport-size-studio-photos',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      description: '8 copies of studio quality glossy passport size photos with custom background change.',
      categoryId: categoriesMap['pvc-cards-photos'].id,
      basePrice: 99.0,
      discountPercent: 0,
      estimatedDelivery: 'Instant 10 Mins',
      isFeatured: true,
      isHidden: false,
    },

    // Lamination & Finishing
    {
      name: 'Gloss & Matte Thermal Lamination (A4, A3, A2, A1, A0)',
      slug: 'gloss-matte-thermal-lamination',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      description: 'Protective thermal pouch and wide-format roll lamination up to A0 size for documents & posters.',
      categoryId: categoriesMap['lamination-finishing'].id,
      basePrice: 20.0,
      discountPercent: 0,
      estimatedDelivery: 'Express 10 Mins',
      isFeatured: true,
      isHidden: false,
    },

    // Merch & Digital
    {
      name: 'Custom Ceramic Sublimation Photo Mugs',
      slug: 'custom-sublimation-photo-mugs',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      description: '11 oz high-gloss ceramic photo mug printed with vibrant dishwasher-safe sublimation inks.',
      categoryId: categoriesMap['mugs-digital-media'].id,
      basePrice: 199.0,
      discountPercent: 0,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'CD / DVD Data Writing & Disc Surface Printing',
      slug: 'cd-dvd-writing-printing',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      description: 'High-speed CD/DVD data burning with custom full-color glossy surface label printing.',
      categoryId: categoriesMap['mugs-digital-media'].id,
      basePrice: 99.0,
      discountPercent: 0,
      estimatedDelivery: 'Instant 15 Mins',
      isFeatured: false,
      isHidden: false,
    },

    // Stationery & CSC
    {
      name: 'Office Stationery (Letterheads, Envelopes, Stamps)',
      slug: 'office-stationery-branding',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      description: 'Corporate letterheads, custom printed envelopes, rubber self-inking stamps & cash bill books.',
      categoryId: categoriesMap['office-stationery-csc'].id,
      basePrice: 299.0,
      discountPercent: 10,
      estimatedDelivery: '1-2 Days',
      isFeatured: true,
      isHidden: false,
    },
    {
      name: 'Online Government Application & CSC Digital Services',
      slug: 'online-application-csc-services',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      description: 'Assisted online portal application submissions, e-governance CSC forms, exam applications & printouts.',
      categoryId: categoriesMap['office-stationery-csc'].id,
      basePrice: 100.0,
      discountPercent: 0,
      estimatedDelivery: 'Instant Assistance',
      isFeatured: true,
      isHidden: false,
    },
  ];

  for (const serv of servicesData) {
    const service = await prisma.service.create({ data: serv });

    // Add volume discount tiers
    await prisma.pricingRule.createMany({
      data: [
        { serviceId: service.id, minQuantity: 1, maxQuantity: 49, unitPrice: serv.basePrice, discountPercent: 0 },
        { serviceId: service.id, minQuantity: 50, maxQuantity: 199, unitPrice: serv.basePrice * 0.9, discountPercent: 10 },
        { serviceId: service.id, minQuantity: 200, maxQuantity: 9999, unitPrice: serv.basePrice * 0.8, discountPercent: 20 },
      ],
    });
  }

  // 4. Portfolio Projects
  await prisma.portfolioItem.createMany({
    data: [
      {
        title: 'A0 Architectural Blue Prints & CAD Plotting',
        categoryId: categoriesMap['architectural-large-format'].id,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        description: 'Ultra-crisp A0 CAD line plots on 90 GSM paper for major engineering consultancy.',
        isFeatured: true,
      },
      {
        title: 'Golden Embossed Thesis Hardcover Binding',
        categoryId: categoriesMap['thesis-project-binding'].id,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        description: 'University standard hardcover thesis binding with gold foil lettering for Mount Carmel student.',
        isFeatured: true,
      },
      {
        title: 'Corporate Employee PVC Smart Cards',
        categoryId: categoriesMap['pvc-cards-photos'].id,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        description: 'Glossy PVC ID cards with high-density barcode & employee photo badge print.',
        isFeatured: true,
      },
      {
        title: 'High-Gloss Event Poster Prints (A1 & A2)',
        categoryId: categoriesMap['architectural-large-format'].id,
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        description: '220 GSM high-gloss photo posters printed for campus event exhibition.',
        isFeatured: true,
      },
    ],
  });

  // 5. Customer Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        customerName: 'Prashanth Gowda (Civil Engineer)',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        review: 'Mount Print Zone near Mount Carmel College printed our A0 blueprints and tracing sheets in under 30 minutes! Crisp line clarity and very professional.',
        rating: 5,
        isFeatured: true,
      },
      {
        customerName: 'Ananya Sharma (Architecture Student)',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        review: 'Got my university thesis hardcover golden embossed binding done here. Absolute perfection and fast same-day service!',
        rating: 5,
        isFeatured: true,
      },
      {
        customerName: 'Deepak V. (Tech Lead)',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        review: 'High quality PVC staff ID cards and custom photo mugs. Best commercial printing shop in Vasanth Nagar, Bengaluru.',
        rating: 5,
        isFeatured: true,
      },
    ],
  });

  // 6. Homepage Banners & Offers
  await prisma.banner.createMany({
    data: [
      {
        title: 'Mount Print Zone - Bengaluru',
        subtitle: 'Digital Blue Prints, Jumbo Xerox, Thesis Binding, Poster Prints & PVC Cards in Vasanth Nagar.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
        link: '/services',
        isActive: true,
        order: 1,
      },
      {
        title: 'Engineering & Architectural Blueprints (A0, A1, A2)',
        subtitle: 'High-Precision CAD Plotting, Tracing Prints & Express Jumbo Xerox.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
        link: '/custom-order',
        isActive: true,
        order: 2,
      },
    ],
  });

  await prisma.offer.createMany({
    data: [
      {
        code: 'MPZCAD10',
        title: '10% OFF A0 & A1 Blue Prints Printing',
        discountPercent: 10,
        minOrderValue: 300,
        isActive: true,
      },
      {
        code: 'THESIS2026',
        title: 'Flat ₹50 OFF Hardcover Thesis Binding',
        discountPercent: 15,
        minOrderValue: 500,
        isActive: true,
      },
    ],
  });

  // 7. Store Site Settings
  const settings = [
    { key: 'company_name', value: 'Mount Print Zone', group: 'general' },
    { key: 'tagline', value: 'Precision Printing. Premium Finishing.', group: 'general' },
    { key: 'phone', value: '+91 88675 09334', group: 'contact' },
    { key: 'whatsapp', value: '+91 88675 09334', group: 'contact' },
    { key: 'email', value: 'contact@mountprintzone.com', group: 'contact' },
    { key: 'address', value: '16 1st Cross, 12th Main Rd, near MOUNT CARMEL COLLEGE, Vasanth Nagar, Bengaluru, Karnataka 560001', group: 'contact' },
    { key: 'business_hours', value: 'Monday - Saturday: 9:30 AM - 8:30 PM (Sunday Closed)', group: 'contact' },
    { key: 'google_map_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6974786481617!2d77.587889!3d12.991206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae166a3d7b8893%3A0xb35a3998f48039d9!2sMount%20Carmel%20College%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin', group: 'contact' },
    { key: 'hero_headline', value: 'Architectural Plotting, Thesis Binding & Commercial Printing', group: 'hero' },
    { key: 'hero_subtitle', value: 'From A0/A1 Digital Blue Prints & Jumbo Xerox to Golden Embossed Hardcover Binding, PVC Cards & Custom Mugs.', group: 'hero' },
    { key: 'gst_rate', value: '18', group: 'pricing' },
    { key: 'delivery_charge', value: '99', group: 'pricing' },
    { key: 'free_delivery_threshold', value: '1499', group: 'pricing' },
    { key: 'max_upload_size_mb', value: '50', group: 'general' },
    { key: 'accepted_file_types', value: 'PDF, AI, PSD, CDR, PNG, JPG, DWG, DOCX', group: 'general' },
  ];

  for (const set of settings) {
    await prisma.siteSetting.create({ data: set });
  }

  console.log('✅ Mount Print Zone service catalog re-seeded with high-res curated imagery!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
