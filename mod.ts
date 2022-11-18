const token = Deno.env.get("TWITTER_BEARER_TOKEN");
if (!token) Deno.exit(1);

const userId = Deno.env.get("TWITTER_ID");
if (!userId) Deno.exit(1);

export const buildUrl = (next?: string) => {
  const url = new URL(`https://api.twitter.com/2/users/${userId}/following`);
  url.searchParams.set("max_results", String(1000));
  if (next) url.searchParams.set("pagination_token", next);
  return url.toString();
};

let next: string | undefined = undefined;
const followings = [];

do {
  const response: Response = await fetch(buildUrl(next), { headers: { "Authorization": `Bearer ${token}` } });
  if (!response.ok) {
    console.error(response.status);
    Deno.exit(1);
  }
  const { data, meta } = await response.json();
  next = meta?.next_token;
  followings.push(...data);
} while (next);

await Deno.writeTextFile("./followings.json", JSON.stringify(followings));
