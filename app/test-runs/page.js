"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  orderBy,
  limit,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebase() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  const db = getFirestore();
  const storage = getStorage();
  return { db, storage };
}

const TEST_CASES = [
  {
    id: "E2E-001",
    title: "Inscription vendeur + soumission boutique",
    group: "Onboarding vendeurs",
    priority: "P0",
    tags: ["seller", "onboarding", "admin"],
    steps: [
      "Créer un compte vendeur",
      "Soumettre la boutique avec pièces et infos",
      "Vérifier la réception côté admin",
    ],
    expected:
      "Le vendeur apparaît côté admin avec le statut PENDING et toutes les infos visibles.",
  },
  {
    id: "E2E-002",
    title: "Validation vendeur par admin",
    group: "Onboarding vendeurs",
    priority: "P0",
    tags: ["seller", "admin", "verification"],
    steps: [
      "Admin vérifie téléphone et position",
      "Admin valide le vendeur",
    ],
    expected:
      "Le vendeur passe en APPROVED et peut publier des produits.",
  },
  {
    id: "E2E-010",
    title: "Publication produit vendeur",
    group: "Catalogue & validation",
    priority: "P0",
    tags: ["product", "approval", "mobile"],
    steps: [
      "Vendeur ajoute un produit",
      "Admin valide le produit",
      "Contrôler la visibilité côté mobile",
    ],
    expected:
      "Le produit validé est visible dans l'app mobile.",
  },
  {
    id: "E2E-013",
    title: "Désactivation produit par admin ou vendeur",
    group: "Catalogue & validation",
    priority: "P1",
    tags: ["product", "deactivate", "mobile"],
    steps: [
      "Désactiver un produit (admin ou vendeur)",
      "Vérifier la disparition côté mobile",
    ],
    expected: "Le produit n'est plus visible dans l'app mobile.",
  },
];

const STATUS_OPTIONS = ["PASS", "FAIL", "BLOCKED", "NOT_TESTED"];
const STATUS_LABELS = {
  PASS: "RÉUSSI",
  FAIL: "ÉCHEC",
  BLOCKED: "BLOQUÉ",
  NOT_TESTED: "NON TESTÉ",
};

function formatDate(value) {
  if (!value) return "";
  const date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleString();
}

