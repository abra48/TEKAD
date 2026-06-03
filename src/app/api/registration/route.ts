import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi field wajib
    const requiredFields = [
      "full_name",
      "nim",
      "email",
      "phone_number",
      "angkatan",
      "semester",
      "division_choice_1",
      "division_choice_2",
      "motivation",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field '${field}' wajib diisi.` },
          { status: 400 }
        );
      }
    }

    // Validasi semester
    const semester = parseInt(body.semester, 10);
    if (isNaN(semester) || semester < 1 || semester > 14) {
      return NextResponse.json(
        { error: "Semester harus antara 1 dan 14." },
        { status: 400 }
      );
    }

    // Validasi motivasi minimal 50 karakter
    if (body.motivation.length < 50) {
      return NextResponse.json(
        { error: "Motivasi minimal 50 karakter." },
        { status: 400 }
      );
    }

    // Inisialisasi Supabase
    const supabase = createClient();

    // Insert ke tabel member_registrations
    const { error } = await supabase.from("member_registrations").insert([
      {
        full_name: body.full_name,
        nim: body.nim,
        email: body.email,
        phone_number: body.phone_number,
        angkatan: body.angkatan,
        semester: semester,
        division_choice_1: body.division_choice_1,
        division_choice_2: body.division_choice_2,
        motivation: body.motivation,
        portfolio_url: body.portfolio_url || null,
        // status default 'pending' diatur di level database
      },
    ]);

    if (error) {
      console.error("[Registration Error]", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Pendaftaran berhasil dikirim!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Registration Unexpected Error]", err);
    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
