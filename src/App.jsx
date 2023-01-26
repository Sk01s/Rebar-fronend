import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./css/reset.css";
import "./css/styles.css";

const SetOut = lazy(() =>
  import("./context/SetOutFucntions").then((module) => ({
    default: module.SetOut,
  }))
);
const Authenticator = lazy(() =>
  import("./context/Authenticator").then((module) => ({
    default: module.Authenticator,
  }))
);
const CategoiresContext = lazy(() =>
  import("./context/CategoiresContext").then((module) => ({
    default: module.CategoiresContext,
  }))
);
import LoadingAnimtion from "./components/LoadingAnimtion";
const Login = lazy(() => import("./pages/Login"));
const Nav = lazy(() => import("./components/Nav"));
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const SetOutProduct = lazy(() => import("./pages/SetOutProduct"));
const CategoriesPage = lazy(() => import("./pages/CategoryPage"));
const FavoritePage = lazy(() => import("./pages/FavoritePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Reset = lazy(() => import("./pages/Reset"));
const NotVerified = lazy(() => import("./pages/NotVerified"));
const Error = lazy(() => import("./pages/ErrorPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
export default function App() {
  return (
    <Suspense fallback={<LoadingAnimtion />}>
      <CategoiresContext>
        <Authenticator>
          <SetOut>
            <Nav />
            <Routes>
              <Route path="/reset" element={<Reset />} />
              <Route path="/403" element={<Error />} />
              <Route path="/notverified" element={<NotVerified />} />
              <Route path="*" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<SetOutProduct />}>
                <Route path=":productDirec" element={<SetOutProduct />} />
              </Route>
              <Route path="/search" element={<CategoriesPage />}>
                <Route path=":searchProduct" element={<CategoriesPage />} />
              </Route>
              <Route path="/favorite" element={<FavoritePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categories" element={<CategoriesPage />}>
                <Route path=":categoryId" element={<CategoriesPage />} />
              </Route>
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </SetOut>
        </Authenticator>
      </CategoiresContext>
    </Suspense>
  );
}
