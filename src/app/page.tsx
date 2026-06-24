"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        company: formData.get("company"),
        need: formData.get("need"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge urgent">Ouverture prioritaire — places limitées avant sortie officielle</div>

        <h1>
          Bootstrap transforme une idée en application commerciale en quelques minutes.
        </h1>

        <p className="subtitle">
          Un besoin humain, une idée B2B, une opportunité urgente : Bootstrap génère
          l’idée, construit l’application correspondante et permet de la tester très vite.
        </p>

        <div className="stats">
          <div>
            <strong>135+</strong>
            <span>applications créées</span>
          </div>
          <div>
            <strong>quelques minutes</strong>
            <span>pour passer de l’idée au prototype</span>
          </div>
          <div>
            <strong>accès limité</strong>
            <span>priorité aux premiers inscrits</span>
          </div>
        </div>

        <div className="content">
          <div className="explain">
            <h2>Ce que fait Bootstrap</h2>

            <p>
              Bootstrap est une application qui génère des idées commerciales,
              puis crée dans la foulée les applications correspondantes.
            </p>

            <p>
              Le principe est simple : vous partez d’un problème réel —
              par exemple un besoin métier, une urgence, une niche ou une
              opportunité locale — et Bootstrap construit une application prête
              à être testée.
            </p>

            <ul>
              <li>Génération d’idées exploitables</li>
              <li>Création automatique d’applications métiers</li>
              <li>Orientation business dès le départ</li>
              <li>Objectif : vendre, tester, améliorer rapidement</li>
            </ul>

            <p className="note">
              Pour pouvoir commander Bootstrap dès sa sortie officielle,
              l’inscription à la liste prioritaire est obligatoire. Les premiers inscrits seront prévenus avant les autres.
            </p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <h2>Demander un accès prioritaire</h2>

            <label>
              Nom
              <input name="name" type="text" placeholder="Votre nom" required />
            </label>

            <label>
              Email
              <input name="email" type="email" placeholder="votre@email.com" required />
            </label>

            <label>
              Entreprise / activité
              <input name="company" type="text" placeholder="Ex : agence, cabinet, commerce..." />
            </label>

            <label>
              Pourquoi voulez-vous Bootstrap ?
              <textarea
                name="need"
                placeholder="Décrivez votre besoin, votre idée ou votre projet..."
                rows={5}
              />
            </label>

            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Envoi en cours..." : "Je veux mon accès prioritaire"}
            </button>

            {status === "success" && (
              <p className="success">
                Inscription envoyée. Vous serez prévenu en priorité.
              </p>
            )}

            {status === "error" && (
              <p className="error">
                Erreur lors de l’envoi. Vérifiez la configuration email.
              </p>
            )}

            <p className="privacy">
              Votre demande est envoyée exclusivement à spectramediabots@gmail.com.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
