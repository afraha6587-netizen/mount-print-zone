import { db } from './db';

export const STORE_SERVICES_CATALOG = [
  // Architectural & Large Format
  {
    name: 'JUMBO XEROX (A0, A1, A2)',
    slug: 'jumbo-xerox',
    categorySlug: 'architectural-large-format',
    categoryName: 'Architectural & Large Format (A0, A1, A2)',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    description: 'Large format jumbo photocopying for architectural drawings, engineering plans, and maps in A0, A1, A2 sizes.',
    basePrice: 50.0,
    discountPercent: 10,
    estimatedDelivery: 'Express 1 Hour',
    isFeatured: true,
  },
  {
    name: 'POSTERS / POSTER PRINTS (A0, A1, A2, A3)',
    slug: 'poster-prints',
    categorySlug: 'architectural-large-format',
    categoryName: 'Architectural & Large Format (A0, A1, A2)',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    description: 'High-gloss and matte large format poster printing on 220 GSM photo paper.',
    basePrice: 120.0,
    discountPercent: 15,
    estimatedDelivery: 'Same Day',
    isFeatured: true,
  },
  {
    name: 'BLUE PRINTS / DIGITAL BLUE PRINT (A0, A1, A2)',
    slug: 'digital-blue-prints',
    categorySlug: 'architectural-large-format',
    categoryName: 'Architectural & Large Format (A0, A1, A2)',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description: 'High-precision digital blue print plotting for civil engineers, contractors & architects.',
    basePrice: 45.0,
    discountPercent: 10,
    estimatedDelivery: 'Express 1 Hour',
    isFeatured: true,
  },
  {
    name: 'TRACING PRINTS / TRACING PAPER PRINT (A0, A1, A2, A3)',
    slug: 'tracing-prints',
    categorySlug: 'architectural-large-format',
    categoryName: 'Architectural & Large Format (A0, A1, A2)',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    description: 'Gateway tracing paper CAD plotting & drafting prints for architectural submissions.',
    basePrice: 65.0,
    discountPercent: 5,
    estimatedDelivery: 'Same Day',
    isFeatured: true,
  },
  {
    name: 'CAD / PLOT PRINTS (A0, A1, A2)',
    slug: 'cad-plot-prints',
    categorySlug: 'architectural-large-format',
    categoryName: 'Architectural & Large Format (A0, A1, A2)',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    description: 'Direct AutoCAD line plotting & GIS layout printing in A0, A1, and A2 sizes.',
    basePrice: 40.0,
    discountPercent: 10,
    estimatedDelivery: 'Express 1 Hour',
    isFeatured: false,
  },

  // Document Printing & Scanning
  {
    name: 'PRINT OUT (B&W & COLOUR) (A4, A3)',
    slug: 'print-out-document',
    categorySlug: 'document-printing-scanning',
    categoryName: 'Document Printing & Scanning (A3, A4)',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
    description: 'High-speed B&W and HD Colour document printouts on 75/80 GSM paper.',
    basePrice: 2.0,
    discountPercent: 20,
    estimatedDelivery: 'Instant / Express',
    isFeatured: true,
  },
  {
    name: 'XEROX COPYING (A4, A3)',
    slug: 'xerox-copying',
    categorySlug: 'document-printing-scanning',
    categoryName: 'Document Printing & Scanning (A3, A4)',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    description: 'High-volume double-sided and single-sided Xerox document copying.',
    basePrice: 1.5,
    discountPercent: 25,
    estimatedDelivery: 'Instant',
    isFeatured: true,
  },
  {
    name: 'COLOUR PRINT (HD Digital) (A4, A3)',
    slug: 'colour-print-hd',
    categorySlug: 'document-printing-scanning',
    categoryName: 'Document Printing & Scanning (A3, A4)',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant laser colour printing for presentations, certificates, and brochures.',
    basePrice: 10.0,
    discountPercent: 15,
    estimatedDelivery: 'Instant / Express',
    isFeatured: true,
  },
  {
    name: 'COREL DRAW PRINTS (CDR, AI, PSD)',
    slug: 'corel-draw-prints',
    categorySlug: 'document-printing-scanning',
    categoryName: 'Document Printing & Scanning (A3, A4)',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    description: 'Direct high-resolution printing from CorelDraw vector files, Illustrator, and Photoshop artwork.',
    basePrice: 15.0,
    discountPercent: 10,
    estimatedDelivery: 'Express',
    isFeatured: false,
  },
  {
    name: 'SCANNING (A4, A3, A2, A1, A0)',
    slug: 'scanning-documents-maps',
    categorySlug: 'document-printing-scanning',
    categoryName: 'Document Printing & Scanning (A3, A4)',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
    description: 'High-DPI color & B&W scanning for books, legal records, and large format blueprints to PDF/JPG.',
    basePrice: 5.0,
    discountPercent: 0,
    estimatedDelivery: 'Instant',
    isFeatured: true,
  },

  // Binding & Finishing
  {
    name: 'THESIS BINDING (Golden Embossed)',
    slug: 'thesis-binding',
    categorySlug: 'thesis-project-binding',
    categoryName: 'Thesis & Project Binding',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: 'University standard hardcover thesis binding with gold foil spine & cover embossing.',
    basePrice: 350.0,
    discountPercent: 0,
    estimatedDelivery: 'Same Day / 3 Hours',
    isFeatured: true,
  },
  {
    name: 'PROJECT - BINDING (Leatherette / Soft Cover)',
    slug: 'project-binding',
    categorySlug: 'thesis-project-binding',
    categoryName: 'Thesis & Project Binding',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'Deluxe project binding for college project reports, corporate profiles & manuals.',
    basePrice: 250.0,
    discountPercent: 5,
    estimatedDelivery: 'Same Day',
    isFeatured: true,
  },
  {
    name: 'HARD - BINDING (Hardcover Book Binding)',
    slug: 'hard-binding',
    categorySlug: 'thesis-project-binding',
    categoryName: 'Thesis & Project Binding',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy duty hardcover book binding for record books, ledgers, and journals.',
    basePrice: 300.0,
    discountPercent: 5,
    estimatedDelivery: 'Same Day',
    isFeatured: true,
  },
  {
    name: 'SPIRAL - BINDING (PVC Coil)',
    slug: 'spiral-binding',
    categorySlug: 'thesis-project-binding',
    categoryName: 'Thesis & Project Binding',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    description: 'Durable PVC coil spiral binding with transparent front cover & dark back cover.',
    basePrice: 40.0,
    discountPercent: 0,
    estimatedDelivery: 'Express 15 Mins',
    isFeatured: true,
  },
  {
    name: 'WIRO - BINDING (Twin Loop Metallic)',
    slug: 'wiro-binding',
    categorySlug: 'thesis-project-binding',
    categoryName: 'Thesis & Project Binding',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
    description: 'Premium metallic double loop wire-O binding for calendars, notebooks & presentation decks.',
    basePrice: 60.0,
    discountPercent: 0,
    estimatedDelivery: 'Express 15 Mins',
    isFeatured: false,
  },
  {
    name: 'LAMINATION (A0, A1, A2, A3, A4 Thermal)',
    slug: 'lamination-thermal',
    categorySlug: 'thesis-project-binding',
    categoryName: 'Thesis & Project Binding',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    description: 'Glossy and matte thermal pouch/roll lamination for document protection up to A0 size.',
    basePrice: 20.0,
    discountPercent: 0,
    estimatedDelivery: 'Express 10 Mins',
    isFeatured: true,
  },

  // PVC Cards & Photo Studio
  {
    name: 'PVC CARD (Plastic ID Cards)',
    slug: 'pvc-card-printing',
    categorySlug: 'pvc-cards-photo-studio',
    categoryName: 'PVC Cards & Photo Studio',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: 'Durable plastic PVC smart cards for corporate IDs, student badges, and membership cards.',
    basePrice: 80.0,
    discountPercent: 10,
    estimatedDelivery: 'Same Day',
    isFeatured: true,
  },
  {
    name: 'AYUSHMAN CARD (Govt PVC Health Card)',
    slug: 'ayushman-card-pvc',
    categorySlug: 'pvc-cards-photo-studio',
    categoryName: 'PVC Cards & Photo Studio',
    image: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=800&q=80',
    description: 'Official Ayushman Bharat health card printed on durable waterproof PVC smart card.',
    basePrice: 70.0,
    discountPercent: 0,
    estimatedDelivery: 'Express 15 Mins',
    isFeatured: true,
  },
  {
    name: 'PASSPORT SIZE PHOTO (Studio Quality 8 Pcs)',
    slug: 'passport-size-photo',
    categorySlug: 'pvc-cards-photo-studio',
    categoryName: 'PVC Cards & Photo Studio',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: '8 copies of instant studio quality glossy passport photos with background correction.',
    basePrice: 99.0,
    discountPercent: 0,
    estimatedDelivery: 'Instant 10 Mins',
    isFeatured: true,
  },

  // Custom Merch & Media
  {
    name: 'MUG PRINT (Sublimation Photo Mugs)',
    slug: 'mug-print-sublimation',
    categorySlug: 'merch-digital-media',
    categoryName: 'Custom Merch & Media Services',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: '11 oz high-gloss ceramic photo mug customized with vibrant sublimation photo printing.',
    basePrice: 199.0,
    discountPercent: 0,
    estimatedDelivery: 'Same Day',
    isFeatured: true,
  },
  {
    name: 'CD / DVD WRITING & Disc Printing',
    slug: 'cd-dvd-writing',
    categorySlug: 'merch-digital-media',
    categoryName: 'Custom Merch & Media Services',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    description: 'High-speed CD/DVD data burning with custom disc surface printing.',
    basePrice: 99.0,
    discountPercent: 0,
    estimatedDelivery: 'Instant 15 Mins',
    isFeatured: false,
  },

  // Office Stationery & CSC
  {
    name: 'OFFICE STATIONERY (Letterheads, Envelopes, Stamps)',
    slug: 'office-stationery',
    categorySlug: 'office-stationery-csc',
    categoryName: 'Office Stationery & CSC Online Services',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    description: 'Corporate letterheads, custom envelopes, self-inking stamps, and cash receipt bill books.',
    basePrice: 299.0,
    discountPercent: 10,
    estimatedDelivery: '1-2 Days',
    isFeatured: true,
  },
  {
    name: 'ONLINE APPLICATION / CSC DIGITAL SERVICES',
    slug: 'online-application-csc',
    categorySlug: 'office-stationery-csc',
    categoryName: 'Office Stationery & CSC Online Services',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Assisted online portal application submissions, e-governance CSC forms, exam applications & printouts.',
    basePrice: 100.0,
    discountPercent: 0,
    estimatedDelivery: 'Instant Assistance',
    isFeatured: true,
  },
];

