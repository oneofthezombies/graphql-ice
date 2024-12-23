export const config = {
  runtime: "edge",
};

export function GET(request: Request) {
  return new Response(request.url);
}
