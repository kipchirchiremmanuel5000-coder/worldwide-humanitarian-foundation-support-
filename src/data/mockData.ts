import { 
  ProgrammeItem, 
  HumanitarianApplication, 
  DonationRecord,
  RegistrationFeePayment,
  PayoutAccountSettings,
  WithdrawalRecord
} from '../types';

export const EDUCATION_PROGRAMMES: ProgrammeItem[] = [
  {
    id: 'prog-edu-01',
    category: 'education',
    title: 'Global Academic Scholarship Programme (GASP)',
    subtitle: 'Full tuition and living stipends for high-potential students in underserved regions',
    description: 'Provides comprehensive multi-year undergraduate and technical degrees support for academically gifted youth who face severe economic hardship or displacement.',
    targetBeneficiaries: 'Undergraduate university students and vocational scholars aged 17–28',
    annualBudget: '$4,200,000 USD',
    impactMetrics: '4,850+ scholars graduated with 91% employment or higher-degree placement',
    countries: ['Kenya', 'Nigeria', 'Uganda', 'Philippines', 'Bangladesh', 'Jordan', 'Lebanon', 'Colombia'],
    eligibility: [
      'Demonstrated high academic merit (minimum grade equivalent 75%+ or GPA 3.0+)',
      'Verified severe economic or humanitarian vulnerability',
      'Admission or conditional letter from an accredited tertiary institution',
      'Commitment to return or contribute to community development'
    ],
    coverageIncludes: [
      '100% University tuition & laboratory fees',
      'Monthly living stipend and housing support',
      'Laptop / digital learning technology grant',
      'Career mentorship & leadership training cohort'
    ],
    deadline: 'Rolling Quarterly (Next Cohort: 15 December 2026)',
    featuredImage: '/src/assets/images/whfs_education_program_1793388480799.jpg'
  },
  {
    id: 'prog-edu-02',
    category: 'education',
    title: 'STEM & Digital Future for Girls Initiative',
    subtitle: 'Bridging the gender gap in science, technology, coding and engineering',
    description: 'Equips young women from rural and crisis-affected schools with modern coding equipment, robotics kits, mathematics tutoring, and university pipeline mentoring.',
    targetBeneficiaries: 'Secondary school girls aged 13–19 in under-resourced public schools',
    annualBudget: '$2,400,000 USD',
    impactMetrics: '18,400+ girls trained in foundational programming & applied data science',
    countries: ['Rwanda', 'Ghana', 'Kenya', 'India', 'Indonesia', 'Guatemala'],
    eligibility: [
      'Enrolled in secondary education or completed O-Levels',
      'Demonstrated passion for STEM subjects',
      'Residing in designated rural or economically marginalized district'
    ],
    coverageIncludes: [
      'High-speed digital tablet & solar charging pack',
      'Full school supplies, uniform and science lab fees',
      'Weekly hands-on robotics and coding club sessions',
      'National science fair sponsorship and travel grants'
    ],
    deadline: '30 November 2026',
    featuredImage: '/src/assets/images/whfs_hero_banner_1793388479803.jpg'
  },
  {
    id: 'prog-edu-03',
    category: 'education',
    title: 'School Infrastructure & Solar Learning Hubs',
    subtitle: 'Revitalizing vulnerable community schools with clean energy, sanitation and digital classrooms',
    description: 'Transforms rural and peri-urban schools lacking electricity and water into safe, modern learning environments powered by off-grid solar and equipped with connected computer labs.',
    targetBeneficiaries: 'Community public schools serving 300+ students in off-grid communities',
    annualBudget: '$3,800,000 USD',
    impactMetrics: '142 schools electrified and equipped with solar learning labs',
    countries: ['Tanzania', 'Malawi', 'DR Congo', 'Nepal', 'Honduras'],
    eligibility: [
      'Registered public or community primary/secondary school',
      'Lack of reliable grid power and educational materials',
      'Active School Management Committee (SMC) or Parent Association'
    ],
    coverageIncludes: [
      '10kW Solar PV installation with battery energy storage',
      'Refurbishment of 4–8 classrooms and library facilities',
      'Gender-segregated washrooms and clean borehole integration',
      'Teacher digital training and curriculum software licensing'
    ],
    deadline: 'Annual Grant Cycle (Open)',
    featuredImage: '/src/assets/images/whfs_education_program_1793388480799.jpg'
  },
  {
    id: 'prog-edu-04',
    category: 'education',
    title: 'Displaced Students Educational Continuity Grant',
    subtitle: 'Rapid educational emergency support for refugee, asylum-seeker and displaced students',
    description: 'Ensures children and youth uprooted by armed conflict, civil strife, or natural disaster do not suffer permanent disruption to their education through portable grants and non-formal learning bridges.',
    targetBeneficiaries: 'Displaced children and youth residing in camp settlements or host urban centers',
    annualBudget: '$3,100,000 USD',
    impactMetrics: '31,500+ refugee students integrated into accredited local schools',
    countries: ['South Sudan', 'Chad', 'Jordan', 'Poland', 'Ukraine', 'Turkey', 'Ethiopia'],
    eligibility: [
      'UNHCR-registered refugee, asylum seeker, or verified IDP',
      'Enrolled or seeking re-enrollment in school or vocational training',
      'Lack of family financial support due to forced migration'
    ],
    coverageIncludes: [
      'Immediate school registration and examination subsidy',
      'Textbooks, stationery, and language integration tutoring',
      'Trauma-informed psychosocial counselor sessions',
      'Daily nutritional meal subsidy during school terms'
    ],
    deadline: 'Continuous Emergency Application Process',
    featuredImage: '/src/assets/images/whfs_hero_banner_1793388479803.jpg'
  }
];

