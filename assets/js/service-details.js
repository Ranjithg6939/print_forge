/**
 * PrintForge – Service Details Dynamic Controller (service-details.js)
 * Loads specific titles, high-res images, specs, workflows, and FAQs
 * based on the ?service= query parameter and sidebar clicks.
 */

(function () {
  'use strict';

  const servicesData = {
    'offset': {
      id: 'offset',
      badge: 'Service Specification 01',
      title: 'High-Volume Offset Printing',
      lead: 'Heidelberg Speedmaster XL 106 technology running 18,000 sheets/hour with in-line spectrophotometric color correction, automated plate changing, and dual-coater units.',
      heroImg: 'assets/images/services/Offset Printing press.jpg',
      heroImgAlt: 'Heidelberg Speedmaster Offset Press',
      diveTitle: 'Uncompromising Color Fidelity at Scale',
      diveLead: 'Offset lithography remains the global gold standard for projects demanding flawless color consistency, razor-sharp vector line art, and exceptional unit economy.',
      diveDesc: 'Our Heidelberg XL 106 presses employ an indirect offset process: ink is transferred from etched aluminum plates to rubber blankets, then smoothly pressed onto paper. This eliminates toner banding, paper warping, and edge distortion common with digital copiers.',
      specs: [
        { param: 'Maximum Sheet Format', value: '750 x 1060 mm (29.53 x 41.73 inches)' },
        { param: 'Stock Caliper / Weight', value: '0.03 mm to 1.0 mm (40 GSM paper to 600 GSM heavy board)' },
        { param: 'Press Speed', value: 'Up to 18,000 sheets / hour continuous run' },
        { param: 'Inking Units', value: '8 Colors (4/4 simultaneous perfecting) + Dual Inline Coaters' },
        { param: 'Color Target Standard', value: 'ISO 12647-2, GRACoL 2013, Fogra 39/51 (Delta E < 1.5)' },
        { param: 'Plate Technology', value: 'Kodak Sonora Process-Free 2400 DPI Thermal CTP' }
      ],
      papers: [
        { icon: 'bi-file-earmark-check', title: 'Coated Art Stock', desc: 'Gloss, Silk, and Satin finishes from 90 GSM up to 400 GSM. Ideal for magazines, annual reports, and brochures.' },
        { icon: 'bi-file-earmark-text', title: 'Uncoated Premium Text', desc: 'Smooth offset, vellum, and linen textures from 80 GSM to 350 GSM. Ideal for book publishing and corporate stationery.' },
        { icon: 'bi-box-seam', title: 'Folding Boxboard (FBB)', desc: 'SBS and virgin fiber multi-ply carton boards from 250 GSM to 500 GSM for folding boxes and product sleeves.' },
        { icon: 'bi-tree', title: '100% Recycled & Kraft', desc: 'Post-consumer waste (PCW) unbleached brown kraft and natural greyboards for eco-conscious packaging.' }
      ],
      process: [
        { step: '01', title: 'Preflight & Automated CTP Imaging', desc: 'PDF files undergo 14-point preflight verification. Thermal lasers image 2400 DPI Sonora process-free aluminum plates.' },
        { step: '02', title: 'Spectral Inking & Press Calibration', desc: 'Heidelberg InpressControl scans color bars at full production speed, adjusting ink keys across 8 units in real time.' },
        { step: '03', title: 'Double Aqueous / Soft-Touch Coating', desc: 'Inline dual-coater applies protective water-based sealer or velvety tactile coating before high-velocity IR sheet drying.' },
        { step: '04', title: 'Automated Cutting & Pallet Packaging', desc: 'Polar high-speed guillotines trim lift stacks with 0.1mm optical accuracy. Bundles shrink-wrapped and palletized for freight.' }
      ],
      faqs: [
        { q: 'What is the minimum economical press run for offset lithography?', a: 'While we can run proof batches as small as 500 sheets, the optimal cost-per-unit threshold begins at 1,000 to 2,500 copies. Beyond 5,000 units, offset unit costs plummet to fractions of a cent.' },
        { q: 'How does in-line spectrophotometry ensure color consistency?', a: 'Heidelberg Prinect InpressControl measures color bars on every single sheet without stopping the press, maintaining Fogra 51 color tolerances with Delta E under 1.5 throughout the entire run.' },
        { q: 'Can PrintForge match custom Pantone PMS Spot Inks?', a: 'Yes. We maintain an automated X-Rite ink formulation kitchen and stock the complete Pantone Matching System (PMS) library, including metallics and pastels.' }
      ]
    },

    'books': {
      id: 'books',
      badge: 'Service Specification 02',
      title: 'Hardcover & Paperback Book Manufacturing',
      lead: 'Archival Smyth-sewn clothbound hardcovers, PUR adhesive paperbacks, and full-color art monographs manufactured on automated Kolbus and Muller Martini lines.',
      heroImg: 'assets/images/services/Book Printing press.jpg',
      heroImgAlt: 'Fine Art Book Printing and Binding',
      diveTitle: 'Spine Architecture Engineered to Last Centuries',
      diveLead: 'Books are enduring cultural artifacts. We combine German bindery engineering with museum-grade substrates to manufacture volumes that open flat and endure generations.',
      diveDesc: 'Our book bindery features automated Kolbus hardbound casing lines and Muller Martini PUR adhesive binders. Whether your project calls for Smyth-sewn signature thread binding with ribbon bookmarks or French-flapped paperback novels, we guarantee extreme pull strength and aesthetic perfection.',
      specs: [
        { param: 'Binding Architectures', value: 'Smyth-Sewn Hardcover, PUR Adhesive Paperback, Lay-Flat, Saddle-Stitch' },
        { param: 'Page Extents Supported', value: '24 pages to 1,200+ pages (custom bulk calipers accommodated)' },
        { param: 'Binder Board Core', value: '1.5mm to 3.5mm Dense European Kappa Board' },
        { param: 'Cover Substrates', value: 'Italian Book Cloth, Buckram, Printed Paper Cases (PPC), Genuine Leather' },
        { param: 'Page Pull Strength', value: '> 8.5 N/cm pull rating (exceeds DIN/ISO book longevity standards)' },
        { param: 'Embellishments', value: 'Hot stamped foil spine/cover, Head & Tail Bands, Silk Ribbon Marker, Edge Gilding' }
      ],
      papers: [
        { icon: 'bi-book', title: 'Munken Premium Book Paper', desc: 'Munken Pure, Print Cream, and Lynx woodfree natural papers with high bulk factor (1.5 - 2.0) for comfortable reading.' },
        { icon: 'bi-image', title: 'Triple-Coated Silk & Art Paper', desc: '115 GSM to 200 GSM high-opacity art papers for color monographs, photography collections, and museum catalogs.' },
        { icon: 'bi-layers', title: 'Archival Bond & Bible Paper', desc: '40 GSM to 80 GSM ultra-thin opaque lightweight stocks for dictionaries, codes, and heirloom bibles.' },
        { icon: 'bi-shield-check', title: 'Endpaper Colored Boards', desc: '140 GSM to 170 GSM solid dyed Colorplan and Fedrigoni endleaf sheets reinforced at the hinge.' }
      ],
      process: [
        { step: '01', title: 'Signature Folding & Collation', desc: 'Printed 16-page and 32-page press sheets are folded on MBO precision buckle folders and gathered in sequence on automated gathering chains.' },
        { step: '02', title: 'Smyth Thread Sewing / PUR Milling', desc: 'Signatures are sewn through the spine fold with high-tensile polyester thread, or spine backs are milled and coated with ultra-flexible PUR hot-melt.' },
        { step: '03', title: 'Case Making & Spine Rounding', desc: 'Kolbus casemakers wrap greyboard cores with stamped cloth or printed jackets. Book blocks are trimmed, rounded, and backed with mull cloth.' },
        { step: '04', title: 'Casing-In & Heated Joint Forming', desc: 'The book block is married into its hardcover case. Heated pressure blades burn in deep hinge joints for smooth opening and closing.' }
      ],
      faqs: [
        { q: 'What is the difference between Smyth-sewn and PUR paperback binding?', a: 'Smyth-sewn books use thread to stitch groups of folded pages (signatures) together, allowing the book to lay completely flat without spine stress. PUR uses polyurethane reactive glue for high durability in softcover paperbacks.' },
        { q: 'Can you provide custom foil stamping and blind debossing on the cover?', a: 'Yes. We mill custom brass and magnesium dies for hot foil stamping in gold, silver, holographic, and pigmented foils on cloth, leather, and paperboard.' },
        { q: 'What is the standard production turnaround for hardcover books?', a: 'Standard production for hardcover books is 10 to 14 working days from final proof approval. Rush 7-day turnaround is available for prioritized publications.' }
      ]
    },

    'brochures': {
      id: 'brochures',
      badge: 'Service Specification 03',
      title: 'Folded Brochures & Pamphlets',
      lead: 'High-impact sales brochures, tri-folds, gate-folds, and multi-page pamphlets printed on Heidelberg sheetfed presses with razor-sharp scoring and tactile coatings.',
      heroImg: 'assets/images/services/Brochure Printing press.jpg',
      heroImgAlt: 'Folded Corporate Brochures and Marketing Collateral',
      diveTitle: 'Tactile Brand Storytelling in Every Fold',
      diveLead: 'Brochures bridge the digital divide. When an executive or customer holds a weighted, beautifully folded brochure, your message commands undivided attention.',
      diveDesc: 'We specialize in complex multi-panel folding geometries including 6-panel gatefolds, double parallel folds, and accordion maps. In-line scoring prevents toner cracking along folds, while velvety soft-touch laminates and spot gloss UV ensure visual drama.',
      specs: [
        { param: 'Folding Styles', value: 'Tri-Fold, Bi-Fold, 6-Panel Gatefold, Z-Fold, Accordion, Double Parallel, Roll Fold' },
        { param: 'Paper Weight Range', value: '130 GSM to 350 GSM Heavy Cover Stock' },
        { param: 'Folding Accuracy', value: '± 0.25 mm automated optical folder registration' },
        { param: 'Scoring Method', value: 'Rotary matrix crease wheels (eliminates paper cracking on heavy stock)' },
        { param: 'Coating Finishes', value: 'All-Over Satin Machine Varnish, Velvet Soft-Touch Matte, Raised 3D Spot UV' },
        { param: 'Bundle Packaging', value: 'Banded in 50s/100s, shrink-wrapped in moisture-barrier film' }
      ],
      papers: [
        { icon: 'bi-file-earmark-check', title: '170 GSM Silk Coated Art', desc: 'The corporate standard. Exceptional color saturation, zero glare readability, and smooth folding resilience.' },
        { icon: 'bi-stars', title: '250 GSM Heavy Velvet Cover', desc: 'A hefty, premium presentation feel that holds its structural shape when standing on desks or display racks.' },
        { icon: 'bi-sun', title: '300 GSM High-Gloss Cast Coated', desc: 'Ultra-reflective photographic brilliance ideal for automotive, jewelry, and luxury real estate presentations.' },
        { icon: 'bi-tree', title: '100% Recycled Matte Kraft', desc: 'Earth-toned sustainable stocks with tactile natural flecks for eco-friendly and organic brand narratives.' }
      ],
      process: [
        { step: '01', title: 'High-Definition Screened Print', desc: 'Heidelberg presses lay down microscopic 20-micron hybrid screen dots for photographic smooth gradients.' },
        { step: '02', title: 'Protective Inline Coating', desc: 'Immediate application of water-based sealer or scuff-resistant matte laminate prevents scuffs during folding.' },
        { step: '03', title: 'Rotary Score Matrix', desc: 'Heavyweight sheets are channel-scored along the paper grain direction to guarantee zero fiber crack on spine folds.' },
        { step: '04', title: 'High-Speed Automated Fold & Bundle', desc: 'Stahlfolder folding units execute complex folds in a single pass before robotic stacking and weather-tight bundling.' }
      ],
      faqs: [
        { q: 'How do you prevent cracking on the folded edges of thick brochures?', a: 'We employ mechanical rotary scoring dies that compress paper fibers prior to folding, always scoring parallel to the paper grain direction and applying elastic laminates.' },
        { q: 'Can I include a pocket or die-cut business card slot in my brochure?', a: 'Yes. We run Bobst die-cutters to produce integrated card slits, presentation folder pockets, and custom perforated coupon panels.' },
        { q: 'What is the standard turnaround for folded brochures?', a: 'Standard turnaround is 3 to 4 business days. Priority 48-hour rush runs are available for trade shows and product launches.' }
      ]
    },

    'calendars': {
      id: 'calendars',
      badge: 'Service Specification 04',
      title: 'Custom Desk & Wall Calendars',
      lead: 'Corporate promotional desk calendars, 12-month spiral wall calendars with thumb-cut hangers, and custom saddle-stitched planners that showcase your brand 365 days a year.',
      heroImg: 'assets/images/services/Calendar Printing press.jpg',
      heroImgAlt: 'Custom Executive Wall and Desk Calendars',
      diveTitle: 'Year-Round Brand Exposure on Executive Desks',
      diveLead: 'A desk or wall calendar is the highest ROI marketing vehicle in physical print: placed once, it commands premium desktop real estate for a full 365 days.',
      diveDesc: 'Our calendar production facility integrates high-speed twin-wire binding with automated punch and hanger insertion. Choose sturdy tent-easel cardboard bases for desk placement, or large A3/A2 wall calendars with thumb-cut wire-o loops for boardroom walls.',
      specs: [
        { param: 'Formats Available', value: 'Desk Tent Easels, Wire-O Wall Calendars with Hanger, Saddle-Stitched Booklet Calendars' },
        { param: 'Sizes Supported', value: 'Desk: 8.5"x5.5", 9"x4"; Wall: 11"x17", 12"x12", A4, A3, Oversize A2' },
        { param: 'Binding Type', value: 'Twin-loop metal Wire-O (Black, White, Silver, Gold, Bronze)' },
        { param: 'Base Core (Desk)', value: '1.8mm rigid wrapped Dutch greyboard easel tent with locking base' },
        { param: 'Leaf Paper Stock', value: '200 GSM to 300 GSM Heavy Silk or Uncoated writeable paper' },
        { param: 'Packaging', value: 'Individual clear poly-bags or custom printed gift mailer boxes' }
      ],
      papers: [
        { icon: 'bi-pencil', title: 'Writable Uncoated Offset (200 GSM)', desc: 'Smooth, non-smear uncoated stock that allows effortless note-taking with ballpoint, pencil, and fountain pens.' },
        { icon: 'bi-image', title: '250 GSM Premium Silk Art', desc: 'Vibrant color reproduction for photography landscapes and art calendars with subtle anti-glare finish.' },
        { icon: 'bi-square', title: 'Rigid Easel Greyboard Base', desc: 'Thick 800 GSM laminated stand-up triangular base that stays rigid throughout all 12 months without sagging.' },
        { icon: 'bi-stars', title: 'Foil Stamped Cover Stocks', desc: 'Heavyweight 350 GSM front cover with metallic foil branding and year typography.' }
      ],
      process: [
        { step: '01', title: 'Full-Bleed 14-Leaf Press Run', desc: 'Cover plus 12 monthly sheets and year planner backsheet printed with exact calendar date grid calibration.' },
        { step: '02', title: 'Precision Collation & Hole Punch', desc: 'Sheets are gathered in 14-page collated sets and punched with square 3:1 pitch wire binding holes.' },
        { step: '03', title: 'Twin-Wire Insertion & Hanger Placement', desc: 'Automated Renz binding machinery feeds twin-loop wire, inserts wall hanger notch, and crimps wire closed.' },
        { step: '04', title: 'Individual Packaging', desc: 'Each calendar is slip-cased into protective cellophane sleeves or flat cardboard mailers for direct drop-shipping.' }
      ],
      faqs: [
        { q: 'Can you include custom holidays and corporate events in the date grid?', a: 'Yes! We offer full date grid personalization: print company anniversaries, trade show dates, and localized public holidays.' },
        { q: 'What wire-o binding colors do you offer?', a: 'We stock standard black, brilliant white, brushed silver, antique gold, and matte bronze wire-o loops.' },
        { q: 'When should calendar orders be placed for year-end corporate gifting?', a: 'We recommend placing calendar orders between September and early November to guarantee timely delivery before holiday shutdowns.' }
      ]
    },

    'cards': {
      id: 'cards',
      badge: 'Service Specification 05',
      title: 'Luxury Business Cards & Corporate Identity',
      lead: 'Ultra-thick duplexed card stocks up to 600 GSM with hot stamped Kurz metallic foil edges, deep 3D blind debossing, and tactile cotton papers engineered for memorable handoffs.',
      heroImg: 'assets/images/services/Business Card Printing.jpg',
      heroImgAlt: 'Luxury Foil Stamped Business Cards',
      diveTitle: 'The Tactile First Impression That Closes Deals',
      diveLead: 'In executive networking, your visiting card is the tangible surrogate for your brand. A flimsy digital card is discarded; a weighty letterpress card is kept on executive desks.',
      diveDesc: 'We craft business cards on multi-ply cotton boards, Colorplan duplex stocks, and velvet soft-touch laminates. Combining Heidelberg platen foil stamping, deep sculptural embossing, and 24K gold foil edge gilding, we create business cards that command immediate respect.',
      specs: [
        { param: 'Standard Formats', value: 'US Standard (3.5" x 2"), Euro Standard (85 x 55 mm), Square (2.5" x 2.5")' },
        { param: 'Caliper / Weight', value: '350 GSM, 400 GSM, 600 GSM Duplex, 800 GSM Triplex with Color Core' },
        { param: 'Special Finishes', value: 'Hot Stamped Foil, Blind Deboss, 3D Sculpted Emboss, Raised Spot UV' },
        { param: 'Edge Treatments', value: 'Metallic Gold, Silver, Rose Gold, Holographic, or Painted Pantone Edge Gilding' },
        { param: 'Cutting Precision', value: 'Bobst precision platen die-cut (± 0.1 mm edge alignment)' },
        { param: 'Packaging Box', value: 'Complimentary heavy acrylic or luxury rigid slide-out presentation box' }
      ],
      papers: [
        { icon: 'bi-gem', title: '100% Cotton Lettra (600 GSM)', desc: 'Pure cotton fiber sheet with a lush, soft tactile cushion designed to accept deep, tactile letterpress debossing.' },
        { icon: 'bi-palette', title: 'Colorplan Duplex & Triplex', desc: 'Multi-layer laminated sheets featuring contrasting colored cores that reveal a striking colored edge stripe.' },
        { icon: 'bi-shield', title: 'Velvet Soft-Touch Artboard (400 GSM)', desc: 'Silky tactile matte laminate with high scratch resistance and fingerprint prevention.' },
        { icon: 'bi-brush', title: 'Linen & Laid Textured Paper', desc: 'Subtle woven cross-hatch surface for traditional law firms, financial institutions, and architecture studios.' }
      ],
      process: [
        { step: '01', title: 'Duplex Substrate Lamination', desc: 'Two or three layers of premium stock are wet-laminated with moisture-resistant adhesive to create rigid 600+ GSM board.' },
        { step: '02', title: 'Heidelberg Cylinder Stamping', desc: 'Heidelberg windmill and cylinder presses heat brass dies to 130°C, stamping Kurz metallic foil deep into the board.' },
        { step: '03', title: 'Optical Platen Die-Cutting', desc: 'Precision hardened steel rules trim card edges with knife-sharp perpendicular perimeters.' },
        { step: '04', title: 'Edge Sanding & Foil Gilding', desc: 'Card stacks are clamped in hydraulic vices, hand-sanded to mirror smoothness, and rolled with metallic edge foil.' }
      ],
      faqs: [
        { q: 'What is the advantage of 600 GSM double-thick cotton cards?', a: 'At 600 GSM, cards have rigid structural presence and cannot be bent easily. The cotton fibers absorb deep debossing without bruising the reverse side.' },
        { q: 'What foil colors are available for cards and edge gilding?', a: 'We offer over 40 foil shades: classic yellow gold, rose gold, copper, silver, gunmetal, matte black, holographic, and tinted edge paints.' },
        { q: 'Can you print variable names for entire executive teams in one run?', a: 'Yes! We batch corporate teams efficiently, printing common back branding in offset/foil and individual front contact details with crisp digital plate registration.' }
      ]
    },

    'packaging': {
      id: 'packaging',
      badge: 'Service Specification 06',
      title: 'Custom Packaging & Folding Cartons',
      lead: 'Custom structural die-cut folding cartons, retail display boxes, and rigid luxury gift packaging engineered for shelf impact and structural protection.',
      heroImg: 'assets/images/services/Packaging Printing press.jpg',
      heroImgAlt: 'Luxury Custom Packaging and Folding Cartons',
      diveTitle: 'Structural Packaging Engineered for Retail Dominance',
      diveLead: 'Packaging is your silent salesperson. On crowded retail shelves or in luxury unboxing moments, your box must protect the product and trigger an emotional desire.',
      diveDesc: 'We engineer retail folding cartons, magnetic closure rigid boxes, and corrugated e-commerce mailers. Our automated Bobst die-cutting and folder-gluing lines produce cartons with micro-flute rigidity, tear-resistant glue joints, and brilliant specialty coatings.',
      specs: [
        { param: 'Carton Styles', value: 'Straight Tuck End (STE), Reverse Tuck, Auto-Bottom Lock, Two-Piece Rigid, Magnetic Flip Box' },
        { param: 'Board Types', value: 'Solid Bleached Sulfate (SBS), Coated Recycled Board (CRB), Folding Boxboard (FBB), E/B-Flute Corrugated' },
        { param: 'Caliper Range', value: '14 pt (0.35 mm) to 32 pt (0.81 mm) paperboard; up to 3 mm rigid greyboard' },
        { param: 'Glue Applications', value: 'Automated 4-corner & 6-corner folding glue lines with hot-melt & cold glue' },
        { param: 'Special Treatments', value: 'Anti-scuff matte film, Soft-touch, Holographic cold foil, Window patching' },
        { param: 'Certifications', value: 'FSC Certified, ISO 9001, FDA Indirect Food Contact compliant coatings' }
      ],
      papers: [
        { icon: 'bi-box', title: 'SBS Solid Bleached Sulfate (18-24 pt)', desc: 'Ultra-white virgin fiber board with exceptional stiffness, high puncture resistance, and clean white interior.' },
        { icon: 'bi-archive', title: 'Kraft Recycled Unbleached Board', desc: 'Earthy organic brown exterior with heavy structural stiffness, perfect for sustainable natural cosmetics and craft goods.' },
        { icon: 'bi-layer-backward', title: 'Dense Rigid Kappa Board (2-3 mm)', desc: 'Heavyweight compressed greyboard wrapped in printed paper or cloth for luxury perfumes and electronics.' },
        { icon: 'bi-grid-3x3', title: 'Micro-Flute E & F Corrugated', desc: 'Slim corrugated fluting providing crush resistance for direct e-commerce shipping boxes with interior full color.' }
      ],
      process: [
        { step: '01', title: 'CAD Dieline Prototyping', desc: 'Packaging engineers generate precise CAD dielines and cut physical unprinted substrate samples on Kongsberg cutting tables.' },
        { step: '02', title: 'Wide-Format Offset Press Run', desc: 'Sheets are printed on Heidelberg XL 106 with food-safe low-migration inks and protective aqueous barrier varnish.' },
        { step: '03', title: 'Bobst Automatic Die-Cut & Crease', desc: 'High-speed Bobst platen autoplaten cuts perimeters, creases fold lines, and strips waste chads automatically.' },
        { step: '04', title: 'High-Speed Folder-Gluer Assembly', desc: 'Cartons are folded along pre-broken creases and bonded with Nordson adhesive lines before flat packing for freight.' }
      ],
      faqs: [
        { q: 'Can PrintForge help design or verify my packaging dieline?', a: 'Yes! Our prepress structural engineering team reviews your dielines for grain direction, glue flap tolerances, and tuck closures.' },
        { q: 'What is the difference between folding cartons and rigid boxes?', a: 'Folding cartons are shipped flat and popped open at the filling line, offering maximum shipping economy. Rigid boxes are pre-assembled stiff boxes (like smartphone boxes) for luxury presentations.' },
        { q: 'Are your packaging inks and coatings food-safe?', a: 'Yes. We offer Low-Migration Inks (LMI) and FDA-compliant aqueous coatings for indirect food contact, cosmetic, and confectionery packaging.' }
      ]
    },

    'magazines': {
      id: 'magazines',
      badge: 'Service Specification 07',
      title: 'Magazines, Catalogues & Periodicals',
      lead: 'High-pagination consumer publications, quarterly journals, and trade catalogues printed with rapid press turnarounds and automated binding.',
      heroImg: 'assets/images/services/Magazine Printing.jpg',
      heroImgAlt: 'Quarterly Magazines and Editorial Catalogues',
      diveTitle: 'High-Speed Editorial Excellence for Publishers',
      diveLead: 'Publications require ruthless deadline discipline and vibrant visual punch. We deliver multi-signature editorial runs with absolute fidelity.',
      diveDesc: 'We operate automated Muller Martini saddle-stitching and adhesive binding lines with inline three-knife trimming. From 32-page quarterly journals to 400-page wholesale catalogues, we handle mass distribution with subscription poly-bagging and postal sorting.',
      specs: [
        { param: 'Binding Architectures', value: 'High-speed Saddle-Stitch, PUR Perfect Bound, Square-Back Stitch' },
        { param: 'Pagination Limits', value: '8 pages to 400+ pages' },
        { param: 'Press Technology', value: '8-Color Heidelberg Speedmaster with simultaneous perfecting' },
        { param: 'Cover Treatments', value: 'Spot UV Gloss, Soft-Touch Matte, Gatefold Covers, Metallic Foils' },
        { param: 'Insertion Capabilities', value: 'Blown-in subscription cards, tipped-on product samples, belly-bands' },
        { param: 'Fulfillment', value: 'Direct mail postal presort, inkjet address labeling, pallet freight' }
      ],
      papers: [
        { icon: 'bi-file-earmark-richtext', title: '130 GSM Gloss Text', desc: 'Vibrant photo reproduction with high gloss reflection for fashion, automotive, and retail advertising pages.' },
        { icon: 'bi-file-earmark-text', title: '115 GSM Silk Art', desc: 'Smooth anti-glare reading texture favored by literary journals, architecture magazines, and corporate reports.' },
        { icon: 'bi-file-earmark-diff', title: '250 GSM Sturdy Cover Board', desc: 'Heavyweight scored cover stock with protective satin finish to withstand heavy newsstand handling.' },
        { icon: 'bi-recycle', title: 'FSC Certified Recycled Content', desc: 'Eco-certified paper options demonstrating corporate environmental responsibility to your readership.' }
      ],
      process: [
        { step: '01', title: 'Preflight & Imposition Rip', desc: 'Kodak Prinergy workflow automatically arranges editorial pages into 16-page and 32-page press impositions.' },
        { step: '02', title: 'High-Speed Web & Sheetfed Run', desc: 'Signatures are printed simultaneously on front and back with closed-loop spectrophotometer ink calibration.' },
        { step: '03', title: 'Automated Saddle-Stitching / PUR', desc: 'Muller Martini gatherer-stitchers feed signatures, drive dual wire staples through the spine, and trim 3 sides.' },
        { step: '04', title: 'Mailing & Palletized Freight', desc: 'Magazines are inkjet addressed, poly-wrapped, and sorted by postal zip code for rapid distribution.' }
      ],
      faqs: [
        { q: 'What is the maximum page count for saddle-stitched magazines?', a: 'Saddle stitching is ideal up to 80-96 pages depending on paper weight. Above 96 pages, we recommend PUR square-back perfect binding to prevent spine bulge.' },
        { q: 'Can you handle mailing and individual subscriber distribution?', a: 'Yes! Our mail facility handles CASS-certified postal presorting, inkjet addressing, and drop-shipment directly to regional postal hubs.' },
        { q: 'Can we include a pull-out foldout centerfold?', a: 'Yes, we produce 6-panel and 8-panel gatefold inserts and pull-out map centerfolds.' }
      ]
    },

    'finishes': {
      id: 'finishes',
      badge: 'Service Specification 08',
      title: 'Foil Stamping, Embossing & Luxury Finishes',
      lead: 'Metallic foil stamping, sculptural 3D blind embossing, spot UV varnishes, and custom die-cutting that transform physical paper into sensory masterworks.',
      heroImg: 'assets/images/services/Foil Stamping & Finishes.jpg',
      heroImgAlt: 'Hot Stamped Foil and Blind Embossing',
      diveTitle: 'The Tactile Dimension: Where Ink Meets Sculpture',
      diveLead: 'True luxury is tactile. When light catches metallic foil or fingertips graze multi-level embossing, your printed work creates an indelible emotional impression.',
      diveDesc: 'We operate heavy-duty Kluge and Heidelberg platen stamping presses utilizing engraved brass and photopolymer dies. Our finishing lab produces multi-tone metallic foils, blind sculptured embossing, velvet touch laminates, and edge gilding.',
      specs: [
        { param: 'Foil Types', value: 'Kurz German Metallic, Matte Pigment, Holographic, Pearl, Clear Gloss Foil' },
        { param: 'Embossing Styles', value: 'Blind Emboss, Blind Deboss, Multi-Level Sculpted 3D, Combination Foil-Emboss' },
        { param: 'Die Materials', value: 'CNC-Milled Brass (highest longevity & detail) and Etched Magnesium' },
        { param: 'Spot UV Technology', value: 'Precision screen printed UV (up to 50 microns raised tactile build-up)' },
        { param: 'Registration Tolerance', value: '± 0.2 mm optical registration between print and foil dies' },
        { param: 'Substrate Compatibility', value: 'Papers from 150 GSM to 800+ GSM, linen cloth, leather, synthetic films' }
      ],
      papers: [
        { icon: 'bi-gem', title: 'Kurz German Metallic Foils', desc: 'Over 60 shades of brilliant gold, rose gold, copper, silver, and iridescent holographic hot stamping foils.' },
        { icon: 'bi-layers-half', title: 'Multi-Level Sculptured Brass Dies', desc: 'Custom CNC sculpted 3D dies creating realistic physical depth on crests, monograms, and architectural artwork.' },
        { icon: 'bi-droplet', title: 'Raised Tactile Spot UV', desc: 'Dimensional clear polymer gloss applied selectively to logos and textures, creating a glass-like tactile feel.' },
        { icon: 'bi-stars', title: 'Liquid Metal Cold Foiling', desc: 'Inline cold foil application allowing halftone foil gradients and overprinting with full color inks.' }
      ],
      process: [
        { step: '01', title: 'Die Engraving & Make-Ready', desc: 'Vector artwork is CNC-milled into solid brass blocks. Counter-dies are cast with fiberglass make-ready paste.' },
        { step: '02', title: 'Heated Impression Calibration', desc: 'Platen presses heat the brass die to 135°C, calibrating pneumatic pressure up to 40 tons of force.' },
        { step: '03', title: 'Precision Foil Release & Transfer', desc: 'Foil ribbon is pulled across the substrate; heat and pressure activate the thermal release layer permanently.' },
        { step: '04', title: 'Quality Inspection Under Spectral Light', desc: 'Finishing artisans inspect every sheet under calibrated light tables to guarantee crisp edges without pinholing.' }
      ],
      faqs: [
        { q: 'What is the difference between brass and magnesium dies?', a: 'Magnesium dies are chemically etched for quick, flat foil runs. Brass dies are hand/CNC milled with multi-level curved profiles for 3D sculptured embossing.' },
        { q: 'Can you overprint with process ink on top of metallic foil?', a: 'Yes! Our inline cold foil system applies metallic foil first, allowing our Heidelberg presses to print full color inks over the foil to produce any metallic color under the sun.' },
        { q: 'Will heavy embossing show through on the back of the page?', a: 'Embossing pushes paper fibers upward, leaving a debossed impression on the reverse. For zero back-show, we duplex a second sheet of paper over the reverse side.' }
      ]
    },

    'posters': {
      id: 'posters',
      badge: 'Service Specification 09',
      title: 'Fine Art & Commercial Poster Printing',
      lead: 'Large format sheetfed lithographic posters up to 28 x 40 inches (B1 format) with UV-cured inks, screen-printed protective varnish, and tear-resistant synthetic papers.',
      heroImg: 'assets/images/services/Poster Printing.jpg',
      heroImgAlt: 'Fine Art and Cinema Posters Printing',
      diveTitle: 'Impactful Architectural Scale & Cinematic Color Range',
      diveLead: 'From limited-run movie premiere one-sheets to retail window displays and museum fine art reproductions, large format posters demand uncompromising dynamic range.',
      diveDesc: 'We print large format posters on our Speedmaster XL 106 press utilizing expanded color gamut (ECG) inks and screen-printed protective varnishes that resist scuffing, UV fading, and environmental humidity.',
      specs: [
        { param: 'Maximum Sheet Format', value: '720 x 1020 mm (B1 size / 28 x 40 inches)' },
        { param: 'Resolution & Halftone Screen', value: 'Sublima 280 LPI micro-dot hybrid screening' },
        { param: 'Ink Formulation', value: 'High-pigment UV litho inks with 10-year indoor lightfast rating' },
        { param: 'Surface Protection', value: 'Full-flood matte/gloss UV coating, soft-touch lamination, or anti-glare finish' },
        { param: 'Substrates Supported', value: '170 to 350 GSM Silk Art, Yupo Synthetic Waterproof Paper, Backlit Film' },
        { param: 'Trimming & Packaging', value: 'Precision laser trimming, individual rolled plastic sleeves or flat pallet packs' }
      ],
      papers: [
        { icon: 'bi-image', title: '250 GSM Premium Silk Art', desc: 'Heavyweight archival coated paper engineered for deep blacks, high contrast, and zero edge curl.' },
        { icon: 'bi-droplet-half', title: 'Yupo Synthetic Waterproof Paper', desc: '100% recyclable tree-free polypropylene sheet that is chemical-resistant, waterproof, and tear-proof.' },
        { icon: 'bi-brightness-high', title: 'Backlit Translucent Film', desc: 'Translucent polyester film optimized for illuminated lightboxes, airport displays, and cinema boards.' },
        { icon: 'bi-palette', title: 'Museum 100% Cotton Rag', desc: 'Acid-free archival fine art paper with textured watercolor feel for limited artist editions.' }
      ],
      process: [
        { step: '01', title: 'High-Res Optical Proofing', desc: 'Epson Pro 9900 color proofing calibrated to Fogra 51 ensures 99.8% Pantone accuracy before plate burning.' },
        { step: '02', title: 'Sheetfed High-Speed Litho Press', desc: 'Speedmaster XL 106 runs up to 15,000 B1 sheets/hour with real-time closed-loop spectral density tracking.' },
        { step: '03', title: 'Inline Aqueous / UV Curing', desc: 'Sheets pass through instant UV curing or protective aqueous sealers to eliminate ink transfer and fingerprinting.' },
        { step: '04', title: 'Automated Guillotine Trim & Rolling', desc: 'Polar computer-controlled guillotines trim edges to 0.1mm tolerance. Posters rolled with kraft slip-sheets or flat-packed.' }
      ],
      faqs: [
        { q: 'What is the maximum poster size you can print?', a: 'Our sheetfed presses handle up to B1 format (28 × 40 inches / 720 × 1020 mm). For larger billboard displays, we utilize our grand format UV flatbed printers.' },
        { q: 'Will the posters fade under retail fluorescent or sunlight?', a: 'We utilize lightfast, UV-cured inks formulated with automotive-grade pigments that resist fading for 10+ years indoors and 2+ years in direct retail sunlight.' },
        { q: 'Can you provide individual rolling and retail packaging?', a: 'Yes! We offer automated rolling with protective acid-free kraft paper, plastic shrink-tubing, and custom barcode labeling for immediate retail distribution.' }
      ]
    },

    'wedding': {
      id: 'wedding',
      badge: 'Service Specification 10',
      title: 'Artisan Wedding & Luxury Social Stationery',
      lead: 'Couture invitation suites featuring handmade deckled cotton boards, translucent vellum overlays, letterpress typography, hot metallic foil stamping, and custom wax seals.',
      heroImg: 'assets/images/services/Wedding Stationery.jpg',
      heroImgAlt: 'Luxury Wedding Invitation and Social Stationery Suites',
      diveTitle: 'Handcrafted Heirlooms of Tactile Romance',
      diveLead: 'An invitation is the first tactile touchpoint of a milestone celebration. We blend artisanal European press techniques with timeless papercraft.',
      diveDesc: 'Our dedicated stationery atelier produces bespoke wedding invitation suites, gala event programs, and milestone keepsakes using 600 GSM double-thick cotton boards, vintage Heidelberg windmill presses, sculpted brass dies, and hand-applied edge leafing.',
      specs: [
        { param: 'Standard Formats', value: 'A7 (5 x 7 in), A9, Square (6 x 6 in), Custom die-cut arch and wave shapes' },
        { param: 'Paper Stocks', value: '600 GSM Cotton, 450 GSM Heavy Linen, Hand-Torn Deckled Edge Paper, Translucent Vellum' },
        { param: 'Printing Techniques', value: 'Deep Blind Deboss Letterpress, Hot Gold Foil, Raised Thermography, Full Color Litho' },
        { param: 'Enclosure Accessories', value: 'RSVP Cards, Detail Enclosures, Translucent Belly Bands, Silk Ribbons, Wax Seals' },
        { param: 'Envelopes', value: 'Euro-Flap Pointed Envelopes with custom printed liners and calligraphy address printing' },
        { param: 'Edge Finishing', value: '24K Mirror Gold Foil Edge Gilding, Beveled Edges, Hand-Painted Color Wash' }
      ],
      papers: [
        { icon: 'bi-gem', title: '600 GSM Crane Lettra 100% Cotton', desc: 'Ultra-plush archival cotton board engineered to take deep, pillow-soft letterpress impressions without cracking.' },
        { icon: 'bi-layers', title: 'Hand-Torn Deckled Edge Paper', desc: 'Artisanal papers hand-crafted in Italian paper mills with organic feathered deckled edges on all four sides.' },
        { icon: 'bi-file-earmark-medical', title: '140 GSM Translucent Vellum', desc: 'Cloudy, frosted architectural vellum overlays providing an ethereal veil over typography and floral designs.' },
        { icon: 'bi-envelope-heart', title: 'Luxury Euro-Flap Envelopes', desc: 'Deep V-shaped pointed flap envelopes made from 180 GSM Colorplan papers with foil-stamped return addresses.' }
      ],
      process: [
        { step: '01', title: 'Design Consultation & Digital Proofing', desc: 'Our stationery art director reviews typography, monogram vector geometry, and paper weights with full 3D mockups.' },
        { step: '02', title: 'Letterpress & Hot Foil Impression', desc: 'Heidelberg Windmill platen presses impress custom photopolymer or brass dies with up to 30 tons of tactile pressure.' },
        { step: '03', title: 'Hand-Assembly & Ribbon Binding', desc: 'Artisans hand-assemble multi-piece suites, wrapping them in translucent vellum wraps tied with raw silk habotai ribbons.' },
        { step: '04', title: 'Custom Wax Seal & White-Glove Packaging', desc: 'Custom monogram wax seals hand-stamped onto each suite before white-glove boxed packaging with tissue wraps.' }
      ],
      faqs: [
        { q: 'How many pieces are typically included in a full wedding invitation suite?', a: 'A standard suite includes the main 5x7 invitation card, matching Euro-flap mailing envelope, RSVP reply card with addressed return envelope, and an optional reception/details card.' },
        { q: 'Can you print guest names and addresses in custom calligraphy fonts?', a: 'Yes! We offer automated digital white ink or metallic ink variable address printing directly on dark or colored envelopes.' },
        { q: 'What is the lead time for bespoke foil-stamped wedding suites?', a: 'Custom stationery suites require 7 to 10 working days for production and hand assembly from proof approval. Express 5-day crafting is available upon request.' }
      ]
    }
  };

  // Catalog of Pre-Configured Pricing Packages per Service Discipline
  const servicePricingCatalog = {
    'offset': [
      {
        title: 'Commercial Pallet Run',
        tag: 'XL 106 Press',
        badge: 'Regional Freight',
        img: 'assets/images/pricing/Regional Freight.jpg',
        price: '$2,900',
        unit: '/ 10k units',
        desc: '10,000 to 25,000 sheetfed impressions for regional distribution.',
        features: ['Speedmaster XL 106 18k Imp/Hr Press Run', 'Prinect Inpress Control 3 Spectral D50 QA', 'Banded & Heat-Shrunk Pallet Shipping'],
        bookUrl: 'booking.html?type=bulk'
      },
      {
        title: 'Enterprise Press Contract',
        tag: 'Factory Shift',
        badge: 'Enterprise Agreement',
        img: 'assets/images/pricing/Enterprise Agreement.jpg',
        price: '$11,500+',
        unit: '/ 100k units',
        desc: '100,000+ units, seasonal catalog runs, and dedicated press time slots.',
        features: ['Dedicated Press Shift Reservation in NY', 'Client On-Site Press Pass Inspection Lounge', '30 Days Free Warehousing & JIT Pulls'],
        bookUrl: 'booking.html?type=bulk'
      },
      {
        title: 'Commercial Collateral Run',
        tag: 'Web & Sheetfed',
        badge: 'Essential Trade',
        img: 'assets/images/pricing/Essential Trade.jpg',
        price: '$1,850',
        unit: '/ 5k units',
        desc: 'High-speed commercial print runs for marketing mailers and collateral.',
        features: ['Full Color Double-Sided (4/4 CMYK)', '150 GSM Coated Silk / Gloss Stock', 'Automated Machine Crease & Trimming'],
        bookUrl: 'booking.html?type=brochure'
      }
    ],

    'books': [
      {
        title: 'Saddle-Stitch Booklets',
        tag: 'Stapled Mag',
        badge: 'Chapbook & Mag',
        img: 'assets/images/pricing/Chapbook & Mag.jpg',
        price: '$450',
        unit: '/ 500 books',
        desc: 'Magazines, quarterly reports, poetry chapbooks, and comic books.',
        features: ['24 to 48 Pages (Up to 8.5" × 11")', '300 GSM Cover + 130 GSM Silk Text', 'Dual Precision Spine Staples'],
        bookUrl: 'booking.html?type=book'
      },
      {
        title: 'PUR Paperback Perfect Bound',
        tag: 'Kolbus PUR Spine',
        badge: 'Trade Paperback',
        img: 'assets/images/pricing/Trade Paperback.jpg',
        price: '$1,250',
        unit: '/ 1k books',
        desc: 'Industry-standard trade paperbacks with flexible, ultra-strong PUR adhesive.',
        features: ['96 to 350 Pages (Standard Novel Sizes)', 'Kolbus Automated PUR Adhesive Line', '350 GSM Scuff-Resistant Matte Cover'],
        bookUrl: 'booking.html?type=book'
      },
      {
        title: 'Smyth-Sewn Hardcover',
        tag: 'Lays Flat',
        badge: 'Heirloom Edition',
        img: 'assets/images/pricing/Heirloom Edition.jpg',
        price: '$2,850',
        unit: '/ 1k books',
        desc: 'Archival collector editions, coffee table art books, and yearbooks.',
        features: ['3mm Dense European Binder Board', 'Smyth-Sewn Thread Sections (Lays Flat)', 'Italian Bookcloth or Foil Stamped Jacket'],
        bookUrl: 'booking.html?type=book'
      }
    ],

    'brochures': [
      {
        title: 'Standard Tri-Fold / Bi-Fold',
        tag: 'Tri-Fold 6P',
        badge: 'Essential Trade',
        img: 'assets/images/pricing/Essential Trade.jpg',
        price: '$160',
        unit: '/ 1k units',
        desc: 'Ideal for trade shows, mailers, product overviews, and menus.',
        features: ['8.5" × 11" Flat (Folded to 3.66" × 8.5")', '150 GSM Coated Silk / Gloss Paper', 'Automated Machine Score & Precision Fold'],
        bookUrl: 'booking.html?type=brochure'
      },
      {
        title: '6-Panel Gatefold Heavy Art',
        tag: 'Double Gatefold',
        badge: 'Executive Reveal',
        img: 'assets/images/pricing/Executive Reveal.jpg',
        price: '$275',
        unit: '/ 1k units',
        desc: 'Dramatic double-door reveal folding for luxury real estate and tech.',
        features: ['6-Panel Double Gatefold Format', '200 GSM Heavyweight Silk Art Paper', 'Spot UV Gloss on Center Feature Panel'],
        bookUrl: 'booking.html?type=brochure'
      },
      {
        title: '8-Page Booklet Brochure',
        tag: 'Catalog 8P',
        badge: 'Catalog Edition',
        img: 'assets/images/pricing/Catalog Edition.jpg',
        price: '$420',
        unit: '/ 1k units',
        desc: 'Stapled saddle-stitched multi-page catalog brochure for deep narratives.',
        features: ['8 Full Content Pages (A4 or Letter)', '250 GSM Sturdy Cover + 150 GSM Text', 'Dual Heavy-Gauge Black Wire Stitching'],
        bookUrl: 'booking.html?type=brochure'
      }
    ],

    'calendars': [
      {
        title: 'Deluxe Wall Calendar',
        tag: 'Wire-O Hanger',
        badge: 'Wall Edition',
        img: 'assets/images/pricing/Catalog Edition.jpg',
        price: '$890',
        unit: '/ 500 units',
        desc: '12-month full color wall calendars with thumb-cut wire-o hangers.',
        features: ['12 Months + Front/Back Heavy Covers', '250 GSM Heavy Gloss Coated Art', 'Precision Wire-O Binding with Center Notch'],
        bookUrl: 'booking.html?type=brochure'
      },
      {
        title: 'Executive Desk Tent',
        tag: 'Self-Standing',
        badge: 'Corporate Desk',
        img: 'assets/images/pricing/Essential Trade.jpg',
        price: '$580',
        unit: '/ 500 units',
        desc: 'Compact easel desk calendar on 350 GSM heavy cardstock.',
        features: ['Rigid Triangle Easel Stand Base', 'Double-Sided 4/4 Full Color CMYK', 'Matte Silk Anti-Glare Finish'],
        bookUrl: 'booking.html?type=visiting-card'
      },
      {
        title: 'Folio Hardcover Planner',
        tag: 'Gold Foil Deboss',
        badge: 'Heirloom Folio',
        img: 'assets/images/pricing/Heirloom Edition.jpg',
        price: '$1,450',
        unit: '/ 500 units',
        desc: 'Hardcover clothbound annual planners with debossed foil monograms.',
        features: ['Dense European Hardcover Binding', '100 GSM Munken Cream Writing Paper', 'Silk Bookmark Ribbon & Foil Spine'],
        bookUrl: 'booking.html?type=book'
      }
    ],

    'cards': [
      {
        title: 'Standard Corporate',
        tag: 'Offset Silk',
        badge: 'Starter Run',
        img: 'assets/images/pricing/Standard Corporate.jpg',
        price: '$24',
        unit: '/ 500 cards',
        desc: 'Clean, professional everyday visiting cards for teams and agencies.',
        features: ['350 GSM Silk Art Matte Board', 'Full Color Double-Sided (4/4 CMYK)', 'Precision Knife Edge Trim (3.5" × 2")'],
        bookUrl: 'booking.html?type=visiting-card'
      },
      {
        title: 'Velvet Soft-Touch & Spot UV',
        tag: 'Velvet Tactile',
        badge: 'Executive Edition',
        img: 'assets/images/pricing/Executive Edition.jpg',
        price: '$49',
        unit: '/ 500 cards',
        desc: 'Ultra-luxurious velvety tactile coating with raised clear gloss elements.',
        features: ['400 GSM Heavyweight Premium Core', 'Dual-Sided Velvet Touch Silk Lamination', 'Raised 3D Spot UV on Typography'],
        bookUrl: 'booking.html?type=visiting-card'
      },
      {
        title: 'Cotton Letterpress & Foil',
        tag: 'Kurz Gold Foil',
        badge: 'Letterpress Edition',
        img: 'assets/images/pricing/Letterpress Edition.jpg',
        price: '$89',
        unit: '/ 500 cards',
        desc: 'Double-thick cotton board stamped with metallic Kurz German foil.',
        features: ['600 GSM 100% Recycled Cotton Board', 'Hot Stamped Metallic Gold / Silver Foil', 'Deep Tactile Blind Deboss Texture'],
        bookUrl: 'booking.html?type=visiting-card'
      }
    ],

    'packaging': [
      {
        title: 'Retail Packaging Boxes',
        tag: 'Bobst SP 102',
        badge: 'Industrial Cartons',
        img: 'assets/images/pricing/Industrial Cartons.jpg',
        price: '$5,800',
        unit: '/ 50k units',
        desc: 'Folding cartons, auto-bottom boxes, and retail counter displays.',
        features: ['Up to 450 GSM Solid Bleached Sulfate', 'Bobst SP 102 Autoplaten Die-Cut', 'Food & Pharma Safe Low-Migration Inks'],
        bookUrl: 'booking.html?type=bulk'
      },
      {
        title: 'Luxury Clamshell Packaging',
        tag: 'Rigid Box',
        badge: 'Luxury Clamshell',
        img: 'assets/images/pricing/Royal Folio.jpg',
        price: '$3,400',
        unit: '/ 1k units',
        desc: 'Custom rigid setup presentation boxes wrapped in velvet or metallic papers.',
        features: ['Padded Presentation Gift Box Core', 'Hidden Magnetic Closure System', 'Precision Cut High-Density EVA Foam Tray'],
        bookUrl: 'booking.html?type=wedding-card'
      },
      {
        title: 'Commercial Pallet Run',
        tag: 'XL 106 Press',
        badge: 'Regional Freight',
        img: 'assets/images/pricing/Regional Freight.jpg',
        price: '$2,900',
        unit: '/ 10k units',
        desc: 'Mass-produced carton blanks ready for automated high-speed packaging.',
        features: ['Speedmaster XL 106 18k Imp/Hr Press Run', 'Spectral D50 Color Quality Assurance', 'Banded & Shrink-Wrapped Pallets'],
        bookUrl: 'booking.html?type=bulk'
      }
    ],

    'magazines': [
      {
        title: 'Saddle-Stitched Periodical',
        tag: 'Stapled Mag',
        badge: 'Chapbook & Mag',
        img: 'assets/images/pricing/Chapbook & Mag.jpg',
        price: '$450',
        unit: '/ 500 copies',
        desc: 'Magazines, quarterly reports, poetry chapbooks, and comic books.',
        features: ['24 to 48 Pages (Up to 8.5" × 11")', '300 GSM Cover + 130 GSM Silk Text', 'Dual Precision Spine Staples'],
        bookUrl: 'booking.html?type=book'
      },
      {
        title: 'Trade Paperback Review',
        tag: 'PUR Spine',
        badge: 'Trade Paperback',
        img: 'assets/images/pricing/Trade Paperback.jpg',
        price: '$1,250',
        unit: '/ 1k copies',
        desc: 'Thick spine quarterly journals with flexible square PUR adhesive binding.',
        features: ['96 to 350 Pages (Standard Review Sizes)', 'Kolbus Automated PUR Spine Line', '350 GSM Scuff-Resistant Matte Cover'],
        bookUrl: 'booking.html?type=book'
      },
      {
        title: 'Showcase Catalog Issue',
        tag: 'Catalog 8P',
        badge: 'Catalog Edition',
        img: 'assets/images/pricing/Catalog Edition.jpg',
        price: '$420',
        unit: '/ 1k units',
        desc: 'Stapled multi-page showcase catalog with rich photographic color depth.',
        features: ['8 to 32 Content Pages (A4 or Letter)', '250 GSM Heavy Cover + 150 GSM Text', 'Velvet Soft-Touch Cover Lamination'],
        bookUrl: 'booking.html?type=brochure'
      }
    ],

    'finishes': [
      {
        title: 'Hot Foil Letterpress',
        tag: 'Kurz Gold Foil',
        badge: 'Letterpress Edition',
        img: 'assets/images/pricing/Letterpress Edition.jpg',
        price: '$89',
        unit: '/ 500 cards',
        desc: 'Double-thick cotton board stamped with metallic Kurz German foil.',
        features: ['600 GSM 100% Recycled Cotton Board', 'Hot Stamped Metallic Gold / Silver Foil', 'Deep Tactile Blind Deboss Texture'],
        bookUrl: 'booking.html?type=visiting-card'
      },
      {
        title: 'Regal Foil & Blind Emboss',
        tag: 'Sculpted 3D Crest',
        badge: 'Couture Suite',
        img: 'assets/images/pricing/Couture Suite.jpg',
        price: '$285',
        unit: '/ 100 sets',
        desc: 'Intricate hot stamped metallic foils with raised sculptural embossing.',
        features: ['450 GSM Heavy Cotton Soft-White Stock', 'Multi-Tone Gold / Copper / Silver Foil', 'Sculpted 3D Crest Embossing'],
        bookUrl: 'booking.html?type=wedding-card'
      },
      {
        title: 'Spot UV & Soft-Touch Reveal',
        tag: 'Double Gatefold',
        badge: 'Executive Reveal',
        img: 'assets/images/pricing/Executive Reveal.jpg',
        price: '$275',
        unit: '/ 1k units',
        desc: 'Dramatic double-door reveal folding with spot gloss UV contrast.',
        features: ['6-Panel Double Gatefold Format', '200 GSM Heavyweight Silk Art Paper', 'Spot UV Gloss on Center Feature Panel'],
        bookUrl: 'booking.html?type=brochure'
      }
    ],

    'posters': [
      {
        title: 'Essential Trade Poster Run',
        tag: 'Tri-Fold / Flat',
        badge: 'Essential Trade',
        img: 'assets/images/pricing/Essential Trade.jpg',
        price: '$160',
        unit: '/ 1k units',
        desc: 'Commercial promotional posters on high-opacity coated gloss paper.',
        features: ['150 GSM Coated Silk / Gloss Stock', 'Full Color Double-Sided (4/4 CMYK)', 'Precision Guillotine Flat Edge Trim'],
        bookUrl: 'booking.html?type=brochure'
      },
      {
        title: 'Fine Art & Gallery Print',
        tag: 'Archival Coated',
        badge: 'Gallery Edition',
        img: 'assets/images/pricing/Catalog Edition.jpg',
        price: '$420',
        unit: '/ 1k units',
        desc: 'Art gallery exhibition posters with rich pigments and velvety finish.',
        features: ['250 GSM Heavyweight Art Board', 'High-Definition Stochastic Screening', 'Velvet Matte Non-Reflective Coating'],
        bookUrl: 'booking.html?type=brochure'
      },
      {
        title: 'Mounted Display Plaque',
        tag: 'Textured Linen',
        badge: 'Display Board',
        img: 'assets/images/pricing/Classic Elegance Suite.jpg',
        price: '$145',
        unit: '/ 100 sets',
        desc: 'Rigid display signage and mounted presentation boards for retail.',
        features: ['Dense European Display Board Core', 'Linen-Textured Archival Face', 'Euro-Flap Protection Envelopes Included'],
        bookUrl: 'booking.html?type=wedding-card'
      }
    ],

    'wedding': [
      {
        title: 'Classic Elegance Suite',
        tag: 'Textured Linen',
        badge: 'Essential Suite',
        img: 'assets/images/pricing/Classic Elegance Suite.jpg',
        price: '$145',
        unit: '/ 100 sets',
        desc: 'Essential wedding invitation package with matching custom envelopes.',
        features: ['5" × 7" Main Card on 350 GSM Linen', 'Matching RSVP Card + Detail Enclosure', 'Premium Euro-Flap Envelopes Included'],
        bookUrl: 'booking.html?type=wedding-card'
      },
      {
        title: 'Regal Foil & Blind Emboss',
        tag: 'Sculpted 3D Crest',
        badge: 'Couture Suite',
        img: 'assets/images/pricing/Couture Suite.jpg',
        price: '$285',
        unit: '/ 100 sets',
        desc: 'Intricate hot stamped metallic foils with raised sculptural embossing.',
        features: ['450 GSM Heavy Cotton Soft-White Stock', 'Multi-Tone Gold, Rose Gold, or Copper Foil', 'Sculpted 3D Crest Embossing'],
        bookUrl: 'booking.html?type=wedding-card'
      },
      {
        title: 'Royal Velvet Boxed Heirloom',
        tag: 'Velvet Clamshell',
        badge: 'Royal Folio',
        img: 'assets/images/pricing/Royal Folio.jpg',
        price: '$490',
        unit: '/ 100 sets',
        desc: 'Hardcover silk velvet folio boxes for VIP gala and destination weddings.',
        features: ['Padded Velvet Clamshell Presentation Box', '600 GSM Ultra-Thick Letterpress Plaque', '24K Mirror Gold Foil Edge Gilding'],
        bookUrl: 'booking.html?type=wedding-card'
      }
    ]
  };

  document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service') || 'offset';

    renderService(serviceParam);
    bindSidebarLinks();

    // Setup Download Guides Feedback
    document.querySelectorAll('.pf-download-card').forEach(card => {
      card.addEventListener('click', function () {
        const pill = this.querySelector('.pf-download-btn-pill');
        if (pill) {
          const originalHTML = pill.innerHTML;
          pill.innerHTML = '<i class="bi bi-check-lg"></i>';
          pill.style.background = '#28a745';
          pill.style.color = '#fff';
          setTimeout(() => {
            pill.innerHTML = originalHTML;
            pill.style.background = '';
            pill.style.color = '';
          }, 2500);
        }
      });
    });
  });

  function renderService(serviceKey) {
    const data = servicesData[serviceKey] || servicesData['offset'];

    // Update document title
    document.title = `${data.title} – PrintForge Service Details`;

    // 1. Hero Elements
    const badgeEl = document.getElementById('sd-badge');
    const titleEl = document.getElementById('sd-title');
    const leadEl = document.getElementById('sd-lead');
    const heroImgEl = document.getElementById('sd-hero-img');

    if (badgeEl) badgeEl.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (leadEl) leadEl.textContent = data.lead;
    if (heroImgEl) {
      heroImgEl.src = data.heroImg;
      heroImgEl.alt = data.heroImgAlt;
    }

    // 2. Engineering Deep Dive
    const diveTitleEl = document.getElementById('sd-dive-title');
    const diveLeadEl = document.getElementById('sd-dive-lead');
    const diveDescEl = document.getElementById('sd-dive-desc');

    if (diveTitleEl) diveTitleEl.textContent = data.diveTitle;
    if (diveLeadEl) diveLeadEl.textContent = data.diveLead;
    if (diveDescEl) diveDescEl.textContent = data.diveDesc;

    // 3. Technical Specifications Table
    const specsTbody = document.querySelector('#sd-specs-table tbody');
    if (specsTbody && data.specs) {
      specsTbody.innerHTML = data.specs.map(s => `
        <tr>
          <td class="fw-semibold">${s.param}</td>
          <td>${s.value}</td>
        </tr>
      `).join('');
    }

    // 4. Papers Grid
    const papersGrid = document.getElementById('sd-papers-grid');
    if (papersGrid && data.papers) {
      papersGrid.innerHTML = data.papers.map(p => `
        <div class="col-md-6 d-flex">
          <div class="p-3 border rounded bg-white w-100 h-100 d-flex flex-column pf-feature-box" style="background-color: var(--pf-surface) !important;">
            <h5 class="h6 fw-bold text-danger mb-2 d-flex align-items-center gap-2 pf-box-title">
              <i class="bi ${p.icon} fs-5 pf-box-icon"></i> <span>${p.title}</span>
            </h5>
            <p class="small text-secondary mb-0 flex-grow-1">${p.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // 5. Process Steps
    const processSteps = document.getElementById('sd-process-steps');
    if (processSteps && data.process) {
      processSteps.innerHTML = data.process.map(pr => `
        <div class="col-md-6 col-lg-3">
          <div class="p-3 border rounded bg-white h-100" style="background-color: var(--pf-surface) !important;">
            <div class="display-6 fw-bold text-danger mb-2 opacity-50">${pr.step}</div>
            <h5 class="h6 fw-bold mb-2">${pr.title}</h5>
            <p class="small text-secondary mb-0">${pr.desc}</p>
          </div>
        </div>
      `).join('');
    }


    // 5.5. Render Pricing Packages with local images and perfect alignment
    const pricingContainer = document.getElementById('sd-pricing-cards-container');
    const pricingItems = servicePricingCatalog[serviceKey] || servicePricingCatalog['offset'];
    if (pricingContainer && pricingItems) {
      pricingContainer.innerHTML = pricingItems.map(item => `
        <div class="col-md-6 col-lg-4">
          <div class="pf-box-card h-100">
            <div class="pf-box-img-wrap">
              <span class="pf-box-img-tag">${item.tag}</span>
              <img src="${item.img}" alt="${item.title}" class="pf-box-img" loading="lazy">
            </div>
            <span class="pf-box-tier-badge">${item.badge}</span>
            <h4>${item.title}</h4>
            <p class="pf-box-desc">${item.desc}</p>
            <div class="pf-box-price-row">
              <div class="pf-box-price">${item.price}</div>
              <span class="pf-box-unit-pill">${item.unit}</span>
            </div>
            <ul class="pf-box-features">
              ${item.features.map(f => `<li><i class="bi bi-check-circle-fill text-success"></i> ${f}</li>`).join('')}
            </ul>
            <a href="${item.bookUrl}" class="pf-btn pf-btn-primary w-100 mt-auto">Book Package <i class="bi bi-arrow-right ms-1"></i></a>
          </div>
        </div>
      `).join('');

      if (typeof window.pfInitTagTyping === 'function') {
        window.pfInitTagTyping();
      }
    }

    // 6. FAQs Accordion
    const faqContainer = document.getElementById('serviceFaqAccordion');
    if (faqContainer && data.faqs) {
      faqContainer.innerHTML = data.faqs.map((f, idx) => `
        <div class="accordion-item mb-2 border rounded" style="background-color: var(--pf-surface) !important;">
          <h2 class="accordion-header" id="headingFaq${idx}">
            <button class="accordion-button ${idx !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq${idx}" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="collapseFaq${idx}" style="background-color: var(--pf-surface) !important; color: var(--pf-text-headings) !important;">
              ${f.q}
            </button>
          </h2>
          <div id="collapseFaq${idx}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" aria-labelledby="headingFaq${idx}" data-bs-parent="#serviceFaqAccordion">
            <div class="accordion-body small text-secondary">
              ${f.a}
            </div>
          </div>
        </div>
      `).join('');
    }

    // 7. Update Active Sidebar Link
    const sidebarLinks = document.querySelectorAll('#sd-sidebar-list a');
    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.includes(`service=${serviceKey}`) || (serviceKey === 'offset' && href.endsWith('service-details.html'))) {
        link.className = 'fw-bold text-danger';
      } else {
        link.className = 'text-secondary';
      }
    });

    // Scroll smoothly to top of hero
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function bindSidebarLinks() {
    const sidebarList = document.getElementById('sd-sidebar-list');
    if (!sidebarList) return;

    sidebarList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.includes('service=')) {
          e.preventDefault();
          const targetService = href.split('service=')[1];
          if (targetService) {
            history.pushState(null, '', `service-details.html?service=${targetService}`);
            renderService(targetService);
          }
        }
      });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function () {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get('service') || 'offset';
      renderService(serviceParam);
    });
  }

})();
