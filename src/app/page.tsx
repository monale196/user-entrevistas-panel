"use client";

import React, { useState, useEffect } from "react";

export default function UserEntrevistas() {
  const [tituloES, setTituloES] = useState("");
  const [tituloEN, setTituloEN] = useState("");
  const [descripcionES, setDescripcionES] = useState("");
  const [descripcionEN, setDescripcionEN] = useState("");
  const [fechaISO, setFechaISO] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const MAX_SIZE_MB = 500; // Tamaño máximo de video

  // Preview del video al seleccionarlo
  useEffect(() => {
    if (!videoFile) {
      setVideoPreview(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tituloES || !tituloEN || !descripcionES || !descripcionEN || !fechaISO || !videoFile) {
      setMensaje("Todos los campos son obligatorios, incluido el video");
      return;
    }

    if (videoFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setMensaje(`El video supera el tamaño máximo de ${MAX_SIZE_MB}MB`);
      return;
    }

    setSubmitting(true);
    setMensaje("");

    try {
      const formData = new FormData();
      formData.append("tituloES", tituloES);
      formData.append("tituloEN", tituloEN);
      formData.append("descripcionES", descripcionES);
      formData.append("descripcionEN", descripcionEN);
      formData.append("fechaISO", fechaISO);
      formData.append("video", videoFile);

      // ⚡ Aquí usamos variable de entorno para la URL del backend
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) throw new Error("No se encontró la URL del backend");

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir la entrevista");

      setMensaje("✅ Entrevista subida correctamente");
      setTituloES(""); setTituloEN(""); setDescripcionES(""); setDescripcionEN(""); setFechaISO(""); setVideoFile(null);
      const fileInput = document.getElementById("videoInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al subir la entrevista");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    tituloES && tituloEN && descripcionES && descripcionEN && fechaISO && videoFile;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="max-w-xl w-full bg-white/90 dark:bg-zinc-900 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center text-black dark:text-white">
          Subir nueva entrevista
        </h1>

        {mensaje && (
          <p
            className={`text-center mb-4 ${mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
          >
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Título ES" value={tituloES} onChange={e => setTituloES(e.target.value)} className="w-full p-2 border rounded"/>
          <input type="text" placeholder="Título EN" value={tituloEN} onChange={e => setTituloEN(e.target.value)} className="w-full p-2 border rounded"/>
          <textarea placeholder="Descripción ES" value={descripcionES} onChange={e => setDescripcionES(e.target.value)} className="w-full p-2 border rounded"/>
          <textarea placeholder="Descripción EN" value={descripcionEN} onChange={e => setDescripcionEN(e.target.value)} className="w-full p-2 border rounded"/>
          <input type="date" value={fechaISO} onChange={e => setFechaISO(e.target.value)} className="w-full p-2 border rounded"/>
          <input type="file" id="videoInput" accept="video/*" onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 border rounded" required/>

          {videoPreview && (
            <video className="w-full h-64 rounded-lg mt-2" controls src={videoPreview} />
          )}

          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className={`w-full p-2 rounded-md mt-2 text-white transition ${isFormValid && !submitting ? "bg-[#0a1b2e] hover:bg-[#081222]" : "bg-gray-400 cursor-not-allowed"}`}
          >
            {submitting ? "Subiendo..." : "Subir entrevista"}
          </button>
        </form>
      </div>
    </div>
  );
}
