import React, { useEffect, useState, useRef } from "react";
// import MaterialIcon from "material-icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartShopping,
  faHeart,
  faRightToBracket,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { useCategories } from "../context/CategoiresContext";
import { useAuth } from "../context/Authenticator";
import "../css/Nav.css";
export default function Nav() {
  const { currentUser } = useAuth();
  const WindowWidth = () => {
    if (window.innerWidth > 991) return false;
    return true;
  };

  const checkIsEnter = (e) => {
    if (e.key === "Enter") seachBtn.current.click();
  };

  const displayLinks = (e) => {
    if (btnBurger.current?.classList.contains("menu-btn")) {
      btnBurger.current.style.animation = "btn-animation 400ms 1";
      setTimeout(() => (btnBurger.current.style.animation = ""), 400);
    }
    btnBurger.current?.classList.toggle("active");
    setIsHidden((prev) => !prev);
  };

  const [input, setInput] = useState("");
  const { categories } = useCategories();
  const [isSmall, checkIsSmall] = useState(WindowWidth);
  const [isHidden, setIsHidden] = useState(() => {
    if (isSmall === true) return true;
    return false;
  });

  const header = useRef(null);
  const links = useRef(null);
  const seachBtn = useRef(null);
  const btnBurger = useRef();
  useEffect(() => {
    if (!isSmall) return;
    const headerHeight = header.current.getBoundingClientRect().height;
    links.current.style.top = `${headerHeight}px`;
  }, [isSmall, isHidden]);

  useEffect(() => {
    if (isHidden === true) return;
    setTimeout(() => {
      document.addEventListener(
        "click",
        (e) => {
          if (e.composedPath().includes(btnBurger.current)) return;
          displayLinks(e);
        },
        {
          once: true,
        }
      );
    }, 400);
  }, [isHidden]);

  useEffect(() => {
    const getWindowWidth = () => {
      checkIsSmall(WindowWidth);
    };
    window.addEventListener("resize", getWindowWidth);
    return () => {
      window.removeEventListener("resize", getWindowWidth);
    };
  }, []);

  const Gategories = categories?.map((category) => {
    return (
      <Link to={`/categories/${category.id}`} key={category.id}>
        {category.name}
      </Link>
    );
  });
  return (
    <header ref={header} className="navbar">
      <nav className=" justify-sb align-ce flex user-select">
        <div className="logo-search flex ju-sb align-ce">
          <Link
            to="/"
            className="logo cl-black pointer"
            style={{ color: "inherit", textDecoration: "none", padding: 0 }}
          >
            <ReactSVG src="/logo.svg" />
          </Link>

          <div className="search flex">
            <input
              type="search"
              placeholder="Search"
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={checkIsEnter}
            />
            <Link ref={seachBtn} to={`/search/name=${input}`}>
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </div>
        </div>
        {isSmall && (
          <div className="menu-btn" ref={btnBurger} onClick={displayLinks}>
            <FontAwesomeIcon
              icon={faBars}
              style={{ fontSize: "1.5rem", color: "var(--color-ac-dark)" }}
            />
          </div>
        )}

        <div
          ref={links}
          className={
            (isSmall && isHidden && "links flex links-small hide ") ||
            (!isHidden && isSmall && "links flex links-small ") ||
            (!isSmall && "links flex links")
          }
        >
          {currentUser ? (
            <Link
              style={{
                color: "inherit",
                textDecoration: "inherit",
              }}
              to="/dashboard"
              className="flex align-ce gap-1"
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </Link>
          ) : (
            <Link
              style={{
                color: "inherit",
                textDecoration: "inherit",
              }}
              to="/login"
              className="flex align-ce gap-1"
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              <span>Log In</span>
            </Link>
          )}

          <Link
            style={{
              color: "inherit",
              textDecoration: "inherit",
            }}
            to="/favorite"
            className="flex align-ce gap-1"
          >
            <FontAwesomeIcon icon={faHeart} />
            <span>Favorites</span>
          </Link>

          <Link
            style={{
              color: "inherit",
              textDecoration: "inherit",
            }}
            to="/cart"
            className="flex align-ce gap-1"
          >
            <FontAwesomeIcon icon={faCartShopping} />
            <span>Item</span>
          </Link>
        </div>
      </nav>
      <aside className="categories flex">{Gategories}</aside>
    </header>
  );
}
