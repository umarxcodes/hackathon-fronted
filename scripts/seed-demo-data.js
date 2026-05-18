const API_URL =
  process.env.VITE_API_URL ||
  process.env.API_URL ||
  "https://hackathon-backend-woad-two.vercel.app/api";

const accounts = {
  admin: {
    name: "Demo Admin",
    email: "admin@clinic.com",
    password: "Admin123",
    role: "admin",
  },
  doctor: {
    name: "Dr. Demo Doctor",
    email: "doctor@clinic.com",
    password: "Doctor123",
    role: "doctor",
  },
  receptionist: {
    name: "Demo Receptionist",
    email: "recep@clinic.com",
    password: "Recep123",
    role: "receptionist",
  },
  patientUser: {
    name: "Demo Patient User",
    email: "patient@clinic.com",
    password: "Patient123",
    role: "patient",
  },
};

const patients = [
  {
    name: "Amina Shah",
    age: 34,
    gender: "female",
    contact: "+92 300 1111111",
    address: "Gulberg, Lahore",
    bloodGroup: "A+",
    allergies: ["Penicillin"],
    medicalHistory: "Seasonal asthma and mild hypertension.",
  },
  {
    name: "Hassan Raza",
    age: 45,
    gender: "male",
    contact: "+92 300 2222222",
    address: "Clifton, Karachi",
    bloodGroup: "B+",
    allergies: ["Dust"],
    medicalHistory: "Type 2 diabetes under observation.",
  },
  {
    name: "Sara Malik",
    age: 28,
    gender: "female",
    contact: "+92 300 3333333",
    address: "F-8, Islamabad",
    bloodGroup: "O+",
    allergies: [],
    medicalHistory: "Recurring migraine history.",
  },
  {
    name: "Bilal Ahmed",
    age: 52,
    gender: "male",
    contact: "+92 300 4444444",
    address: "Model Town, Lahore",
    bloodGroup: "AB+",
    allergies: ["Sulfa drugs"],
    medicalHistory: "High cholesterol and chest discomfort history.",
  },
];

const symptomCases = [
  {
    symptoms: ["fever", "cough", "fatigue"],
    history: "Symptoms started three days ago after travel.",
  },
  {
    symptoms: ["headache", "nausea", "light sensitivity"],
    history: "Patient reports recurring migraine episodes.",
  },
  {
    symptoms: ["chest pain", "shortness of breath"],
    history: "Patient has cholesterol history and recent exertion pain.",
  },
  {
    symptoms: ["skin rash", "itching"],
    history: "Possible allergy after new medication.",
  },
];

const medicines = [
  [
    {
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "3 days",
    },
    {
      name: "Cetirizine",
      dosage: "10mg",
      frequency: "At night",
      duration: "5 days",
    },
  ],
  [
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "After dinner",
      duration: "30 days",
    },
  ],
  [
    {
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "When needed",
      duration: "2 days",
    },
  ],
  [
    {
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "At night",
      duration: "30 days",
    },
  ],
];

const log = (message) => console.log(`\n${message}`);
const ok = (message) => console.log(`  PASS ${message}`);
const warn = (message) => console.warn(`  WARN ${message}`);

function futureDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

