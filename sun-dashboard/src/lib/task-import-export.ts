import type { TaskFormData } from "@/types/task-form";
import type { TaskPriority } from "@/types/task";

/**
 * Interface for imported task data from CSV/Excel
 */
export interface ImportedTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  unitId?: string;
  collaboratingUnitId?: string;
  assignmentReferenceId?: string;
  importanceLevel: 'normal' | 'important' | 'very-important';
  assignmentDate: string;
  expectedEndDate?: string;
  requiredDeadline?: string;
  isRecurring: boolean;
  recurringType?: string;
  recurringInterval?: number;
  recurringEndDate?: string;
  isLeadershipDirection: boolean;
  labelIds: string[];
}

/**
 * CSV headers mapping for task import
 */
export const CSV_HEADERS = {
  title: 'Title',
  description: 'Description',
  priority: 'Priority',
  assigneeId: 'Assignee ID',
  unitId: 'Unit ID',
  collaboratingUnitId: 'Collaborating Unit ID',
  assignmentReferenceId: 'Assignment Reference ID',
  importanceLevel: 'Importance Level',
  assignmentDate: 'Assignment Date',
  expectedEndDate: 'Expected End Date',
  requiredDeadline: 'Required Deadline',
  isRecurring: 'Is Recurring',
  recurringType: 'Recurring Type',
  recurringInterval: 'Recurring Interval',
  recurringEndDate: 'Recurring End Date',
  isLeadershipDirection: 'Leadership Direction',
  labelIds: 'Label IDs'
} as const;

/**
 * Accepted file types for import
 */
export const ACCEPTED_IMPORT_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

/**
 * Validate file type for import
 */
export function validateFileType(file: File): boolean {
  return ACCEPTED_IMPORT_TYPES.includes(file.type) || 
         file.name.toLowerCase().endsWith('.csv') ||
         file.name.toLowerCase().endsWith('.xlsx') ||
         file.name.toLowerCase().endsWith('.xls');
}

/**
 * Parse CSV content to array of objects
 */
export function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }

  return data;
}

/**
 * Validate and transform imported data
 */
