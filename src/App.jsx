import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./css/reset.css";
import "./css/styles.css";
import { SetOut } from "./context/SetOutFucntions";
import { Authenticator } from "./context/Authenticator";
import { CategoiresContext } from "./context/CategoiresContext";
import LoadingAnimtion from "./components/LoadingAnimtion";
const Login = React.lazy(() => import("./pages/Login"));
const Nav = React.lazy(() => import("./components/Nav"));
const Home = React.lazy(() => import("./pages/Home"));
const Signup = React.lazy(() => import("./pages/Signup"));
const SetOutProduct = React.lazy(() => import("./pages/SetOutProduct"));
const CategoriesPage = React.lazy(() => import("./pages/CategoryPage"));
const FavoritePage = React.lazy(() => import("./pages/FavoritePage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Reset = React.lazy(() => import("./pages/Reset"));
const NotVerified = React.lazy(() => import("./pages/NotVerified"));
const Error = React.lazy(() => import("./pages/ErrorPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
export default function App() {
  return (
    <Suspense fallback={<LoadingAnimtion />}>
      <CategoiresContext>
        <Authenticator>
          <SetOut>
            <Nav />
            <Routes>
              <Route path="Tech-Mode/reset" element={<Reset />} />
              <Route path="/403" element={<Error />} />
              <Route path="/Tech-Mode/notverified" element={<NotVerified />} />
              <Route path="*" element={<Home />} />
              <Route path="/Tech-Mode" element={<Home />} />
              <Route path="/Tech-Mode/product" element={<SetOutProduct />}>
                <Route path=":productDirec" element={<SetOutProduct />} />
              </Route>
              <Route path="/Tech-Mode/search" element={<CategoriesPage />}>
                <Route path=":searchProduct" element={<CategoriesPage />} />
              </Route>
              <Route path="/Tech-Mode/favorite" element={<FavoritePage />} />
              <Route path="/Tech-Mode/signup" element={<Signup />} />
              <Route path="/Tech-Mode/login" element={<Login />} />
              <Route path="/Tech-Mode/dashboard" element={<Dashboard />} />
              <Route path="/Tech-Mode/categories" element={<CategoriesPage />}>
                <Route path=":categoryId" element={<CategoriesPage />} />
              </Route>
              <Route path="/Tech-Mode/cart" element={<CartPage />} />
            </Routes>
          </SetOut>
        </Authenticator>
      </CategoiresContext>
    </Suspense>
  );
}