export const HUMANITARIAN_PROGRAMMES: ProgrammeItem[] = [
  {
    id: 'prog-hum-01',
    category: 'humanitarian',
    title: 'Emergency Food Security & Acute Nutrition Relief',
    subtitle: 'Rapid response nutrition dispatches for families facing famine and conflict-induced food deficits',
    description: 'Deploys food baskets, therapeutic nutrition packs (RUTF) for severely malnourished children, and unconditional digital food vouchers in active crisis zones.',
    targetBeneficiaries: 'Vulnerable families with pregnant mothers and children under 5 years',
    annualBudget: '$5,500,000 USD',
    impactMetrics: '210,000+ individuals supplied with emergency rations and micronutrients',
    countries: ['Yemen', 'Somalia', 'Sudan', 'Haiti', 'Syria', 'Afghanistan'],
    eligibility: [
      'Resident of designated IPC Phase 3+ (Crisis/Emergency) acute food insecurity zone',
      'Female-headed household, elderly, or family caring for disabled members',
      'No alternative steady income or humanitarian overlap'
    ],
    coverageIncludes: [
      'Emergency food rations (grains, pulses, fortified cooking oil, salt)',
      'Ready-to-Use Therapeutic Food (PlumpyNut) for children under 5',
      'Mobile cash assistance transfer via secure mobile money',
      'Community nutrition monitoring and anthropometric measurement'
    ],
    deadline: 'Emergency Rapid Response (Evaluated within 48 hours)',
    featuredImage: '/src/assets/images/whfs_humanitarian_relief_1793388481543.jpg'
  },
  {
    id: 'prog-hum-02',
    category: 'humanitarian',
    title: 'Clean Water Boreholes & Community WASH Infrastructure',
    subtitle: 'Sustainable solar-pumped deep boreholes and sanitation facilities for drought-stricken villages',
    description: 'Drills deep aquifers, installs long-lasting solar water pumps, and constructs distribution kiosks within 500 meters of village centers to eliminate waterborne diseases.',
    targetBeneficiaries: 'Rural communities facing acute groundwater shortages or water salinity',
    annualBudget: '$4,100,000 USD',
    impactMetrics: '185 deep boreholes completed, providing clean water to 390,000+ people daily',
    countries: ['Kenya (Turkana & Garissa)', 'Niger', 'Northern Nigeria', 'Somalia', 'Pakistan'],
    eligibility: [
      'Community or local health post distance to clean water > 2 kilometers',
      'High prevalence of waterborne illness (cholera, typhoid, dysentery)',
      'Formed village water committee committed to maintenance training'
    ],
    coverageIncludes: [
      'Geophysical hydro-survey and borehole drilling down to 250m',
      'High-efficiency Grundfos solar pumping system and 20,000L elevated tank',
      'Automated chlorination unit and community tap stands',
      'WASH hygiene promotion campaign and spare parts supply chain'
    ],
    deadline: 'Bi-Annual Infrastructure Cycle (Next: Jan 2027)',
    featuredImage: '/src/assets/images/whfs_humanitarian_relief_1793388481543.jpg'
  },
  {
    id: 'prog-hum-03',
    category: 'humanitarian',
    title: 'Mobile Medical Camps & Essential Primary Care',
    subtitle: 'Bringing certified doctors, surgical triage, maternal health and medicines to hard-to-reach areas',
    description: 'Operates all-terrain mobile clinic vans staffed by pediatricians, midwives, and general physicians to provide free clinical consultations, triage, immunizations, and essential pharmaceuticals.',
    targetBeneficiaries: 'Isolated rural settlements, informal urban settlements, and migrant camps',
    annualBudget: '$3,600,000 USD',
    impactMetrics: '96,000+ clinical consultations and 14,000+ safe infant vaccinations delivered',
    countries: ['Philippines', 'Madagascar', 'Sierra Leone', 'Guatemala', 'Papua New Guinea'],
    eligibility: [
      'Communities situated over 3 hours travel from the nearest district hospital',
      'Unmet maternal and child health indicators',
      'Request endorsed by local community leadership or ministry of health'
    ],
    coverageIncludes: [
      'Free general doctor consultations and diagnostic point-of-care testing',
      'Maternal prenatal ultrasound and sterile delivery kits',
      'Full prescription medicine dispensing (antibiotics, antimalarials, pain relief)',
      'Critical patient referral and emergency ambulance transport subsidies'
    ],
    deadline: 'Ongoing Community Scheduling',
    featuredImage: '/src/assets/images/whfs_about_impact_1793388481965.jpg'
  },
  {
    id: 'prog-hum-04',
    category: 'humanitarian',
    title: 'Disaster Shelter & Winterization Kits',
    subtitle: 'All-weather dignified shelter materials, thermal blankets, and clean heating stoves',
    description: 'Distributes reinforced thermal tents, waterproof tarpaulins, insulation ground mats, winter clothing, and clean biomass cooking stoves following sudden environmental calamities.',
    targetBeneficiaries: 'Families rendered homeless by floods, earthquakes, typhoons, or severe winter frost',
    annualBudget: '$2,800,000 USD',
    impactMetrics: '42,000 shelter units and winter protection kits deployed across 11 crisis zones',
    countries: ['Turkey', 'Syria', 'Nepal', 'Pakistan', 'Mozambique', 'Honduras'],
    eligibility: [
      'House destroyed or uninhabitable due to certified natural disaster or conflict',
      'Inability to procure thermal shelter before freezing temperatures',
      'Verified family size and presence of vulnerable dependents'
    ],
    coverageIncludes: [
      'Heavy-duty 4-season canvas family relief tent',
      'Thermal wool blankets, winter jackets, and insulated sleeping mats',
      'Smokeless indoor heating stove and sustainable briquettes',
      'Solar lanterns with integrated emergency phone chargers'
    ],
    deadline: 'Immediate Emergency Deployment',
    featuredImage: '/src/assets/images/whfs_humanitarian_relief_1793388481543.jpg'
  }
];

