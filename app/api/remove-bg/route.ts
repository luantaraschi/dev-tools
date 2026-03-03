import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return new NextResponse("Missing REMOVE_BG_API_KEY", { status: 500 })
  }

  const incoming = await request.formData()
  const image = incoming.get("image_file")

  if (!(image instanceof File)) {
    return new NextResponse("image_file is required", { status: 400 })
  }

  const body = new FormData()
  body.append("image_file", image)
  body.append("size", "auto")

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
    },
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    return new NextResponse(errorText || "Remove.bg request failed", {
      status: response.status,
    })
  }

  const arrayBuffer = await response.arrayBuffer()
  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  })
}
