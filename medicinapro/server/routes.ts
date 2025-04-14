import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertUserSchema, 
  insertHealthMetricSchema, 
  insertAppointmentSchema, 
  insertMedicationSchema, 
  insertMedicalRecordSchema, 
  insertMedicalExamSchema 
} from "@shared/schema";
import MemoryStore from "memorystore";

// Extended request type with user property
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      fullName: string;
    }
  }
}

// Helper to handle validation errors
function handleValidationError(err: unknown, res: Response) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: fromZodError(err).message });
  }
  
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup session
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "health-connect-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 1 day
      store: new SessionStore({ checkPeriod: 86400000 }),
    })
  );
  
  // Setup passport authentication
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Usuário não encontrado" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Senha incorreta" });
        }
        
        return done(null, { id: user.id, username: user.username, fullName: user.fullName });
      } catch (err) {
        return done(err);
      }
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, { id: user.id, username: user.username, fullName: user.fullName });
    } catch (err) {
      done(err);
    }
  });
  
  // Middleware to check if user is authenticated
  function isAuthenticated(req: Request, res: Response, next: Function) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Não autorizado" });
  }
  
  // Authentication routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: Express.User, info: { message: string }) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });
      
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json({ user });
      });
    })(req, res, next);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });
  
  app.get("/api/auth/current-user", (req, res) => {
    if (req.user) {
      return res.json({ user: req.user });
    }
    res.status(401).json({ message: "Não autenticado" });
  });
  
  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Nome de usuário já existe" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email já está em uso" });
      }
      
      const existingCPF = await storage.getUserByCPF(userData.cpf);
      if (existingCPF) {
        return res.status(400).json({ message: "CPF já está registrado" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Exclude password from response
      const { password, ...userResponse } = user;
      
      res.status(201).json(userResponse);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Update user profile
  app.put("/api/users/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Validate user data update
      const updateUserSchema = insertUserSchema.partial().omit({ password: true });
      const userData = updateUserSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Falha ao atualizar usuário" });
      }
      
      // Exclude password from response
      const { password, ...userResponse } = updatedUser;
      
      res.json(userResponse);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Health Metrics routes
  app.get("/api/health-metrics", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const type = req.query.type as string | undefined;
      
      let metrics;
      if (type) {
        metrics = await storage.getHealthMetricsByType(userId, type);
      } else {
        metrics = await storage.getHealthMetrics(userId);
      }
      
      res.json(metrics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar métricas de saúde" });
    }
  });
  
  app.get("/api/health-metrics/recent", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string || "5");
      
      const metrics = await storage.getRecentHealthMetrics(userId, limit);
      res.json(metrics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar métricas recentes" });
    }
  });
  
  app.post("/api/health-metrics", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const metricData = insertHealthMetricSchema.parse({
        ...req.body,
        userId
      });
      
      const metric = await storage.createHealthMetric(metricData);
      res.status(201).json(metric);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Appointment routes
  app.get("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const status = req.query.status as string | undefined;
      
      let appointments;
      if (status) {
        appointments = await storage.getAppointmentsByStatus(userId, status);
      } else {
        appointments = await storage.getAppointments(userId);
      }
      
      res.json(appointments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar consultas" });
    }
  });
  
  app.get("/api/appointments/upcoming", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const appointments = await storage.getUpcomingAppointments(userId);
      res.json(appointments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar próximas consultas" });
    }
  });
  
  app.post("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        userId
      });
      
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  app.put("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const appointmentId = parseInt(req.params.id);
      
      // Validate update data
      const updateAppointmentSchema = insertAppointmentSchema.partial().omit({ userId: true });
      const appointmentData = updateAppointmentSchema.parse(req.body);
      
      // Get the appointment to verify ownership
      const appointments = await storage.getAppointments(userId);
      const appointment = appointments.find(a => a.id === appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: "Consulta não encontrada ou não pertence ao usuário" });
      }
      
      const updatedAppointment = await storage.updateAppointment(appointmentId, appointmentData);
      
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Falha ao atualizar consulta" });
      }
      
      res.json(updatedAppointment);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Medication routes
  app.get("/api/medications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const active = req.query.active === "true";
      
      let medications;
      if (active) {
        medications = await storage.getActiveMedications(userId);
      } else {
        medications = await storage.getMedications(userId);
      }
      
      res.json(medications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar medicamentos" });
    }
  });
  
  app.post("/api/medications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const medicationData = insertMedicationSchema.parse({
        ...req.body,
        userId
      });
      
      const medication = await storage.createMedication(medicationData);
      res.status(201).json(medication);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  app.put("/api/medications/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const medicationId = parseInt(req.params.id);
      
      // Validate update data
      const updateMedicationSchema = insertMedicationSchema.partial().omit({ userId: true });
      const medicationData = updateMedicationSchema.parse(req.body);
      
      // Get the medication to verify ownership
      const medications = await storage.getMedications(userId);
      const medication = medications.find(m => m.id === medicationId);
      
      if (!medication) {
        return res.status(404).json({ message: "Medicamento não encontrado ou não pertence ao usuário" });
      }
      
      const updatedMedication = await storage.updateMedication(medicationId, medicationData);
      
      if (!updatedMedication) {
        return res.status(404).json({ message: "Falha ao atualizar medicamento" });
      }
      
      res.json(updatedMedication);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Medical Record routes
  app.get("/api/medical-records", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const records = await storage.getMedicalRecords(userId);
      res.json(records);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar prontuários" });
    }
  });
  
  app.post("/api/medical-records", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const recordData = insertMedicalRecordSchema.parse({
        ...req.body,
        userId
      });
      
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Medical Exam routes
  app.get("/api/medical-exams", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const exams = await storage.getMedicalExams(userId);
      res.json(exams);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar exames" });
    }
  });
  
  app.post("/api/medical-exams", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const examData = insertMedicalExamSchema.parse({
        ...req.body,
        userId
      });
      
      const exam = await storage.createMedicalExam(examData);
      res.status(201).json(exam);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  app.put("/api/medical-exams/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const examId = parseInt(req.params.id);
      
      // Validate update data
      const updateExamSchema = insertMedicalExamSchema.partial().omit({ userId: true });
      const examData = updateExamSchema.parse(req.body);
      
      // Get the exam to verify ownership
      const exams = await storage.getMedicalExams(userId);
      const exam = exams.find(e => e.id === examId);
      
      if (!exam) {
        return res.status(404).json({ message: "Exame não encontrado ou não pertence ao usuário" });
      }
      
      const updatedExam = await storage.updateMedicalExam(examId, examData);
      
      if (!updatedExam) {
        return res.status(404).json({ message: "Falha ao atualizar exame" });
      }
      
      res.json(updatedExam);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Achievement routes
  app.get("/api/achievements", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const achievements = await storage.getAchievements(userId);
      res.json(achievements);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar conquistas" });
    }
  });
  
  app.get("/api/achievements/recent", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string || "3");
      
      const achievements = await storage.getRecentAchievements(userId, limit);
      res.json(achievements);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar conquistas recentes" });
    }
  });
  
  // User dashboard data
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Get upcoming appointments
      const upcomingAppointments = await storage.getUpcomingAppointments(userId);
      
      // Get active medications
      const activeMedications = await storage.getActiveMedications(userId);
      
      // Get recent health metrics
      const recentHealthMetrics = await storage.getRecentHealthMetrics(userId, 10);
      
      // Get recent achievements
      const recentAchievements = await storage.getRecentAchievements(userId, 3);
      
      // Extract health summary (latest metrics of each type)
      const metricsByType: Record<string, any> = {};
      for (const metric of recentHealthMetrics) {
        if (!metricsByType[metric.type] || 
            new Date(metric.timestamp) > new Date(metricsByType[metric.type].timestamp)) {
          metricsByType[metric.type] = metric;
        }
      }
      
      const healthSummary = Object.values(metricsByType);
      
      res.json({
        user: {
          id: user.id,
          fullName: user.fullName,
          healthPlanName: user.healthPlanName,
          level: user.level,
          points: user.points
        },
        upcomingAppointments,
        activeMedications,
        healthSummary,
        recentAchievements
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao carregar dados do dashboard" });
    }
  });
  
  return httpServer;
}