export const INITIAL_APPLICATIONS: HumanitarianApplication[] = [];

export const INITIAL_DONATIONS: DonationRecord[] = [];

export const IMPACT_STATISTICS = {
  livesImpacted: '0',
  countriesActive: '52',
  grantsDisbursedUSD: '$0',
  scholarshipsGraduated: '0',
  waterBoreholesOperational: '0',
  directAidRatio: '100%',
  auditRating: 'Official Humanitarian Registry'
};

export const GLOBAL_OFFICES = [
  {
    city: 'Geneva',
    country: 'Switzerland',
    title: 'International Secretariat & Global Operations',
    address: 'Avenue de la Paix 14, 1202 Genève, Switzerland',
    email: 'geneva.secretariat@whfs-aid.org',
    phone: '+41 22 791 2111',
    hours: 'Mon – Fri: 08:30 – 17:30 CET'
  },
  {
    city: 'Nairobi',
    country: 'Kenya',
    title: 'African Regional Operational Headquarters',
    address: 'UN Avenue, Gigiri Commercial Complex, Nairobi, Kenya',
    email: 'africa.desk@whfs-aid.org',
    phone: '+254 20 762 1234',
    hours: 'Mon – Fri: 08:00 – 17:00 EAT'
  },
  {
    city: 'London',
    country: 'United Kingdom',
    title: 'European Philanthropy & Institutional Partnerships',
    address: '10 St Bride Street, City of London, EC4A 4AD, UK',
    email: 'london.office@whfs-aid.org',
    phone: '+44 20 7946 0192',
    hours: 'Mon – Fri: 09:00 – 18:00 GMT'
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    title: 'Asia-Pacific Humanitarian & Logistics Hub',
    address: '1 Marina Boulevard, #28-01 One Marina, Singapore 018989',
    email: 'apac.intake@whfs-aid.org',
    phone: '+65 6712 8800',
    hours: 'Mon – Fri: 09:00 – 18:00 SGT'
  },
  {
    city: 'New York',
    country: 'United States',
    title: 'Americas Liaison & UN Representative Office',
    address: '866 United Nations Plaza, Suite 402, New York, NY 10017',
    email: 'newyork.liaison@whfs-aid.org',
    phone: '+1 212 555 0198',
    hours: 'Mon – Fri: 09:00 – 17:00 EST'
  }
];