export async function ensureFullStoreCatalogSeeded() {
  try {
    const existingCount = await db.service.count();
    if (existingCount >= 20) return;

    console.log('🌱 Auto-seeding complete 23 Mount Print Zone store services...');

    for (const item of STORE_SERVICES_CATALOG) {
      let category = await db.serviceCategory.findUnique({
        where: { slug: item.categorySlug },
      });

      if (!category) {
        category = await db.serviceCategory.create({
          data: {
            name: item.categoryName,
            slug: item.categorySlug,
            description: item.description,
            image: item.image,
          },
        });
      }

      const existingService = await db.service.findUnique({
        where: { slug: item.slug },
      });

      if (!existingService) {
        const createdService = await db.service.create({
          data: {
            name: item.name,
            slug: item.slug,
            categoryId: category.id,
            description: item.description,
            basePrice: item.basePrice,
            discountPercent: item.discountPercent,
            estimatedDelivery: item.estimatedDelivery,
            isFeatured: item.isFeatured,
            isHidden: false,
            image: item.image,
          },
        });

        await db.pricingRule.createMany({
          data: [
            { serviceId: createdService.id, minQuantity: 1, maxQuantity: 49, unitPrice: item.basePrice, discountPercent: 0 },
            { serviceId: createdService.id, minQuantity: 50, maxQuantity: 199, unitPrice: item.basePrice * 0.9, discountPercent: 10 },
            { serviceId: createdService.id, minQuantity: 200, maxQuantity: 9999, unitPrice: item.basePrice * 0.8, discountPercent: 20 },
          ],
        });
      }
    }
  } catch (error) {
    console.error('Error auto-seeding catalog:', error);
  }
}
