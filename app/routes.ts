import { type RouteConfig, index, route, layout } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  layout("routes/app-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("start-interview", "routes/start-interview.tsx"),
    route("interview-history", "routes/interview-history.tsx"),
  ])
] satisfies RouteConfig
