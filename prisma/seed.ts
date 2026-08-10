import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Mount Print Zone exact service catalog (23 Services & A0-A4 Sizes)...');

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

  // 1. Production Admin & Staff Users (Uncrackable passwords)
  const adminPasswordHash = await bcrypt.hash('MPZ#Admin$2026!Bengaluru', 12);
  const staffPasswordHash = await bcrypt.hash('MPZ#Staff&2026!MountCarmel', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Mount Print Zone Super Admin',
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
      description: 'Jumbo Xerox, Digital Blue Prints, Tracing Prints, CAD Plotting & Posters (A0, A1, A2).',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    },
    {
      name: 'Document Printing & Scanning (A3, A4)',
      slug: 'document-printing-scanning',
      description: 'High-speed Print Out, B&W & Colour Print, Xerox, Scanning & Corel Draw Prints.',
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    },
    {
      name: 'Thesis & Project Binding',
      slug: 'thesis-project-binding',
      description: 'Thesis Binding, Project Binding, Spiral Binding, Wiro Binding, Hard Binding & Lamination.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      displayOrder: 3,
    },
    {
      name: 'PVC Cards & Photo Studio',
      slug: 'pvc-cards-photo-studio',
      description: 'PVC Card Printing, Ayushman Card & Studio Passport Size Photo Printing.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      displayOrder: 4,
    },
    {
      name: 'Custom Merch & Media Services',
      slug: 'merch-digital-media',
      description: 'Custom Mug Print & CD / DVD Data Writing services.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      displayOrder: 5,
    },
    {
      name: 'Office Stationery & CSC Online Services',
      slug: 'office-stationery-csc',
      description: 'Office Stationery & Online CSC Application Assistance.',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      displayOrder: 6,
    },
  ];

  const categoriesMap: Record<string, any> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.serviceCategory.create({ data: cat });
    categoriesMap[cat.slug] = createdCat;
  }

  // 3. Exact 23 Services List
  const servicesData = [
    // 1. Jumbo Xerox
    {
      name: 'JUMBO XEROX (A0, A1, A2)',
      slug: 'jumbo-xerox',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      description: 'Large format jumbo photocopying for architectural drawings, engineering plans, and maps in A0, A1, A2 sizes.',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 50.0,
      discountPercent: 10,
      estimatedDelivery: 'Express 1 Hour',
      isFeatured: true,
      isHidden: false,
    },
    // 2. Posters & Poster Prints
    {
      name: 'POSTERS / POSTER PRINTS (A0, A1, A2, A3)',
      slug: 'poster-prints',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      description: 'High-gloss and matte large format poster printing on 220 GSM photo paper.',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 120.0,
      discountPercent: 15,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    // 3. Digital Blue Prints
    {
      name: 'BLUE PRINTS / DIGITAL BLUE PRINT (A0, A1, A2)',
      slug: 'digital-blue-prints',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      description: 'High-precision digital blue print plotting for civil engineers, contractors & architects.',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 45.0,
      discountPercent: 10,
      estimatedDelivery: 'Express 1 Hour',
      isFeatured: true,
      isHidden: false,
    },
    // 4. Tracing Prints
    {
      name: 'TRACING PRINTS / TRACING PAPER PRINT (A0, A1, A2, A3)',
      slug: 'tracing-prints',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      description: 'Gateway tracing paper CAD plotting & drafting prints for architectural submissions.',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 65.0,
      discountPercent: 5,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    // 5. CAD / Plot Prints
    {
      name: 'CAD / PLOT PRINTS (A0, A1, A2)',
      slug: 'cad-plot-prints',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      description: 'Direct AutoCAD line plotting & GIS layout printing in A0, A1, and A2 sizes.',
      categoryId: categoriesMap['architectural-large-format'].id,
      basePrice: 40.0,
      discountPercent: 10,
      estimatedDelivery: 'Express 1 Hour',
      isFeatured: false,
      isHidden: false,
    },
    // 6. Print Out
    {
      name: 'PRINT OUT (B&W & COLOUR) (A4, A3)',
      slug: 'print-out-document',
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
      description: 'High-speed B&W and HD Colour document printouts on 75/80 GSM paper.',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 2.0,
      discountPercent: 20,
      estimatedDelivery: 'Instant / Express',
      isFeatured: true,
      isHidden: false,
    },
    // 7. Xerox
    {
      name: 'XEROX COPYING (A4, A3)',
      slug: 'xerox-copying',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      description: 'High-volume double-sided and single-sided Xerox document copying.',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 1.5,
      discountPercent: 25,
      estimatedDelivery: 'Instant',
      isFeatured: true,
      isHidden: false,
    },
    // 8. Colour Print
    {
      name: 'COLOUR PRINT (HD Digital) (A4, A3)',
      slug: 'colour-print-hd',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant laser colour printing for presentations, certificates, and brochures.',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 10.0,
      discountPercent: 15,
      estimatedDelivery: 'Instant / Express',
      isFeatured: true,
      isHidden: false,
    },
    // 9. Corel Draw Prints
    {
      name: 'COREL DRAW PRINTS (CDR, AI, PSD)',
      slug: 'corel-draw-prints',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      description: 'Direct high-resolution printing from CorelDraw vector files, Illustrator, and Photoshop artwork.',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 15.0,
      discountPercent: 10,
      estimatedDelivery: 'Express',
      isFeatured: false,
      isHidden: false,
    },
    // 10. Scanning
    {
      name: 'SCANNING (A4, A3, A2, A1, A0)',
      slug: 'scanning-documents-maps',
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
      description: 'High-DPI color & B&W scanning for books, legal records, and large format blueprints to PDF/JPG.',
      categoryId: categoriesMap['document-printing-scanning'].id,
      basePrice: 5.0,
      discountPercent: 0,
      estimatedDelivery: 'Instant',
      isFeatured: true,
      isHidden: false,
    },
    // 11. Thesis Binding
    {
      name: 'THESIS BINDING (Golden Embossed)',
      slug: 'thesis-binding',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      description: 'University standard hardcover thesis binding with gold foil spine & cover embossing.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 350.0,
      discountPercent: 0,
      estimatedDelivery: 'Same Day / 3 Hours',
      isFeatured: true,
      isHidden: false,
    },
    // 12. Project Binding
    {
      name: 'PROJECT - BINDING (Leatherette / Soft Cover)',
      slug: 'project-binding',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      description: 'Deluxe project binding for college project reports, corporate profiles & manuals.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 250.0,
      discountPercent: 5,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    // 13. Hard Binding
    {
      name: 'HARD - BINDING (Hardcover Book Binding)',
      slug: 'hard-binding',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      description: 'Heavy duty hardcover book binding for record books, ledgers, and journals.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 300.0,
      discountPercent: 5,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    // 14. Spiral Binding
    {
      name: 'SPIRAL - BINDING (PVC Coil)',
      slug: 'spiral-binding',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
      description: 'Durable PVC coil spiral binding with transparent front cover & dark back cover.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 40.0,
      discountPercent: 0,
      estimatedDelivery: 'Express 15 Mins',
      isFeatured: true,
      isHidden: false,
    },
    // 15. Wiro Binding
    {
      name: 'WIRO - BINDING (Twin Loop Metallic)',
      slug: 'wiro-binding',
      image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
      description: 'Premium metallic double loop wire-O binding for calendars, notebooks & presentation decks.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 60.0,
      discountPercent: 0,
      estimatedDelivery: 'Express 15 Mins',
      isFeatured: false,
      isHidden: false,
    },
    // 16. Lamination
    {
      name: 'LAMINATION (A0, A1, A2, A3, A4 Thermal)',
      slug: 'lamination-thermal',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      description: 'Glossy and matte thermal pouch/roll lamination for document protection up to A0 size.',
      categoryId: categoriesMap['thesis-project-binding'].id,
      basePrice: 20.0,
      discountPercent: 0,
      estimatedDelivery: 'Express 10 Mins',
      isFeatured: true,
      isHidden: false,
    },
    // 17. PVC Card
    {
      name: 'PVC CARD (Plastic ID Cards)',
      slug: 'pvc-card-printing',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      description: 'Durable plastic PVC smart cards for corporate IDs, student badges, and membership cards.',
      categoryId: categoriesMap['pvc-cards-photo-studio'].id,
      basePrice: 80.0,
      discountPercent: 10,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    // 18. Ayushman Card
    {
      name: 'AYUSHMAN CARD (Govt PVC Health Card)',
      slug: 'ayushman-card-pvc',
      image: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=800&q=80',
      description: 'Official Ayushman Bharat health card printed on durable waterproof PVC smart card.',
      categoryId: categoriesMap['pvc-cards-photo-studio'].id,
      basePrice: 70.0,
      discountPercent: 0,
      estimatedDelivery: 'Express 15 Mins',
      isFeatured: true,
      isHidden: false,
    },
    // 19. Passport Size Photo
    {
      name: 'PASSPORT SIZE PHOTO (Studio Quality 8 Pcs)',
      slug: 'passport-size-photo',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      description: '8 copies of instant studio quality glossy passport photos with background correction.',
      categoryId: categoriesMap['pvc-cards-photo-studio'].id,
      basePrice: 99.0,
      discountPercent: 0,
      estimatedDelivery: 'Instant 10 Mins',
      isFeatured: true,
      isHidden: false,
    },
    // 20. Mug Print
    {
      name: 'MUG PRINT (Sublimation Photo Mugs)',
      slug: 'mug-print-sublimation',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      description: '11 oz high-gloss ceramic photo mug customized with vibrant sublimation photo printing.',
      categoryId: categoriesMap['merch-digital-media'].id,
      basePrice: 199.0,
      discountPercent: 0,
      estimatedDelivery: 'Same Day',
      isFeatured: true,
      isHidden: false,
    },
    // 21. CD / DVD Writing
    {
      name: 'CD / DVD WRITING & Disc Printing',
      slug: 'cd-dvd-writing',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      description: 'High-speed CD/DVD data burning with custom disc surface printing.',
      categoryId: categoriesMap['merch-digital-media'].id,
      basePrice: 99.0,
      discountPercent: 0,
      estimatedDelivery: 'Instant 15 Mins',
      isFeatured: false,
      isHidden: false,
    },
    // 22. Office Stationery
    {
      name: 'OFFICE STATIONERY (Letterheads, Envelopes, Stamps)',
      slug: 'office-stationery',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      description: 'Corporate letterheads, custom envelopes, self-inking stamps, and cash receipt bill books.',
      categoryId: categoriesMap['office-stationery-csc'].id,
      basePrice: 299.0,
      discountPercent: 10,
      estimatedDelivery: '1-2 Days',
      isFeatured: true,
      isHidden: false,
    },
    // 23. Online Application & CSC Services
    {
      name: 'ONLINE APPLICATION / CSC DIGITAL SERVICES',
      slug: 'online-application-csc',
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
        categoryId: categoriesMap['pvc-cards-photo-studio'].id,
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
        title: 'Architectural A0, A1, A2 Blueprint & Plotting Specialists',
        subtitle: 'High-precision engineering CAD plotting, tracing prints & jumbo xerox copies near Mount Carmel College.',
        link: '/custom-order',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
        order: 1,
      },
      {
        title: 'University Golden Embossed Thesis & Hard Binding',
        subtitle: 'Official hardcover thesis binding with gold foil lettering and heavy-duty wiro/spiral binding.',
        link: '/custom-order',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
        order: 2,
      },
    ],
  });

  await prisma.offer.createMany({
    data: [
      {
        title: 'Student Discount: 15% Off Thesis Binding',
        code: 'STUDENT15',
        discountPercent: 15,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        minOrderValue: 300,
      },
      {
        title: 'Bulk Large Format Plotting Deal',
        code: 'BULKPLOT20',
        discountPercent: 20,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        minOrderValue: 500,
      },
    ],
  });

  // 7. Site Settings
  await prisma.siteSetting.createMany({
    data: [
      { key: 'store_name', value: 'Mount Print Zone' },
      { key: 'phone', value: '+91 88675 09334' },
      { key: 'whatsapp', value: '+918867509334' },
      { key: 'email', value: 'mountprintzone@gmail.com' },
      {
        key: 'address',
        value: '16 1st Cross, 12th Main Rd, near MOUNT CARMEL COLLEGE, Vasanth Nagar, Bengaluru, Karnataka 560001',
      },
      { key: 'gst_rate', value: '18' },
      { key: 'delivery_charge', value: '99' },
      { key: 'free_delivery_threshold', value: '999' },
      { key: 'max_upload_size_mb', value: '100' },
      { key: 'accepted_file_types', value: 'PDF, AI, PSD, CDR, PNG, JPG, DOCX, DWG' },
    ],
  });

  console.log('🎉 Successfully seeded 23 exact Mount Print Zone services & paper sizes (A0-A4)!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
