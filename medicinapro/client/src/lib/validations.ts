import { z } from "zod";

// CPF validation
export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

// Format CPF automatically
export function formatCPF(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  } else if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  } else {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }
}

// Validate CPF (simple structural validation)
export function isValidCPF(cpf: string): boolean {
  return cpfRegex.test(cpf);
}

// User role enum for login
export const userRoles = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  NURSE: "nurse",
  CLEANER: "cleaner",
  COOK: "cook",
  ADMIN: "admin"
} as const;

export type UserRole = typeof userRoles[keyof typeof userRoles];

// Login form validation schema
export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.enum([
    userRoles.PATIENT, 
    userRoles.DOCTOR, 
    userRoles.NURSE, 
    userRoles.CLEANER, 
    userRoles.COOK, 
    userRoles.ADMIN
  ], {
    errorMap: () => ({ message: "Please select a user type" })
  })
});

// Registration form validation schema
export const registrationSchema = z.object({
  fullName: z.string().min(3, { message: "Name must have at least 3 characters" }),
  cpf: z.string().regex(cpfRegex, { message: "CPF must follow the format XXX.XXX.XXX-XX" }),
  birthDate: z.string().refine(date => !isNaN(Date.parse(date)), { 
    message: "Invalid date format" 
  }),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    errorMap: () => ({ message: "Please select a gender" })
  }),
  email: z.string().email({ message: "Invalid email format" }),
  username: z.string().min(3, { message: "Username must have at least 3 characters" }),
  password: z.string().min(8, { message: "Password must have at least 8 characters" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Health metric validation schema
export const healthMetricSchema = z.object({
  type: z.enum(["heart-rate", "blood-pressure", "weight", "glucose", "temperature"], {
    errorMap: () => ({ message: "Please select a metric type" })
  }),
  value: z.string().min(1, { message: "Value is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  notes: z.string().optional()
});

// Appointment validation schema
export const appointmentSchema = z.object({
  doctorName: z.string().min(3, { message: "Doctor name is required" }),
  specialty: z.string().min(1, { message: "Specialty is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  address: z.string().optional(),
  date: z.string().refine(date => !isNaN(Date.parse(date)), { 
    message: "Invalid date format" 
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Time must be in format HH:MM"
  }),
  notes: z.string().optional()
});

// Medication validation schema
export const medicationSchema = z.object({
  name: z.string().min(1, { message: "Medication name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  instructions: z.string().min(1, { message: "Instructions are required" }),
  frequency: z.object({
    times: z.number().min(1),
    period: z.enum(["daily", "weekly", "monthly"]),
    schedule: z.array(z.string()).min(1)
  }),
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), { 
    message: "Invalid start date format" 
  }),
  endDate: z.string().optional().refine(date => !date || !isNaN(Date.parse(date)), { 
    message: "Invalid end date format" 
  }),
  notes: z.string().optional()
});
