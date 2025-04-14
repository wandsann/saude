import { 
  users, User, InsertUser, UserRole, UserRoleType,
  healthMetrics, HealthMetric, InsertHealthMetric,
  appointments, Appointment, InsertAppointment,
  medications, Medication, InsertMedication,
  medicalRecords, MedicalRecord, InsertMedicalRecord,
  medicalExams, MedicalExam, InsertMedicalExam,
  achievements, Achievement, InsertAchievement,
  tasks, Task, InsertTask,
  facilities, Facility, InsertFacility
} from "@shared/schema";

// Database interface to handle all storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByCPF(cpf: string): Promise<User | undefined>;
  getUsersByRole(role: UserRoleType): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Health metrics methods
  getHealthMetrics(userId: number): Promise<HealthMetric[]>;
  getHealthMetricsByType(userId: number, type: string): Promise<HealthMetric[]>;
  getRecentHealthMetrics(userId: number, limit: number): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  
  // Appointment methods
  getAppointments(userId: number): Promise<Appointment[]>;
  getAppointmentsByStatus(userId: number, status: string): Promise<Appointment[]>;
  getUpcomingAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment | undefined>;
  
  // Medication methods
  getMedications(userId: number): Promise<Medication[]>;
  getActiveMedications(userId: number): Promise<Medication[]>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, data: Partial<Medication>): Promise<Medication | undefined>;
  
  // Medical record methods
  getMedicalRecords(userId: number): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  
  // Medical exam methods
  getMedicalExams(userId: number): Promise<MedicalExam[]>;
  createMedicalExam(exam: InsertMedicalExam): Promise<MedicalExam>;
  updateMedicalExam(id: number, data: Partial<MedicalExam>): Promise<MedicalExam | undefined>;
  
  // Achievement methods
  getAchievements(userId: number): Promise<Achievement[]>;
  getRecentAchievements(userId: number, limit: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Task methods
  getTasks(userId: number): Promise<Task[]>;
  getTasksByStatus(userId: number, status: string): Promise<Task[]>;
  getAssignedTasks(userId: number): Promise<Task[]>;
  getPendingTasks(userId: number): Promise<Task[]>;
  getTasksByType(userId: number, taskType: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, data: Partial<Task>): Promise<Task | undefined>;
  completeTask(id: number): Promise<Task | undefined>;
  
  // Facility methods
  getFacilities(): Promise<Facility[]>;
  getFacility(id: number): Promise<Facility | undefined>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: number, data: Partial<Facility>): Promise<Facility | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthMetrics: Map<number, HealthMetric>;
  private appointments: Map<number, Appointment>;
  private medications: Map<number, Medication>;
  private medicalRecords: Map<number, MedicalRecord>;
  private medicalExams: Map<number, MedicalExam>;
  private achievements: Map<number, Achievement>;
  private tasks: Map<number, Task>;
  private facilities: Map<number, Facility>;
  
  private userId: number = 1;
  private healthMetricId: number = 1;
  private appointmentId: number = 1;
  private medicationId: number = 1;
  private medicalRecordId: number = 1;
  private medicalExamId: number = 1;
  private achievementId: number = 1;
  private taskId: number = 1;
  private facilityId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.healthMetrics = new Map();
    this.appointments = new Map();
    this.medications = new Map();
    this.medicalRecords = new Map();
    this.medicalExams = new Map();
    this.achievements = new Map();
    this.tasks = new Map();
    this.facilities = new Map();
    
    // Add some initial data
    this.setupInitialData();
  }

  private setupInitialData() {
    // Create hospital facility
    const hospitalSantaCasa: InsertFacility = {
      name: "Santa Casa de Misericórdia",
      type: "hospital",
      address: "Av. Sete de Setembro, 1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "01000-000",
      phone: "+55 11 3333-4444",
      email: "contato@santacasa.org",
      website: "www.santacasa.org",
      departments: ["Clínica Geral", "Cardiologia", "Ortopedia", "Pediatria", "Neurologia"]
    };
    this.createFacility(hospitalSantaCasa);
    
    // Create a patient user
    const patientUser: InsertUser = {
      username: "anasilva",
      password: "$2a$10$X7oNv1NNdGHO6nlWgqmRIOL.BzPeXZNt0s0xhqHlnY4yBI5/.vVYS", // hashed "password123"
      fullName: "Ana Silva",
      cpf: "123.456.789-00",
      birthDate: new Date("1988-06-15"),
      gender: "female",
      email: "ana.silva@example.com",
      phone: "+55 11 98765-4321",
      address: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      healthPlanName: "Plano Premium",
      healthPlanNumber: "87654321",
      language: "pt",
      role: UserRole.PATIENT
    };
    this.createUser(patientUser);
    
    // Create a doctor user
    const doctorUser: InsertUser = {
      username: "drcarlos",
      password: "$2a$10$X7oNv1NNdGHO6nlWgqmRIOL.BzPeXZNt0s0xhqHlnY4yBI5/.vVYS", // hashed "password123"
      fullName: "Dr. Carlos Oliveira",
      cpf: "234.567.890-00",
      birthDate: new Date("1975-03-22"),
      gender: "male",
      email: "dr.carlos@example.com",
      phone: "+55 11 97777-8888",
      address: "Av. Paulista, 1500",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-200",
      language: "pt",
      role: UserRole.DOCTOR,
      specialty: "Cardiologia",
      department: "Cardiologia"
    };
    this.createUser(doctorUser);
    
    // Create a nurse user
    const nurseUser: InsertUser = {
      username: "enfmariana",
      password: "$2a$10$X7oNv1NNdGHO6nlWgqmRIOL.BzPeXZNt0s0xhqHlnY4yBI5/.vVYS", // hashed "password123"
      fullName: "Enfermeira Mariana Santos",
      cpf: "345.678.901-00",
      birthDate: new Date("1990-08-10"),
      gender: "female",
      email: "mariana.enf@example.com",
      phone: "+55 11 95555-6666",
      address: "Rua Augusta, 300",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
      language: "pt",
      role: UserRole.NURSE,
      department: "Clínica Geral"
    };
    this.createUser(nurseUser);
    
    // Create a cleaner user
    const cleanerUser: InsertUser = {
      username: "limpjose",
      password: "$2a$10$X7oNv1NNdGHO6nlWgqmRIOL.BzPeXZNt0s0xhqHlnY4yBI5/.vVYS", // hashed "password123"
      fullName: "José da Silva",
      cpf: "456.789.012-00",
      birthDate: new Date("1982-05-25"),
      gender: "male",
      email: "jose.limpeza@example.com",
      phone: "+55 11 94444-5555",
      address: "Rua dos Pinheiros, 500",
      city: "São Paulo",
      state: "SP",
      zipCode: "05422-000",
      language: "pt",
      role: UserRole.CLEANER,
      department: "Limpeza"
    };
    this.createUser(cleanerUser);
    
    // Create a cook user
    const cookUser: InsertUser = {
      username: "cozlucia",
      password: "$2a$10$X7oNv1NNdGHO6nlWgqmRIOL.BzPeXZNt0s0xhqHlnY4yBI5/.vVYS", // hashed "password123"
      fullName: "Lúcia Ferreira",
      cpf: "567.890.123-00",
      birthDate: new Date("1978-11-12"),
      gender: "female",
      email: "lucia.cozinha@example.com",
      phone: "+55 11 93333-4444",
      address: "Alameda Santos, 700",
      city: "São Paulo",
      state: "SP",
      zipCode: "01419-000",
      language: "pt",
      role: UserRole.COOK,
      department: "Nutrição"
    };
    this.createUser(cookUser);
    
    // Create an admin user
    const adminUser: InsertUser = {
      username: "adminrodrigo",
      password: "$2a$10$X7oNv1NNdGHO6nlWgqmRIOL.BzPeXZNt0s0xhqHlnY4yBI5/.vVYS", // hashed "password123"
      fullName: "Rodrigo Mendes",
      cpf: "678.901.234-00",
      birthDate: new Date("1985-07-03"),
      gender: "male",
      email: "rodrigo.admin@example.com",
      phone: "+55 11 92222-3333",
      address: "Rua Oscar Freire, 900",
      city: "São Paulo",
      state: "SP",
      zipCode: "01426-000",
      language: "pt",
      role: UserRole.ADMIN,
      department: "Administração"
    };
    this.createUser(adminUser);
    
    // Create sample tasks for each type of user
    
    // Task for the nurse
    const nurseTask: InsertTask = {
      assignedToId: 3, // nurse id 
      assignedById: 6, // admin id
      title: "Verificar sinais vitais do paciente do quarto 302",
      description: "Verificar temperatura, pressão arterial e frequência cardíaca",
      taskType: "medical",
      priority: "high",
      status: "pending",
      dueDate: new Date(),
      dueTime: "14:30",
      location: "Quarto 302",
      patientId: 1, // patient id
      notes: "Paciente com histórico de hipertensão"
    };
    this.createTask(nurseTask);
    
    // Task for the cleaner
    const cleanerTask: InsertTask = {
      assignedToId: 4, // cleaner id
      assignedById: 6, // admin id
      title: "Limpeza do setor de emergência",
      description: "Realizar limpeza completa do setor de emergência",
      taskType: "cleaning",
      priority: "medium",
      status: "pending",
      dueDate: new Date(),
      dueTime: "16:00",
      location: "Setor de Emergência",
      notes: "Utilizar material de limpeza hospitalar"
    };
    this.createTask(cleanerTask);
    
    // Task for the cook
    const cookTask: InsertTask = {
      assignedToId: 5, // cook id
      assignedById: 6, // admin id
      title: "Preparar jantar para pacientes",
      description: "Preparar jantar considerando as dietas específicas",
      taskType: "cooking",
      priority: "medium",
      status: "pending",
      dueDate: new Date(),
      dueTime: "18:00",
      location: "Cozinha",
      notes: "Atenção para pacientes com dieta restrita"
    };
    this.createTask(cookTask);
    
    // Task for the doctor
    const doctorTask: InsertTask = {
      assignedToId: 2, // doctor id
      assignedById: 6, // admin id
      title: "Avaliar resultados de exames",
      description: "Analisar resultados dos exames cardíacos e fornecer diagnóstico",
      taskType: "medical",
      priority: "high",
      status: "pending",
      dueDate: new Date(),
      dueTime: "15:30",
      location: "Consultório 5",
      patientId: 1, // patient id
      notes: "Exames de ecocardiograma e eletrocardiograma"
    };
    this.createTask(doctorTask);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async getUserByCPF(cpf: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.cpf === cpf
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...userData, id, level: 1, points: 0 };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Health metrics methods
  async getHealthMetrics(userId: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      (metric) => metric.userId === userId
    );
  }
  
  async getHealthMetricsByType(userId: number, type: string): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      (metric) => metric.userId === userId && metric.type === type
    );
  }
  
  async getRecentHealthMetrics(userId: number, limit: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values())
      .filter((metric) => metric.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
  
  async createHealthMetric(metricData: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.healthMetricId++;
    const metric: HealthMetric = { ...metricData, id };
    this.healthMetrics.set(id, metric);
    return metric;
  }
  
  // Appointment methods
  async getAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId
    );
  }
  
  async getAppointmentsByStatus(userId: number, status: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId && appointment.status === status
    );
  }
  
  async getUpcomingAppointments(userId: number): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.appointments.values())
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointment.userId === userId && 
               appointmentDate >= today && 
               appointment.status !== "canceled";
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  }
  
  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const appointment: Appointment = { ...appointmentData, id };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...data };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  // Medication methods
  async getMedications(userId: number): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(
      (medication) => medication.userId === userId
    );
  }
  
  async getActiveMedications(userId: number): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(
      (medication) => medication.userId === userId && medication.status === "active"
    );
  }
  
  async createMedication(medicationData: InsertMedication): Promise<Medication> {
    const id = this.medicationId++;
    const medication: Medication = { ...medicationData, id };
    this.medications.set(id, medication);
    return medication;
  }
  
  async updateMedication(id: number, data: Partial<Medication>): Promise<Medication | undefined> {
    const medication = this.medications.get(id);
    if (!medication) return undefined;
    
    const updatedMedication = { ...medication, ...data };
    this.medications.set(id, updatedMedication);
    return updatedMedication;
  }
  
  // Medical record methods
  async getMedicalRecords(userId: number): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createMedicalRecord(recordData: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = this.medicalRecordId++;
    const record: MedicalRecord = { ...recordData, id };
    this.medicalRecords.set(id, record);
    return record;
  }
  
  // Medical exam methods
  async getMedicalExams(userId: number): Promise<MedicalExam[]> {
    return Array.from(this.medicalExams.values())
      .filter((exam) => exam.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createMedicalExam(examData: InsertMedicalExam): Promise<MedicalExam> {
    const id = this.medicalExamId++;
    const exam: MedicalExam = { ...examData, id };
    this.medicalExams.set(id, exam);
    return exam;
  }
  
  async updateMedicalExam(id: number, data: Partial<MedicalExam>): Promise<MedicalExam | undefined> {
    const exam = this.medicalExams.get(id);
    if (!exam) return undefined;
    
    const updatedExam = { ...exam, ...data };
    this.medicalExams.set(id, updatedExam);
    return updatedExam;
  }
  
  // Achievement methods
  async getAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }
  
  async getRecentAchievements(userId: number, limit: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter((achievement) => achievement.userId === userId)
      .sort((a, b) => new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime())
      .slice(0, limit);
  }
  
  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const id = this.achievementId++;
    const achievement: Achievement = { ...achievementData, id };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Implementação dos novos métodos para usuários
  async getUsersByRole(role: UserRoleType): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === role
    );
  }

  // Implementação dos métodos para tarefas
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.assignedToId === userId
    );
  }
  
  async getTasksByStatus(userId: number, status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.assignedToId === userId && task.status === status
    );
  }
  
  async getAssignedTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.assignedById === userId
    );
  }
  
  async getPendingTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.assignedToId === userId && task.status === "pending"
    );
  }
  
  async getTasksByType(userId: number, taskType: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.assignedToId === userId && task.taskType === taskType
    );
  }
  
  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const task: Task = { ...taskData, id };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, data: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...data };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async completeTask(id: number): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const completedTask = { 
      ...task, 
      status: "completed", 
      completedAt: new Date() 
    };
    this.tasks.set(id, completedTask);
    return completedTask;
  }
  
  // Implementação dos métodos para instalações
  async getFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }
  
  async getFacility(id: number): Promise<Facility | undefined> {
    return this.facilities.get(id);
  }
  
  async createFacility(facilityData: InsertFacility): Promise<Facility> {
    const id = this.facilityId++;
    const facility: Facility = { ...facilityData, id };
    this.facilities.set(id, facility);
    return facility;
  }
  
  async updateFacility(id: number, data: Partial<Facility>): Promise<Facility | undefined> {
    const facility = this.facilities.get(id);
    if (!facility) return undefined;
    
    const updatedFacility = { ...facility, ...data };
    this.facilities.set(id, updatedFacility);
    return updatedFacility;
  }
}

export const storage = new MemStorage();
