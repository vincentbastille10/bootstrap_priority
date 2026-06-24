import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TO_EMAIL = "spectramediabots@gmail.com";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim();
    const need = String(body.need || "").trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nom et email obligatoires." },
        { status: 400 }
      );
    }

    const apiKey = process.env.MJ_API_KEY;
    const secretKey = process.env.MJ_API_SECRET;
    const fromEmail = process.env.MJ_FROM_EMAIL;
    const fromName = process.env.MJ_FROM_NAME || "Bootstrap Priority";

    if (!apiKey || !secretKey || !fromEmail) {
      console.error("Variables Mailjet manquantes", {
        MJ_API_KEY: Boolean(apiKey),
        MJ_API_SECRET: Boolean(secretKey),
        MJ_FROM_EMAIL: Boolean(fromEmail),
        MJ_FROM_NAME: Boolean(fromName),
      });

      return NextResponse.json(
        { error: "Configuration Mailjet manquante." },
        { status: 500 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company || "Non renseigné");
    const safeNeed = escapeHtml(need || "Non renseigné");

    const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

    const mailjetRes = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: TO_EMAIL,
                Name: "Spectra Media Bots",
              },
            ],
            ReplyTo: {
              Email: email,
              Name: name,
            },
            Subject: `Nouvelle inscription prioritaire Bootstrap — ${name}`,
            TextPart: `
Nouvelle demande d'accès prioritaire Bootstrap

Nom :
${name}

Email :
${email}

Entreprise / activité :
${company || "Non renseigné"}

Besoin / projet :
${need || "Non renseigné"}

Destination exclusive :
${TO_EMAIL}
            `,
            HTMLPart: `
              <h2>Nouvelle demande d'accès prioritaire Bootstrap</h2>
              <p><strong>Nom :</strong> ${safeName}</p>
              <p><strong>Email :</strong> ${safeEmail}</p>
              <p><strong>Entreprise / activité :</strong> ${safeCompany}</p>
              <p><strong>Besoin / projet :</strong></p>
              <p>${safeNeed.replaceAll("\n", "<br />")}</p>
              <hr />
              <p><strong>Destination exclusive :</strong> ${TO_EMAIL}</p>
            `,
          },
        ],
      }),
    });

    if (!mailjetRes.ok) {
      const errorText = await mailjetRes.text();
      console.error("Erreur Mailjet:", errorText);

      return NextResponse.json(
        { error: "Erreur Mailjet." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur serveur:", error);

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
