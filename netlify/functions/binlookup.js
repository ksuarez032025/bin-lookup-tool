export async function handler(event) {
  const dev =
    process.env.NETLIFY_DEV === "true" || process.env.NODE_ENV !== "production";

  try {
    const parts = (event.path || "").split("/");
    const last = parts[parts.length - 1] || "";
    const bin = last.replace(/\D/g, "").slice(0, 8);

    if (!/^\d{6,8}$/.test(bin)) {
      return json(400, { error: "Invalid BIN (6–8 digits required)" }, dev);
    }

    // timeout guard (8s)
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8000);

    let upstream;
    try {
      upstream = await fetch(`https://lookup.binlist.net/${bin}`, {
        signal: ac.signal,
        headers: { "User-Agent": "bin-lookup-tool/1.0" },
      });
    } catch (e) {
      clearTimeout(t);
      // Likely AV/firewall blocking or network error
      return json(
        502,
        { error: "Upstream fetch failed", detail: dev ? String(e) : undefined },
        dev
      );
    }
    clearTimeout(t);

    const text = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: text,
    };
  } catch (err) {
    return json(
      502,
      { error: "Function error", detail: dev ? String(err) : undefined },
      dev
    );
  }
}

function json(statusCode, obj, dev) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(obj, null, dev ? 2 : 0),
  };
}
