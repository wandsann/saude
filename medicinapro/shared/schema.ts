import { pgTable, text, serial, integer, boolean, timestamp, date, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const UserRole = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  NURSE: "nurse",
  CLEANER: "cleaner",
  COOK: "cook",
  PHARMACIST: "pharmacist",
  ADMIN: "admin"
} as const;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  cpf: text("cpf").notNull().unique(),
  birthDate: date("birth_date").notNull(),
  gender: text("gender").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  healthPlanName: text("health_plan_name"),
  healthPlanNumber: text("health_plan_number"),
  profilePicture: text("profile_picture"),
  language: text("language").default("pt"),
  level: integer("level").default(1),
  points: integer("points").default(0),
  role: text("role").notNull().default(UserRole.PATIENT), // patient, doctor, nurse, cleaner, cook, admin
  specialty: text("specialty"), // for doctors
  department: text("department"), // for hospital staff
});

// Health Metrics table
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // heart-rate, blood-pressure, weight, glucose, temperature
  value: text("value").notNull(), // For blood pressure it could be "120/80", for heart rate "72"
  unit: text("unit").notNull(), // bpm, mmHg, kg, mg/dL, °C
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  notes: text("notes"),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  doctorName: text("doctor_name").notNull(),
  specialty: text("specialty").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  date: date("date").notNull(),
  time: text("time").notNull(), // "14:30"
  status: text("status").notNull(), // confirmed, pending, canceled
  notes: text("notes"),
});

// Medications table
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(), // e.g., "50mg"
  instructions: text("instructions").notNull(), // e.g., "Take with food"
  frequency: json("frequency").notNull(), // e.g., { times: 2, period: "daily", schedule: ["morning", "night"] }
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  status: text("status").notNull(), // active, completed, paused
  notes: text("notes"),
});

// Medical Records table
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // diagnosis, procedure, note
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: date("date").notNull(),
  doctorName: text("doctor_name"),
  institution: text("institution"),
  attachments: json("attachments"), // Array of file references
});

// Medical Exams table
export const medicalExams = pgTable("medical_exams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  date: date("date").notNull(),
  results: text("results"),
  institution: text("institution"),
  doctorName: text("doctor_name"),
  status: text("status").notNull(), // pending, completed
  attachments: json("attachments"), // Array of file references
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // appointment, medication, exercise, etc.
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  earnedDate: timestamp("earned_date").defaultNow().notNull(),
  points: integer("points").notNull(),
});

// Tasks table for staff (nurses, cleaners, cooks, etc.)
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  assignedToId: integer("assigned_to_id").notNull().references(() => users.id),
  assignedById: integer("assigned_by_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  taskType: text("task_type").notNull(), // medical, cleaning, cooking, etc.
  priority: text("priority").notNull(), // high, medium, low
  status: text("status").notNull(), // pending, in-progress, completed, canceled
  dueDate: date("due_date").notNull(),
  dueTime: text("due_time"), // "14:30"
  location: text("location").notNull(), // room number, department, etc.
  patientId: integer("patient_id").references(() => users.id), // If task is related to a patient
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  attachments: json("attachments"), // Array of file references
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hospital/Healthcare Facility table
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // hospital, clinic, etc.
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  website: text("website"),
  departments: json("departments"), // Array of departments
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela para os convênios médicos (planos de saúde)
export const healthInsurances = pgTable("health_insurances", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  coverage: text("coverage").notNull(), // Descrição da cobertura
  contactPhone: text("contact_phone").notNull(),
  contactEmail: text("contact_email"),
  website: text("website"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela para produtos farmacêuticos
export const pharmacyProducts = pgTable("pharmacy_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  category: text("category").notNull(), // Medicamento, Insumo, EPI, etc.
  subcategory: text("subcategory"), // Analgésico, Antibiótico, etc.
  description: text("description"),
  dosage: text("dosage"), // Para medicamentos
  presentation: text("presentation"), // ex: Caixa com 30 comprimidos, frasco 100ml
  manufacturer: text("manufacturer"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  minStockAlert: integer("min_stock_alert").default(10).notNull(),
  requiresPrescription: boolean("requires_prescription").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  imageUrl: text("image_url"),
  batchNumber: text("batch_number"),
  expirationDate: date("expiration_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela para insumos e materiais
export const medicalSupplies = pgTable("medical_supplies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  category: text("category").notNull(), // Material hospitalar, Insumo, EPI
  description: text("description"),
  manufacturer: text("manufacturer"),
  unitOfMeasure: text("unit_of_measure").notNull(), // Caixa, Unidade, Par, etc
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  minStockAlert: integer("min_stock_alert").default(10).notNull(),
  usageInstructions: text("usage_instructions"),
  storageRequirements: text("storage_requirements"),
  active: boolean("active").default(true).notNull(),
  imageUrl: text("image_url"),
  batchNumber: text("batch_number"),
  expirationDate: date("expiration_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela para o fluxo de atendimento
export const attendanceFlow = pgTable("attendance_flow", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => users.id),
  status: text("status").notNull(), // Agendado, Triagem, Consultório, Medicação, Exames, Finalizado, Cancelado
  currentStep: text("current_step"), // Atual etapa do atendimento
  priority: text("priority").default("normal").notNull(), // Baixa, Normal, Alta, Emergência
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  roomNumber: text("room_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela para notificações
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Pode ser nulo se for para todos
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // Sistema, Atendimento, Lembretes, etc.
  priority: text("priority").default("normal").notNull(), // Baixa, Normal, Alta
  isRead: boolean("is_read").default(false).notNull(),
  targetGroup: text("target_group"), // "all", "patients", "doctors", "department:xyz"
  action: text("action"), // URL de ação ou código específico
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true, level: true, points: true });
export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export const insertMedicationSchema = createInsertSchema(medications).omit({ id: true });
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({ id: true });
export const insertMedicalExamSchema = createInsertSchema(medicalExams).omit({ id: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, completedAt: true, createdAt: true });
export const insertFacilitySchema = createInsertSchema(facilities).omit({ id: true, createdAt: true });

// Esquemas para novas tabelas
export const insertHealthInsuranceSchema = createInsertSchema(healthInsurances).omit({ id: true, createdAt: true });
export const insertPharmacyProductSchema = createInsertSchema(pharmacyProducts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMedicalSupplySchema = createInsertSchema(medicalSupplies).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAttendanceFlowSchema = createInsertSchema(attendanceFlow).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;

export type InsertMedicalExam = z.infer<typeof insertMedicalExamSchema>;
export type MedicalExam = typeof medicalExams.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;

// Tipos para novas tabelas
export type InsertHealthInsurance = z.infer<typeof insertHealthInsuranceSchema>;
export type HealthInsurance = typeof healthInsurances.$inferSelect;

export type InsertPharmacyProduct = z.infer<typeof insertPharmacyProductSchema>;
export type PharmacyProduct = typeof pharmacyProducts.$inferSelect;

export type InsertMedicalSupply = z.infer<typeof insertMedicalSupplySchema>;
export type MedicalSupply = typeof medicalSupplies.$inferSelect;

export type InsertAttendanceFlow = z.infer<typeof insertAttendanceFlowSchema>;
export type AttendanceFlow = typeof attendanceFlow.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Type for user roles
export type UserRoleType = typeof UserRole[keyof typeof UserRole];
