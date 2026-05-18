import { Brain, Clipboard, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import {
  usePrescriptionExplanationMutation,
  useRiskFlagMutation,
  useSymptomCheckerMutation,
} from "../../features/ai/aiApi";
import { useGetPatientsQuery } from "../../features/patients/patientsApi";
import { useGetPrescriptionsQuery } from "../../features/prescriptions/prescriptionsApi";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import {
  getApiError,
  getItems,
  getPayload,
  patientName,
} from "../../utils/formatters";

export default function AIToolsPage() {
  const access = useRoleAccess();
  const tabs = [
    access.isDoctor && ["symptoms", "Symptom Checker"],
    (access.isDoctor || access.isPatient) && [
      "explain",
      "Prescription Explain",
    ],
    (access.isDoctor || access.isAdmin) && ["risk", "Risk Flagging"],
  ].filter(Boolean);
  const [tab, setTab] = useState(tabs[0]?.[0] || "explain");
  return (
    <>
      <PageHeader
        title="AI Tools"
        subtitle="Clinical assistance powered by AI."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === key ? "bg-teal text-navy" : "bg-navy-card text-slate-300"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "symptoms" ? <SymptomTab /> : null}
      {tab === "explain" ? <ExplainTab /> : null}
      {tab === "risk" ? <RiskTab /> : null}
    </>
  );
}

function PatientSelect({ value, onChange }) {
  const { data } = useGetPatientsQuery({ limit: 100 });
  return (
    <select
      className="field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select patient</option>
      {getItems(data).map((p) => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}

function ResultCard({ result }) {
  if (!result) return null;
  const payload = getPayload(result);
  const level =
    `${payload.riskLevel || payload.level || "unknown"}`.toLowerCase();
  const color =
    level === "high"
      ? "text-danger border-danger/40 bg-danger/10"
      : level === "medium"
        ? "text-warning border-warning/40 bg-warning/10"
        : level === "low"
          ? "text-success border-success/40 bg-success/10"
          : "text-slate-300 border-border bg-navy-secondary";
  return (
    <div className={`mt-5 rounded-lg border p-4 ${color}`}>
      <div className="mb-3 text-lg font-bold capitalize">
        Risk Level: {level}
      </div>
      {payload.fallback ? (
        <div className="mb-3 rounded bg-warning/15 p-3 text-warning">
          AI temporarily unavailable. Record was saved.
        </div>
      ) : null}
      <pre className="whitespace-pre-wrap font-body text-sm text-slate-100">
        {typeof payload === "string"
          ? payload
          : JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}

function SymptomTab() {
  const [patientId, setPatientId] = useState("");
  const [symptom, setSymptom] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [history, setHistory] = useState("");
  const [result, setResult] = useState(null);
  const [check, { isLoading }] = useSymptomCheckerMutation();
  const add = () => {
    if (symptom.trim()) {
      setSymptoms([...symptoms, symptom.trim()]);
      setSymptom("");
    }
  };
  const submit = async () => {
    try {
      const res = await check({
        patientId,
        symptoms,
        age: Number(age),
        gender,
        history,
      }).unwrap();
      setResult(res);
      toast.success("AI analysis complete");
    } catch (error) {
      toast.error(getApiError(error, "Analysis failed"));
    }
  };
  return (
    <div className="panel p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Patient</label>
          <PatientSelect value={patientId} onChange={setPatientId} />
        </div>
        <div>
          <label className="label">Symptoms</label>
          <div className="flex gap-2">
            <input
              className="field"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />
            <button className="btn-secondary" type="button" onClick={add}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <label className="label">Age</label>
          <input
            className="field"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Gender</label>
          <select
            className="field"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option>male</option>
            <option>female</option>
            <option>other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label">Medical History</label>
          <textarea
            className="field min-h-24"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {symptoms.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-2 rounded-full bg-teal/15 px-3 py-1 text-sm text-teal"
          >
            {s}
            <button
              onClick={() => setSymptoms(symptoms.filter((x) => x !== s))}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <button
        className="btn-primary mt-5"
        disabled={isLoading || !patientId || !symptoms.length}
        onClick={submit}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}{" "}
        Run Symptom Check
      </button>
      <ResultCard result={result} />
    </div>
  );
}

function ExplainTab() {
  const { data } = useGetPrescriptionsQuery();
  const [prescriptionId, setPrescriptionId] = useState("");
  const [result, setResult] = useState("");
  const [explain, { isLoading }] = usePrescriptionExplanationMutation();
  const submit = async () => {
    try {
      const res = await explain({ prescriptionId }).unwrap();
      setResult(
        getPayload(res).explanation ||
          getPayload(res).aiExplanation ||
          JSON.stringify(getPayload(res), null, 2)
      );
    } catch (error) {
      toast.error(getApiError(error, "Explanation failed"));
    }
  };
  return (
    <div className="panel p-5">
      <label className="label">Prescription</label>
      <select
        className="field max-w-xl"
        value={prescriptionId}
        onChange={(e) => setPrescriptionId(e.target.value)}
      >
        <option value="">Select prescription</option>
        {getItems(data).map((rx) => (
          <option key={rx._id} value={rx._id}>
            {patientName(rx)} - {rx.createdAt?.slice(0, 10)}
          </option>
        ))}
      </select>
      <button
        className="btn-primary mt-4"
        disabled={isLoading || !prescriptionId}
        onClick={submit}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}{" "}
        Explain Prescription
      </button>
      {result ? (
        <div className="mt-5 rounded-lg border border-teal/40 bg-teal/10 p-4">
          <button
            className="btn-secondary mb-3 py-1.5"
            onClick={() => navigator.clipboard.writeText(result)}
          >
            <Clipboard className="h-4 w-4" /> Copy
          </button>
          <p className="whitespace-pre-wrap text-slate-100">{result}</p>
        </div>
      ) : null}
    </div>
  );
}

function RiskTab() {
  const [patientId, setPatientId] = useState("");
  const [result, setResult] = useState(null);
  const [riskFlag, { isLoading }] = useRiskFlagMutation();
  const submit = async () => {
    try {
      const res = await riskFlag({ patientId }).unwrap();
      setResult(res);
    } catch (error) {
      toast.error(getApiError(error, "Risk analysis failed"));
    }
  };
  return (
    <div className="panel p-5">
      <label className="label">Patient</label>
      <div className="max-w-xl">
        <PatientSelect value={patientId} onChange={setPatientId} />
      </div>
      <button
        className="btn-primary mt-4"
        disabled={isLoading || !patientId}
        onClick={submit}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}{" "}
        Run Risk Flagging
      </button>
      <ResultCard result={result} />
    </div>
  );
}
