import { Batch } from '../types';

export const BRAND_CONFIG = {
  name: 'GB STUDY',
  tagline: 'Kota Premier JEE & NEET Learning Portal',
  logoUrl: 'https://i.ibb.co/0R7qc34v/1093.jpg',
  telegramUrl: 'https://t.me/GBFreestudy',
  telegramChannelName: '@GBFreestudy',
  telegramPopupTitle: 'Join GB STUDY Telegram Channel',
  telegramPopupDesc: 'Get instant access to live batch updates, Kota handwritten notes, DPP sheets, formula mindmaps, and exam notifications directly in our channel!',
};

export const BATCHES_DATA: Batch[] = [
  {
    id: 36,
    title: 'JEE 2027: 12th Class A2 Batch',
    thumbnail: 'https://appx-content-v2.classx.co.in/paid_course3/2026-07-25-0_9298168142948747.png',
    category: 'class12',
    classLabel: 'Class 12',
    description: 'Complete 12th Class A2 Kota batch covering Physics, Physical Chemistry, Organic Chemistry, Inorganic Chemistry & Mathematics by top Kota faculties.',
    totalVideos: 946,
    totalPdfs: 436,
    faculties: ['NJ Sir (Physics)', 'MS Chouhan Sir (OC)', 'N Avasthi Sir (PC)', 'VK Jaiswal Sir (IOC)', 'PJ Sir (Maths)']
  },
  {
    id: 10,
    title: 'JEE 2027: 12th Class OG Kota Batch',
    thumbnail: 'https://appx-content-v2.classx.co.in/paid_course3/2026-04-03-0_81101898801182.jpeg',
    category: 'class12',
    classLabel: 'Class 12 Kota',
    description: 'Original Kota classroom recordings and modules for Class 12 JEE Advanced preparation with complete theory and problem solving sessions.',
    totalVideos: 1075,
    totalPdfs: 608,
    faculties: ['Kota Master Faculty', 'Physics', 'Chemistry', 'Mathematics']
  },
  {
    id: 8,
    title: 'JEE 2028: 11th Class OG KOTA BATCH',
    thumbnail: 'https://appx-content-v2.classx.co.in/paid_course3/2026-04-02-0_8367698380827815.jpeg',
    category: 'class11',
    classLabel: 'Class 11 Kota',
    description: 'Foundation and advanced Class 11 Kota batch building core concepts for JEE 2028 aspirants with comprehensive DPPs and test series.',
    totalVideos: 394,
    totalPdfs: 437,
    faculties: ['NJ Sir (Physics)', 'MS Chouhan Sir (OC)', 'N Avasthi Sir (PC)', 'VK Jaiswal Sir (IOC)', 'PJ Sir (Maths)']
  },
  {
    id: 35,
    title: 'JEE 2028: 11th Class P2 Batch',
    thumbnail: 'https://appx-content-v2.classx.co.in/paid_course3/2026-07-25-0_6159018864218494.png',
    category: 'class11',
    classLabel: 'Class 11',
    description: 'High-yield Class 11 P2 Batch designed for accelerated conceptual clarity, chapter-wise assignments and Kota classroom notes.',
    totalVideos: 341,
    totalPdfs: 350,
    faculties: ['Top Kota Educators', 'Physics', 'Chemistry', 'Mathematics']
  },
  {
    id: 37,
    title: 'JEE 2027: DROPPER X2 BATCH',
    thumbnail: 'https://appx-content-v2.classx.co.in/paid_course3/2026-07-25-0_07261587898334942.png',
    category: 'dropper',
    classLabel: 'Dropper / Repeater',
    description: 'Intensive JEE Dropper/Repeater batch covering full Class 11 and 12 syllabus with rigorous problem solving, PYQs, and Kota test papers.',
    totalVideos: 773,
    totalPdfs: 660,
    faculties: ['Senior Kota Faculty Team']
  },
  {
    id: 13,
    title: 'VIBRANT PRINTED MODULES- CLASS 11',
    thumbnail: 'https://appx-content-v2.classx.co.in/paid_course3/2026-02-24a3e03c65-74ca-4e54-b4b7-ed675dfada25.png',
    category: 'modules',
    classLabel: 'Printed Modules',
    description: 'Official printed modules, exercise questions, answer keys and solution guides for Class 11 students.',
    totalVideos: 0,
    totalPdfs: 0,
    faculties: ['Kota Academic Division']
  }
];
