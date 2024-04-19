import { Redis } from "ioredis";
import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");

  if (!user) {
    return Response.json(
      {
        error: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }

  // const isDevelopment = process.env.NODE_ENV === "development";

  // const origin = request.headers.get("origin");
  // console.log("origin", origin);
  // if (isDevelopment) {
  //   console.log("Allowing all origins in development");
  // } else if (
  //   origin !== "github.com" &&
  //   origin !== "github-views-counter.vercel.app" &&
  //   origin !== "camo.githubusercontent.com" &&
  //   origin !== "githubusercontent.com"
  // ) {
  //   return Response.json(
  //     {
  //       error: "Invalid request origin",
  //     },
  //     {
  //       status: 400,
  //     }
  //   );
  // }

  const result = await redis.incr(`user:${user}`);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: "#505050",
          width: "100%",
          height: "100%",
          borderRadius: "5",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontSize: "13",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // width: "90%",
          }}
        >
          Profile views
        </p>
        <div
          style={{
            width: "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            background: "#126fa9",
            height: "100%",
          }}
        >
          <p>{result}</p>
        </div>
      </div>
    ),
    {
      width: 120,
      height: 30,
    }
  );
}
