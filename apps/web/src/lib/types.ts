export interface School {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  bannerImageUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  websiteTitle: string;
  metaDescription: string;
  contactEmail: string;
  contactPhone: string;
  admissionsEmail?: string | null;
  admissionsPhone?: string | null;
  address: string;
  footerText?: string | null;
  principalName?: string | null;
  principalMessage?: string | null;
  mission?: string | null;
  vision?: string | null;
  values?: string | null;
  history?: string | null;
  establishedYear?: number | null;
  enrollmentCount?: number | null;
  teacherCount?: number | null;
  classroomCount?: number | null;
  passRate?: number | null;
  facilities?: unknown;
  awards?: unknown;
  officeHours?: string | null;
  googleMapsUrl?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  isActive: boolean;
  subscriptionStatus: string;
  settings?: unknown;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  content: string;
  isPublished: boolean;
  showInMenu: boolean;
  menuOrder: number;
  bannerImageUrl?: string | null;
  featuredImageUrl?: string | null;
  metaDescription?: string | null;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  isPublished: boolean;
  featuredImageUrl?: string | null;
}

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  allDay?: boolean;
  category?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  order: number;
  isPublished: boolean;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  items?: unknown[];
}

export interface Download {
  id: string;
  title: string;
  description?: string | null;
  fileUrl?: string | null;
  category?: string | null;
}

export interface Fee {
  id: string;
  grade: string;
  item: string;
  amount: number;
  year: string;
  description?: string | null;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: string;
  label?: string | null;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  isExternal?: boolean;
  pageId?: string | null;
  postId?: string | null;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  audience: string;
  isPublished: boolean;
  publishedAt?: string | null;
}

export interface Subject {
  id: string;
  name: string;
  code?: string | null;
  grade?: string | null;
  description?: string | null;
  category?: string | null;
  order: number;
  isPublished: boolean;
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  description?: string | null;
  fileUrl?: string | null;
  assignedAt?: string | null;
  dueDate?: string | null;
}

export interface SiteData {
  school: School;
  pages: Page[];
  posts: Post[];
  staff: Staff[];
  events: Event[];
  galleries: Gallery[];
  downloads: Download[];
  contacts: EmergencyContact[];
  socials: SocialLink[];
  fees: Fee[];
  navigation: NavigationItem[];
  notices: Notice[];
  subjects: Subject[];
}
