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
  const ai = payload.aiResponse || payload;
  const level =
    `${ai.riskLevel || ai.level || (ai.hasRisk ? "high" : "unknown")}`.toLowerCase();
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
      {Array.isArray(ai.conditions) && ai.conditions.length ? (
        <div className="mb-4">
          <h3 className="mb-2 font-heading font-bold text-slate-100">
            Possible Conditions
          </h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-100">
            {ai.conditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ol>
        </div>
      ) : null}
      {Array.isArray(ai.suggestedTests) && ai.suggestedTests.length ? (
        <div className="mb-4">
          <h3 className="mb-2 font-heading font-bold text-slate-100">
            Suggested Tests
          </h3>
          <div className="flex flex-wrap gap-2">
            {ai.suggestedTests.map((test) => (
              <span
                key={test}
                className="rounded-full bg-teal/15 px-3 py-1 text-sm text-teal"
              >
                {test}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {Array.isArray(ai.riskFactors) && ai.riskFactors.length ? (
        <div className="mb-4">
          <h3 className="mb-2 font-heading font-bold text-slate-100">
            Risk Factors
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-100">
            {ai.riskFactors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {ai.recommendation ? (
        <p className="text-sm text-slate-100">{ai.recommendation}</p>
      ) : null}
      {!ai.conditions?.length &&
      !ai.suggestedTests?.length &&
      !ai.riskFactors?.length &&
      !ai.recommendation ? (
        <pre className="whitespace-pre-wrap font-body text-sm text-slate-100">
          {typeof ai === "string" ? ai : JSON.stringify(ai, null, 2)}
        </pre>
      ) : null}
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
  const [formError, setFormError] = useState("");
  const [check, { isLoading }] = useSymptomCheckerMutation();
  const add = () => {
    if (symptom.trim()) {
      setSymptoms([...symptoms, symptom.trim()]);
      setSymptom("");
    }
  };
  const submit = async () => {
    if (!patientId) {
      setFormError("Select a patient before running symptom checker.");
      return;
    }
    if (!symptoms.length) {
      setFormError("Add at least one symptom.");
      return;
    }
    if (!age || Number(age) < 0 || Number(age) > 150) {
      setFormError("Enter a valid age from 0 to 150.");
      return;
    }
    setFormError("");
    try {
      const payload = {
        patientId,
        symptoms,
        age: Number(age),
        gender,
        history,
      };
      const res = await check(payload).unwrap();
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
        disabled={isLoading}
        onClick={submit}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}{" "}
        Run Symptom Check
      </button>
      {formError ? (
        <p className="mt-2 text-sm text-danger">{formError}</p>
      ) : null}
      <ResultCard result={result} />
    </div>
  );
}

function ExplainTab() {
  const { data } = useGetPrescriptionsQuery();
  const [prescriptionId, setPrescriptionId] = useState("");
  const [result, setResult] = useState("");
  const [formError, setFormError] = useState("");
  const [explain, { isLoading }] = usePrescriptionExplanationMutation();
  const submit = async () => {
    if (!prescriptionId) {
      setFormError("Select a prescription first.");
      return;
    }
    setFormError("");
    try {
      const payload = { prescriptionId };
      const res = await explain(payload).unwrap();
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
        disabled={isLoading}
        onClick={submit}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}{" "}
        Explain Prescription
      </button>
      {formError ? (
        <p className="mt-2 text-sm text-danger">{formError}</p>
      ) : null}
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
  const [formError, setFormError] = useState("");
  const [riskFlag, { isLoading }] = useRiskFlagMutation();
  const submit = async () => {
    if (!patientId) {
      setFormError("Select a patient before running risk flagging.");
      return;
    }
    setFormError("");
    try {
      const payload = { patientId };
      const res = await riskFlag(payload).unwrap();
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
        disabled={isLoading}
        onClick={submit}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}{" "}
        Run Risk Flagging
      </button>
      {formError ? (
        <p className="mt-2 text-sm text-danger">{formError}</p>
      ) : null}
      <ResultCard result={result} />
    </div>
  );
}
