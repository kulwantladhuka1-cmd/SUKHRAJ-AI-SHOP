import { fal } from "@fal-ai/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { image, prompt, duration } = req.body || {};

    if (!image) {
      return res.status(400).json({
        error: "Image is required"
      });
    }

    if (!process.env.FAL_KEY) {
      return res.status(500).json({
        error: "FAL_KEY is not configured"
      });
    }

    fal.config({
      credentials: process.env.FAL_KEY
    });

    const result = await fal.subscribe(
      "fal-ai/kling-video/v3/standard/image-to-video",
      {
        input: {
          start_image_url: image,
          prompt:
            prompt ||
            "Create a realistic cinematic video with smooth natural movement.",
          duration: String(duration || 5),
          generate_audio: false
        }
      }
    );

    return res.status(200).json({
      success: true,
      video: result.data?.video?.url || null,
      requestId: result.requestId
    });

  } catch (error) {
    console.error("FAL ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Video generation failed"
    });
  }
  }