export default function TestRunsPage() {
  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});
  const [meta, setMeta] = useState({
    testerName: "",
    testerEmail: "",
    env: "prod",
    businessVersion: "",
    adminVersion: "",
    mobileVersion: "",
  });

  const refs = useRef({});

  const totalCases = TEST_CASES.length;
  const savedResultsCount = Object.values(results).filter(
    (r) => r && r.__saved
  ).length;

  const passCount = Object.values(results).filter(
    (r) => r?.status === "PASS"
  ).length;
  const failCount = Object.values(results).filter(
    (r) => r?.status === "FAIL"
  ).length;
  const blockedCount = Object.values(results).filter(
    (r) => r?.status === "BLOCKED"
  ).length;

  const passRateDenom = passCount + failCount + blockedCount;
  const passRate =
    passRateDenom === 0 ? 0 : Math.round((passCount / passRateDenom) * 100);

  const notTestedIds = TEST_CASES.filter(
    (t) => results[t.id]?.status !== "PASS" &&
      results[t.id]?.status !== "FAIL" &&
      results[t.id]?.status !== "BLOCKED"
  ).map((t) => t.id);

  const failIds = TEST_CASES.filter((t) => results[t.id]?.status === "FAIL").map(
    (t) => t.id
  );

  useEffect(() => {
    loadRuns();
  }, []);

  async function loadRuns() {
    setLoadingRuns(true);
    setGlobalError("");
    try {
      const { db } = getFirebase();
      const q = query(
        collection(db, "testRuns"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setRuns(list);
    } catch (err) {
      setGlobalError("Impossible de charger les runs récents.");
    } finally {
      setLoadingRuns(false);
    }
  }

  async function loadResults(selectedRunId) {
    if (!selectedRunId) return;
    setLoadingResults(true);
    setGlobalError("");
    setErrors({});
    try {
      const { db } = getFirebase();
      const snap = await getDocs(
        collection(db, "testRuns", selectedRunId, "results")
      );
      const map = {};
      snap.forEach((docSnap) => {
        map[docSnap.id] = {
          ...docSnap.data(),
          __saved: true,
        };
      });
      setResults(map);
    } catch (err) {
      setGlobalError("Impossible de charger les résultats du run.");
    } finally {
      setLoadingResults(false);
    }
  }

  async function handleCreateRun() {
    setGlobalError("");
    try {
      const { db } = getFirebase();
      const docRef = await addDoc(collection(db, "testRuns"), {
        ...meta,
        createdAt: serverTimestamp(),
      });
      setRunId(docRef.id);
      setResults({});
      await loadRuns();
      await loadResults(docRef.id);
    } catch (err) {
      setGlobalError("Impossible de créer le run.");
    }
  }

  function updateResult(testCaseId, patch) {
    setResults((prev) => ({
      ...prev,
      [testCaseId]: {
        evidenceUrls: [],
        ...prev[testCaseId],
        ...patch,
      },
    }));
  }

  function validateCase(testCaseId) {
    const result = results[testCaseId] || {};
    const errs = {};
    if (!result.status) {
      errs.status = "Veuillez choisir un statut.";
    }
    if (result.status === "FAIL" && (!result.evidenceUrls || result.evidenceUrls.length < 1)) {
      errs.evidence = "Une preuve est requise pour ÉCHEC.";
    }
    if (result.status === "BLOCKED" && !result.blockedReason) {
      errs.blockedReason = "La raison est obligatoire pour BLOQUÉ.";
    }
    setErrors((prev) => ({ ...prev, [testCaseId]: errs }));
    return Object.keys(errs).length === 0;
  }

  async function handleSaveCase(testCaseId) {
    if (!runId) {
      setGlobalError("Veuillez créer ou sélectionner un run.");
      return;
    }
    if (!validateCase(testCaseId)) return;
    try {
      const { db } = getFirebase();
      const result = results[testCaseId] || {};
      await setDoc(
        doc(db, "testRuns", runId, "results", testCaseId),
        {
          status: result.status || "NOT_TESTED",
          comment: result.comment || "",
          blockedReason: result.blockedReason || "",
          sellerId: result.sellerId || "",
          productId: result.productId || "",
          orderId: result.orderId || "",
          evidenceUrls: result.evidenceUrls || [],
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      updateResult(testCaseId, { __saved: true });
      setErrors((prev) => ({ ...prev, [testCaseId]: {} }));
    } catch (err) {
      setGlobalError("Erreur lors de la sauvegarde du test case.");
    }
  }

  async function handleSaveAll() {
    if (!runId) {
      setGlobalError("Veuillez créer ou sélectionner un run.");
      return;
    }
    setSavingAll(true);
    setGlobalError("");
    let ok = true;
    TEST_CASES.forEach((t) => {
      if (!validateCase(t.id)) ok = false;
    });
    if (!ok) {
      setSavingAll(false);
      return;
    }
    for (const testCase of TEST_CASES) {
      await handleSaveCase(testCase.id);
    }
    setSavingAll(false);
  }

  async function handleUpload(testCaseId, files) {
    if (!runId) {
      setGlobalError("Veuillez créer ou sélectionner un run avant l'upload.");
      return;
    }
    if (!files || files.length === 0) return;
    try {
      const { storage } = getFirebase();
      const uploads = [];
      for (const file of files) {
        const path = `evidence/${runId}/${testCaseId}/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, path);
        const snap = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snap.ref);
        uploads.push(url);
      }
      const existing = results[testCaseId]?.evidenceUrls || [];
      updateResult(testCaseId, {
        evidenceUrls: [...existing, ...uploads],
      });
    } catch (err) {
      setGlobalError("Erreur lors de l'upload des preuves.");
    }
  }

  const groupedCases = useMemo(() => {
    const groups = {};
    for (const testCase of TEST_CASES) {
      if (!groups[testCase.group]) groups[testCase.group] = [];
      groups[testCase.group].push(testCase);
    }
    return groups;
  }, []);

  return (
    <div className="min-h-screen bg-[#fff7f0] text-gray-900 px-4 sm:px-8 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-widest text-orange-600 font-semibold">
            Monmarché QA
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold">
            Tableau de bord des tests
          </h1>
          <p className="text-gray-600">
            Centralisez vos scénarios E2E, résultats et preuves en un seul endroit.
          </p>
          <p className="text-sm text-gray-600">
            Merci d’aider l’équipe Monmarché à améliorer l’application. Votre
            rigueur est essentielle — chaque test renforce la qualité et la
            confiance des utilisateurs.
          </p>
        </header>

        {globalError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-800">
            {globalError}
          </div>
        )}

        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Créer un run
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="w-full rounded-xl border border-orange-100 px-4 py-2"
                placeholder="Nom du testeur"
                value={meta.testerName}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, testerName: e.target.value }))
                }
              />
              <input
                className="w-full rounded-xl border border-orange-100 px-4 py-2"
                placeholder="Email du testeur"
                value={meta.testerEmail}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, testerEmail: e.target.value }))
                }
              />
              <div className="w-full rounded-xl border border-orange-100 px-4 py-2 bg-orange-50 text-orange-700 font-semibold">
                Environnement : PROD
              </div>
              <input
                className="w-full rounded-xl border border-orange-100 px-4 py-2"
                placeholder="Version business"
                value={meta.businessVersion}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    businessVersion: e.target.value,
                  }))
                }
              />
              <input
                className="w-full rounded-xl border border-orange-100 px-4 py-2"
                placeholder="Version admin"
                value={meta.adminVersion}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    adminVersion: e.target.value,
                  }))
                }
              />
              <input
                className="w-full rounded-xl border border-orange-100 px-4 py-2"
                placeholder="Version mobile"
                value={meta.mobileVersion}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    mobileVersion: e.target.value,
                  }))
                }
              />
            </div>
            <button
              className="w-full rounded-full bg-[#ff6f00] text-white font-semibold py-3 hover:bg-orange-600"
              onClick={handleCreateRun}
            >
              Démarrer le run
            </button>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Runs récents</h2>
            {loadingRuns ? (
              <p className="text-sm text-gray-500">Chargement…</p>
            ) : (
              <select
                className="w-full rounded-xl border border-orange-100 px-4 py-2"
                value={runId}
                onChange={(e) => {
                  const value = e.target.value;
                  setRunId(value);
                  loadResults(value);
                }}
              >
                <option value="">Sélectionner un run</option>
                {runs.map((run) => (
                  <option key={run.id} value={run.id}>
                    {run.testerName || "Session"} — {formatDate(run.createdAt)}
                  </option>
                ))}
              </select>
            )}
            {runId && (
              <div className="text-sm text-gray-600">
                Run actif : <span className="font-semibold">{runId}</span>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-sm text-orange-700 font-semibold">Couverture</p>
              <p className="text-3xl font-bold">
                {savedResultsCount}/{totalCases}
              </p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-sm text-green-700 font-semibold">Taux de réussite</p>
              <p className="text-3xl font-bold">{passRate}%</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4">
              <p className="text-sm text-yellow-700 font-semibold">NON TESTÉ</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {notTestedIds.length === 0 && (
                  <span className="text-xs text-gray-500">Aucun</span>
                )}
                {notTestedIds.map((id) => (
                  <button
                    key={id}
                    className="text-xs px-2 py-1 rounded-full bg-yellow-200"
                    onClick={() => refs.current[id]?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-sm text-red-700 font-semibold">ÉCHEC</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {failIds.length === 0 && (
                  <span className="text-xs text-gray-500">Aucun</span>
                )}
                {failIds.map((id) => (
                  <button
                    key={id}
                    className="text-xs px-2 py-1 rounded-full bg-red-200"
                    onClick={() => refs.current[id]?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Checklist E2E</h2>
          <button
            className="rounded-full bg-gray-900 text-white px-6 py-2 font-semibold hover:bg-black disabled:opacity-50"
            onClick={handleSaveAll}
            disabled={savingAll || loadingResults}
          >
            {savingAll ? "Sauvegarde..." : "Tout enregistrer"}
          </button>
        </section>

        {loadingResults ? (
          <p className="text-sm text-gray-500">Chargement des résultats…</p>
        ) : (
          Object.entries(groupedCases).map(([groupName, cases]) => (
            <section key={groupName} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">{groupName}</h3>
              <div className="grid gap-6">
                {cases.map((testCase) => {
                  const result = results[testCase.id] || {};
                  const err = errors[testCase.id] || {};
                  return (
                    <div
                      key={testCase.id}
                      ref={(el) => {
                        refs.current[testCase.id] = el;
                      }}
                      className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs uppercase tracking-widest text-orange-600 font-semibold">
                              {testCase.id}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700">
                              {testCase.priority}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold">{testCase.title}</h4>
                          <div className="text-sm text-gray-600">
                            <p className="font-semibold text-gray-800">Étapes</p>
                            <ul className="list-disc list-inside">
                              {testCase.steps.map((step) => (
                                <li key={step}>{step}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p className="font-semibold text-gray-800">Expected</p>
                            <p>{testCase.expected}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {testCase.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="text-sm font-semibold">Statut</label>
                            <select
                              className="w-full mt-1 rounded-xl border border-orange-100 px-3 py-2"
                              value={result.status || ""}
                              onChange={(e) =>
                                updateResult(testCase.id, { status: e.target.value })
                              }
                            >
                              <option value="">Choisir</option>
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {STATUS_LABELS[status]}
                                </option>
                              ))}
                            </select>
                            {err.status && (
                              <p className="text-xs text-red-600 mt-1">{err.status}</p>
                            )}
                          </div>

                          <div className="grid sm:grid-cols-3 gap-3">
                            <input
                              className="rounded-xl border border-orange-100 px-3 py-2"
                              placeholder="sellerId"
                              value={result.sellerId || ""}
                              onChange={(e) =>
                                updateResult(testCase.id, { sellerId: e.target.value })
                              }
                            />
                            <input
                              className="rounded-xl border border-orange-100 px-3 py-2"
                              placeholder="productId"
                              value={result.productId || ""}
                              onChange={(e) =>
                                updateResult(testCase.id, { productId: e.target.value })
                              }
                            />
                            <input
                              className="rounded-xl border border-orange-100 px-3 py-2"
                              placeholder="orderId"
                              value={result.orderId || ""}
                              onChange={(e) =>
                                updateResult(testCase.id, { orderId: e.target.value })
                              }
                            />
                          </div>

                          <textarea
                            className="w-full rounded-xl border border-orange-100 px-3 py-2 min-h-[90px]"
                            placeholder="Commentaire"
                            value={result.comment || ""}
                            onChange={(e) =>
                              updateResult(testCase.id, { comment: e.target.value })
                            }
                          />

                          <textarea
                            className="w-full rounded-xl border border-orange-100 px-3 py-2 min-h-[70px]"
                            placeholder="Raison de blocage"
                            value={result.blockedReason || ""}
                            onChange={(e) =>
                              updateResult(testCase.id, { blockedReason: e.target.value })
                            }
                          />
                          {err.blockedReason && (
                            <p className="text-xs text-red-600">{err.blockedReason}</p>
                          )}

                          <div className="space-y-2">
                            <label className="text-sm font-semibold">Preuves</label>
                            <input
                              type="file"
                              multiple
                              onChange={(e) => handleUpload(testCase.id, e.target.files)}
                            />
                            {err.evidence && (
                              <p className="text-xs text-red-600">{err.evidence}</p>
                            )}
                            {result.evidenceUrls && result.evidenceUrls.length > 0 && (
                              <ul className="text-xs text-blue-600 space-y-1">
                                {result.evidenceUrls.map((url) => (
                                  <li key={url}>
                                    <a href={url} target="_blank" rel="noreferrer">
                                      {url}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              className="rounded-full bg-[#ff6f00] text-white px-5 py-2 font-semibold hover:bg-orange-600"
                              onClick={() => handleSaveCase(testCase.id)}
                            >
                              Enregistrer
                            </button>
                            {result.__saved && (
                              <span className="text-xs text-green-700">
                                Enregistré
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