async function request(path, { token, method = "GET", body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok || data.success === false) {
    const error = new Error(data.error || data.message || response.statusText);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function registerOrLogin(account) {
  const ensureUsableToken = async (authResult) => {
    await request("/auth/me", { token: authResult.token });
    return authResult;
  };
  try {
    const registered = await request("/auth/register", {
      method: "POST",
      body: account,
    });
    const token = registered.data?.token || registered.token;
    if (!token) throw new Error("Register response did not include token");
    ok(`registered ${account.role}: ${account.email}`);
    return ensureUsableToken({
      token,
      user: registered.data?.user || registered.user,
    });
  } catch (error) {
    if (!`${error.message}`.toLowerCase().includes("already")) throw error;
    const loggedIn = await request("/auth/login", {
      method: "POST",
      body: { email: account.email, password: account.password },
    });
    const token = loggedIn.data?.token || loggedIn.token;
    if (!token) throw new Error("Login response did not include token");
    ok(`logged in ${account.role}: ${account.email}`);
    return ensureUsableToken({
      token,
      user: loggedIn.data?.user || loggedIn.user,
    });
  }
}

async function registerOrLoginWithFallback(account) {
  try {
    return await registerOrLogin(account);
  } catch (error) {
    if (!`${error.message}`.toLowerCase().includes("deactivated")) throw error;
    const suffix = Date.now();
    const fallback = {
      ...account,
      email: account.email.replace("@", `+seed${suffix}@`),
    };
    warn(`${account.email} is deactivated, using ${fallback.email}`);
    return registerOrLogin(fallback);
  }
}

async function createPatient(token, patient) {
  try {
    const created = await request("/patients", {
      token,
      method: "POST",
      body: patient,
    });
    ok(`created patient: ${patient.name}`);
    return created.data;
  } catch (error) {
    warn(`patient create skipped for ${patient.name}: ${error.message}`);
    const list = await request(
      `/patients?limit=100&search=${encodeURIComponent(patient.name)}`,
      { token }
    );
    const existing = list.data?.find?.((item) => item.name === patient.name);
    if (!existing) throw error;
    ok(`using existing patient: ${patient.name}`);
    return existing;
  }
}

async function main() {
  log(`Using API: ${API_URL}`);

  log("1. Creating/logging test accounts");
  const admin = await registerOrLoginWithFallback(accounts.admin);
  const doctor = await registerOrLoginWithFallback(accounts.doctor);
  await registerOrLoginWithFallback(accounts.receptionist);
  await registerOrLoginWithFallback(accounts.patientUser);

  log("2. Creating patients");
  const createdPatients = [];
  for (const patient of patients) {
    createdPatients.push(await createPatient(admin.token, patient));
  }

  log("3. Creating appointments");
  const timeSlots = ["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"];
  const appointments = [];
  for (let index = 0; index < createdPatients.length; index += 1) {
    const appointment = await request("/appointments", {
      token: admin.token,
      method: "POST",
      body: {
        patientId: createdPatients[index]._id,
        doctorId: doctor.user._id,
        date: futureDate(index + 1),
        timeSlot: timeSlots[index],
        notes: `Seeded appointment for ${createdPatients[index].name}`,
      },
    }).catch(async (error) => {
      warn(`appointment create skipped: ${error.message}`);
      const list = await request("/appointments", { token: admin.token });
      return {
        data: list.data?.find?.(
          (item) => item.patientId?._id === createdPatients[index]._id
        ),
      };
    });
    if (appointment.data?._id) {
      appointments.push(appointment.data);
      ok(`appointment ready: ${createdPatients[index].name}`);
    }
  }

  log("4. Updating appointment statuses");
  for (let index = 0; index < appointments.length; index += 1) {
    const status = index % 2 === 0 ? "completed" : "confirmed";
    await request(`/appointments/${appointments[index]._id}`, {
      token: doctor.token,
      method: "PUT",
      body: {
        status,
        notes: `Seeded ${status} status for analytics testing`,
      },
    });
    ok(`appointment marked ${status}`);
  }

  log("5. Creating prescriptions");
  const prescriptions = [];
  for (let index = 0; index < appointments.length; index += 1) {
    const prescription = await request("/prescriptions", {
      token: doctor.token,
      method: "POST",
      body: {
        patientId: createdPatients[index]._id,
        doctorId: doctor.user._id,
        appointmentId: appointments[index]._id,
        medicines: medicines[index],
        instructions:
          "Take medicine after meals and follow up if symptoms worsen.",
      },
    }).catch((error) => {
      warn(`prescription create skipped: ${error.message}`);
      return null;
    });
    if (prescription?.data?._id) {
      prescriptions.push(prescription.data);
      ok(`prescription created for ${createdPatients[index].name}`);
    }
  }

  log("6. Running AI symptom checker to feed analytics");
  for (let index = 0; index < createdPatients.length; index += 1) {
    const symptomCase = symptomCases[index];
    await request("/ai/symptom-checker", {
      token: doctor.token,
      method: "POST",
      body: {
        patientId: createdPatients[index]._id,
        symptoms: symptomCase.symptoms,
        age: createdPatients[index].age,
        gender: createdPatients[index].gender,
        history: symptomCase.history,
      },
    });
    ok(`AI symptom log created for ${createdPatients[index].name}`);
  }

  log("7. Running AI risk flag and prescription explanation");
  await request("/ai/risk-flag", {
    token: doctor.token,
    method: "POST",
    body: { patientId: createdPatients[0]._id },
  });
  ok("risk flag endpoint tested");

  if (prescriptions[0]?._id) {
    await request("/ai/prescription-explanation", {
      token: doctor.token,
      method: "POST",
      body: { prescriptionId: prescriptions[0]._id },
    });
    ok("prescription explanation endpoint tested");
  }

  log("8. Fetching analytics");
  const adminAnalytics = await request("/analytics/admin", {
    token: admin.token,
  });
  const doctorAnalytics = await request("/analytics/doctor", {
    token: doctor.token,
  });
  ok(`admin analytics: ${JSON.stringify(adminAnalytics.data, null, 2)}`);
  ok(`doctor analytics: ${JSON.stringify(doctorAnalytics.data, null, 2)}`);

  log(
    "Demo seed complete. Refresh the frontend dashboard and analytics pages."
  );
}

main().catch((error) => {
  console.error("\nSEED FAILED");
  console.error(`Status: ${error.status || "N/A"}`);
  console.error(`Message: ${error.message}`);
  if (error.data) console.error(JSON.stringify(error.data, null, 2));
  process.exit(1);
});