export function validateImportedData(rawData: Record<string, string>[]): ImportedTaskData[] {
  const validatedData: ImportedTaskData[] = [];
  const errors: string[] = [];

  rawData.forEach((row, index) => {
    try {
      // Validate required fields
      if (!row[CSV_HEADERS.title]?.trim()) {
        errors.push(`Row ${index + 2}: Title is required`);
        return;
      }

      // Validate priority
      const priority = row[CSV_HEADERS.priority]?.toLowerCase() as TaskPriority;
      if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
        errors.push(`Row ${index + 2}: Invalid priority value. Must be: low, medium, high, or urgent`);
        return;
      }

      // Validate importance level
      const importanceLevel = row[CSV_HEADERS.importanceLevel]?.toLowerCase();
      if (!['normal', 'important', 'very-important'].includes(importanceLevel)) {
        errors.push(`Row ${index + 2}: Invalid importance level. Must be: normal, important, or very-important`);
        return;
      }

      // Validate assignment date
      const assignmentDate = row[CSV_HEADERS.assignmentDate];
      if (!assignmentDate || isNaN(Date.parse(assignmentDate))) {
        errors.push(`Row ${index + 2}: Invalid assignment date format`);
        return;
      }

      // Parse boolean values
      const isRecurring = row[CSV_HEADERS.isRecurring]?.toLowerCase() === 'true';
      const isLeadershipDirection = row[CSV_HEADERS.isLeadershipDirection]?.toLowerCase() === 'true';

      // Parse label IDs
      const labelIds = row[CSV_HEADERS.labelIds]
        ? row[CSV_HEADERS.labelIds].split(';').map(id => id.trim()).filter(Boolean)
        : [];

      const validatedRow: ImportedTaskData = {
        title: row[CSV_HEADERS.title].trim(),
        description: row[CSV_HEADERS.description]?.trim() || undefined,
        priority,
        assigneeId: row[CSV_HEADERS.assigneeId]?.trim() || undefined,
        unitId: row[CSV_HEADERS.unitId]?.trim() || undefined,
        collaboratingUnitId: row[CSV_HEADERS.collaboratingUnitId]?.trim() || undefined,
        assignmentReferenceId: row[CSV_HEADERS.assignmentReferenceId]?.trim() || undefined,
        importanceLevel: importanceLevel as 'normal' | 'important' | 'very-important',
        assignmentDate: new Date(assignmentDate).toISOString().split('T')[0],
        expectedEndDate: row[CSV_HEADERS.expectedEndDate] 
          ? new Date(row[CSV_HEADERS.expectedEndDate]).toISOString().split('T')[0] 
          : undefined,
        requiredDeadline: row[CSV_HEADERS.requiredDeadline]?.trim() || undefined,
        isRecurring,
        recurringType: isRecurring ? row[CSV_HEADERS.recurringType]?.trim() : undefined,
        recurringInterval: isRecurring ? parseInt(row[CSV_HEADERS.recurringInterval]) || 1 : undefined,
        recurringEndDate: isRecurring && row[CSV_HEADERS.recurringEndDate]
          ? new Date(row[CSV_HEADERS.recurringEndDate]).toISOString().split('T')[0]
          : undefined,
        isLeadershipDirection,
        labelIds
      };

      validatedData.push(validatedRow);
    } catch (error) {
      errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Validation errors:\n${errors.join('\n')}`);
  }

  return validatedData;
}

/**
 * Import tasks from file
 */
export async function importTasksFromFile(file: File): Promise<ImportedTaskData[]> {
  if (!validateFileType(file)) {
    throw new Error('Invalid file type. Please use CSV or Excel files.');
  }

  try {
    const content = await readFileAsText(file);
    const rawData = parseCSV(content);
    const validatedData = validateImportedData(rawData);
    
    return validatedData;
  } catch (error) {
    throw new Error(`Failed to import file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Read file as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Generate example CSV content
 */
export function generateExampleCSV(): string {
  const headers = Object.values(CSV_HEADERS);
  const exampleRows = [
    [
      'Complete project documentation',
      'Write comprehensive documentation for the new feature',
      'high',
      'user-123',
      'unit-dev',
      'unit-qa',
      'ref-001',
      'important',
      '2024-01-15',
      '2024-01-30',
      '2024-02-01',
      'false',
      '',
      '',
      '',
      'false',
      'label-1;label-2'
    ],
    [
      'Review code changes',
      'Review and approve pending pull requests',
      'medium',
      'user-456',
      'unit-dev',
      '',
      'ref-002',
      'normal',
      '2024-01-16',
      '2024-01-20',
      '',
      'true',
      'weekly',
      '1',
      '2024-03-01',
      'true',
      'label-3'
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...exampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download example CSV file
 */
export function downloadExampleFile(filename: string = 'task-import-template.csv'): void {
  const csvContent = generateExampleCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Convert imported data to form data
 */
export function convertImportedDataToFormData(importedData: ImportedTaskData): Partial<TaskFormData> {
  return {
    title: importedData.title,
    description: importedData.description || '',
    priority: importedData.priority,
    assigneeId: importedData.assigneeId || '',
    unitId: importedData.unitId || '',
    collaboratingUnitId: importedData.collaboratingUnitId || '',
    assignmentReferenceId: importedData.assignmentReferenceId || '',
    importanceLevel: importedData.importanceLevel,
    assignmentDate: importedData.assignmentDate,
    expectedEndDate: importedData.expectedEndDate || '',
    requiredDeadline: importedData.requiredDeadline || '',
    isRecurring: importedData.isRecurring,
    recurringType: importedData.recurringType || '',
    recurringInterval: importedData.recurringInterval || 1,
    recurringEndDate: importedData.recurringEndDate || '',
    isLeadershipDirection: importedData.isLeadershipDirection,
    labelIds: importedData.labelIds
  };
}