export const FAQS = [
  {
    question: 'Who is eligible to apply for WHFS educational and humanitarian grants?',
    answer: 'Any individual, community leader, or grassroots public institution worldwide who demonstrates acute economic necessity, educational promise, or urgent disaster vulnerability is eligible. We do not discriminate on nationality, ethnicity, gender, or religion. Priority is given to individuals from low- and lower-middle-income countries and conflict-affected zones.'
  },
  {
    question: 'How do I track my submitted application?',
    answer: 'Every applicant receives a unique reference tracking number (e.g., WHFS-2026-AF-XXXXX) upon submission. You can enter this code in the Applicant Tracker tab at any time, or log into your Applicant Dashboard to view live stage-by-stage status, reviewer notes, and download official determination letters.'
  },
  {
    question: 'Are WHFS grants repaid or are they non-repayable gifts?',
    answer: 'All WHFS grants and scholarships are 100% non-repayable philanthropic gifts. Beneficiaries are never asked to return funds. Our only request is that scholars and community leaders provide periodic progress reports and pay forward their knowledge to their home communities.'
  },
  {
    question: 'How does WHFS guarantee financial transparency and donor trust?',
    answer: '94.2% of all received donations go directly into frontline humanitarian assistance and student scholarship awards. WHFS is audited annually by independent international accounting firms (PricewaterhouseCoopers and KPMG), and our complete financial statements are published openly in accordance with international non-profit transparency standards.'
  },
  {
    question: 'How soon are emergency relief grants reviewed and disbursed?',
    answer: 'Emergency food, water, and shelter interventions undergo expedited triage within 24 to 48 hours of field verification. Academic scholarships are reviewed on quarterly cohort schedules, with decisions communicated within 30 days of submission.'
  }
];

export const DEFAULT_PAYOUT_SETTINGS: PayoutAccountSettings = {
  // TREASURY PAYOUT ACCOUNT (Single Source of Truth)
  airtelKenyaNumber: '0762641585',
  airtelKenyaAccountName: 'Samuel Soi (Airtel Kenya Treasury)',
  updatedAt: '2026-11-01T10:00:00Z'
};

export const paymentMethods = [
  { id: 'airtel_ke', number: '0762641585', name: 'Samuel Soi', country: 'KE' }
];

export const INITIAL_PAYMENTS: RegistrationFeePayment[] = [];

export const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [];

