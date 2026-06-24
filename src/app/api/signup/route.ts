import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const TO_EMAIL = "spectramediabots@gmail.com";

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

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: "SMTP non configuré." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bootstrap Priority List" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nouvelle inscription prioritaire Bootstrap — ${name}`,
      text: `
Nouvelle demande d'accès prioritaire Bootstrap

Nom :
${name}

Email :
${email}

Entreprise / activité :
${company || "Non renseigné"}

Besoin / projet :
${need || "Non renseigné"}

Destination :
${TO_EMAIL}
      `,
      html: `
        <h2>Nouvelle demande d'accès prioritaire Bootstrap</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Entreprise / activité :</strong> ${company || "Non renseigné"}</p>
        <p><strong>Besoin / projet :</strong></p>
        <p>${need || "Non renseigné"}</p>
        <hr />
        <p>Destination exclusive : ${TO_EMAIL}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
