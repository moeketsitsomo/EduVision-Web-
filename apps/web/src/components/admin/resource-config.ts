export type FieldType = 'text' | 'textarea' | 'number' | 'switch' | 'datetime-local' | 'url' | 'email' | 'select';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
}

export interface ResourceConfig {
  resource: string;
  idKey: string;
  title: string;
  singular: string;
  fields: FieldConfig[];
}

export const RESOURCES: Record<string, ResourceConfig> = {
  subjects: {
    resource: 'subjects',
    idKey: 'id',
    title: 'Subjects',
    singular: 'Subject',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'grade', label: 'Grade / Phase', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'isPublished', label: 'Published', type: 'switch' },
    ],
  },
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
    title: 'News',
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
      { name: 'role', label: 'Position / Role', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'bio', label: 'Biography', type: 'textarea' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'photoUrl', label: 'Photo URL', type: 'url' },
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
      { name: 'year', label: 'Year', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'coverImageUrl', label: 'Cover Image URL', type: 'url' },
    ],
  },
  downloads: {
    resource: 'downloads',
    idKey: 'id',
    title: 'Documents',
    singular: 'Document',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'fileUrl', label: 'File URL', type: 'url' },
    ],
  },
  contacts: {
    resource: 'contacts',
    idKey: 'id',
    title: 'Contact Directory',
    singular: 'Contact',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'number', label: 'Phone Number', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'text', required: true },
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  'contact-messages': {
    resource: 'contact-messages',
    idKey: 'id',
    title: 'Contact Requests',
    singular: 'Contact Request',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
      { name: 'isRead', label: 'Read', type: 'switch' },
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
  users: {
    resource: 'users',
    idKey: 'id',
    title: 'Users',
    singular: 'User',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'role', label: 'Role', type: 'select', required: true, options: [
        { label: 'School Admin', value: 'SCHOOL_ADMIN' },
        { label: 'Parent', value: 'PARENT' },
      ]},
      { name: 'password', label: 'Password', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'switch' },
    ],
  },
  admissions: {
    resource: 'admissions',
    idKey: 'id',
    title: 'Admissions',
    singular: 'Application',
    fields: [
      { name: 'studentFirstName', label: 'Student First Name', type: 'text', required: true },
      { name: 'studentLastName', label: 'Student Last Name', type: 'text' },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'datetime-local' },
      { name: 'gender', label: 'Gender', type: 'text' },
      { name: 'gradeApplying', label: 'Grade Applying', type: 'text', required: true },
      { name: 'previousSchool', label: 'Previous School', type: 'text' },
      { name: 'parentName', label: 'Parent Name', type: 'text', required: true },
      { name: 'parentEmail', label: 'Parent Email', type: 'email', required: true },
      { name: 'parentPhone', label: 'Parent Phone', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Reviewing', value: 'REVIEWING' },
        { label: 'Approved', value: 'ACCEPTED' },
        { label: 'Rejected', value: 'REJECTED' },
        { label: 'Waiting List', value: 'WAITLISTED' },
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
};
