export type FieldType = 'text' | 'textarea' | 'number' | 'switch' | 'datetime-local' | 'url' | 'email';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
}

export interface ResourceConfig {
  resource: string;
  idKey: 'id' | 'slug';
  title: string;
  singular: string;
  fields: FieldConfig[];
}

export const RESOURCES: Record<string, ResourceConfig> = {
  pages: {
    resource: 'pages',
    idKey: 'slug',
    title: 'Pages',
    singular: 'Page',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'content', label: 'Content', type: 'textarea', required: true },
      { name: 'metaDescription', label: 'Meta Description', type: 'text' },
      { name: 'menuOrder', label: 'Menu Order', type: 'number' },
      { name: 'isPublished', label: 'Published', type: 'switch' },
      { name: 'showInMenu', label: 'Show in Menu', type: 'switch' },
    ],
  },
  posts: {
    resource: 'posts',
    idKey: 'slug',
    title: 'News / Posts',
    singular: 'Post',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'content', label: 'Content', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'publishedAt', label: 'Published At', type: 'datetime-local' },
      { name: 'isPublished', label: 'Published', type: 'switch' },
    ],
  },
  events: {
    resource: 'events',
    idKey: 'id',
    title: 'Events',
    singular: 'Event',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'startAt', label: 'Start', type: 'datetime-local', required: true },
      { name: 'endAt', label: 'End', type: 'datetime-local' },
      { name: 'isPublished', label: 'Published', type: 'switch' },
    ],
  },
  staff: {
    resource: 'staff',
    idKey: 'id',
    title: 'Staff',
    singular: 'Staff Member',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'isPublished', label: 'Published', type: 'switch' },
    ],
  },
  galleries: {
    resource: 'galleries',
    idKey: 'id',
    title: 'Galleries',
    singular: 'Gallery',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  downloads: {
    resource: 'downloads',
    idKey: 'id',
    title: 'Downloads',
    singular: 'Download',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'fileUrl', label: 'File URL', type: 'url' },
    ],
  },
  fees: {
    resource: 'fees',
    idKey: 'id',
    title: 'School Fees',
    singular: 'Fee',
    fields: [
      { name: 'year', label: 'Year', type: 'text', required: true },
      { name: 'grade', label: 'Grade', type: 'text', required: true },
      { name: 'item', label: 'Fee Item', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  contacts: {
    resource: 'contacts',
    idKey: 'id',
    title: 'Contacts',
    singular: 'Contact',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'number', label: 'Phone Number', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'text', required: true },
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  socials: {
    resource: 'socials',
    idKey: 'id',
    title: 'Social Links',
    singular: 'Social Link',
    fields: [
      { name: 'platform', label: 'Platform', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'url', required: true },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  navigation: {
    resource: 'navigation',
    idKey: 'id',
    title: 'Navigation',
    singular: 'Navigation Item',
    fields: [
      { name: 'label', label: 'Label', type: 'text', required: true },
      { name: 'href', label: 'URL / Path', type: 'text', required: true },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'visible', label: 'Visible', type: 'switch' },
    ],
  },
};
