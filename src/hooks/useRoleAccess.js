import { ROLES } from "../utils/constants";
import { useAuth } from "./useAuth";

export function useRoleAccess() {
  const { user } = useAuth();
  const role = user?.role;
  return {
    role,
    isAdmin: role === ROLES.ADMIN,
    isDoctor: role === ROLES.DOCTOR,
    isReceptionist: role === ROLES.RECEPTIONIST,
    isPatient: role === ROLES.PATIENT,
    canManageUsers: role === ROLES.ADMIN,
    canCreatePatient: [ROLES.ADMIN, ROLES.RECEPTIONIST].includes(role),
    canBookAppointment: [
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.PATIENT,
    ].includes(role),
    canWritePrescription: role === ROLES.DOCTOR,
    canUseAI: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT].includes(role),
    canViewAnalytics: [ROLES.ADMIN, ROLES.DOCTOR].includes(role),
    canDownloadPDF: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT].includes(role),
  };
}
