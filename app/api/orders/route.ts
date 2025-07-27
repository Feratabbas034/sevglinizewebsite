import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Supabase client not initialized" }, { status: 500 })
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Supabase client not initialized" }, { status: 500 })
  }

  try {
    const body = await request.json()

    const {
      customer_name,
      partner_name,
      email,
      phone,
      package: packageType,
      story,
      photos = 0
    } = body

    // Fiyatı pakete göre hesapla
    const price = packageType === "premium" ? 150 : 100

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          partner_name,
          email,
          phone,
          package: packageType,
          story,
          photos,
          price,
          created_at: new Date().toISOString()
        }
      ])

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

