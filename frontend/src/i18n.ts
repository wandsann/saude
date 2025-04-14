import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: "Saúde Conectada",
      dashboard: "Dashboard",
      appointments: "Appointments",
      medicalRecords: "Medical Records",
      patients: "Patients",
      reports: "Reports",
      tasks: "Tasks",
      registerDoctor: "Register Doctor",
      registerNurse: "Register Nurse",
      logout: "Logout",
      profile: "Profile",
      settings: "Settings",
    },
  },
  pt: {
    translation: {
      appTitle: "Saúde Conectada",
      dashboard: "Painel",
      appointments: "Agendamentos",
      medicalRecords: "Prontuário Eletrônico",
      patients: "Pacientes",
      reports: "Relatórios",
      tasks: "Tarefas",
      registerDoctor: "Cadastrar Médico",
      registerNurse: "Cadastrar Enfermeiro",
      logout: "Sair",
      profile: "Perfil",
      settings: "Configurações",
    },
  },
  es: {
    translation: {
      appTitle: "Saúde Conectada",
      dashboard: "Tablero",
      appointments: "Citas",
      medicalRecords: "Registros Médicos",
      patients: "Pacientes",
      reports: "Informes",
      tasks: "Tareas",
      registerDoctor: "Registrar Médico",
      registerNurse: "Registrar Enfermero",
      logout: "Cerrar Sesión",
      profile: "Perfil",
      settings: "Configuración",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
