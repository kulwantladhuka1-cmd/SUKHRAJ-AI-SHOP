import { fal } from "@fal-ai/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { video, prompt } = req.body || {};

    if (!video) {
      return res.status(400).json({
        error: "Video is required"
      });
    }

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
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
      "fal-ai/ltx-2.3-22b/video-to-video",
      {
        input: {
          video_url: video,
          prompt: prompt
        },
        logs: true
      }
    );

    const videoUrl = result.data?.video?.url;

    if (!videoUrl) {
      return res.status(500).json({
        error: "Video URL ਨਹੀਂ ਮਿਲੀ"
      });
    }

    return res.status(200).json({
      success: true,
      video: videoUrl,
      requestId: result.requestId
    });

  } catch (error) {

    console.error("VIDEO ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Video generation failed"
    });
  }
          }
