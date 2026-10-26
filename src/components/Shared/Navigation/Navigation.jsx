import React, { useEffect, useState } from "react";
import NavRoutes from "../../../routes/Routes";
import { NavLink } from "react-router-dom";
import { getUserData } from "../../../services/AuthService";
import { FcHome } from "react-icons/fc";
import Colors from "../../../assets/theme/Colors";

const Navigation = () => {
  const [stickyClass, setStickyClass] = useState("");
  const [marginTop, setMarginTop] = useState("");
  const [navTitle, toggleTitle] = useState({ visible: false, name: "" });

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);

    return () => {
      window.removeEventListener("scroll", stickNavbar);
    };
  }, []);

  const stickNavbar = () => {
    // if (window !== undefined) {
    //   let windowHeight = window.scrollY;
    //   windowHeight >= 50 ? setStickyClass("fixed-top") : setStickyClass("");
    // }
  };
  return (
    <div
      className={`navbar-expand-md`}
      style={{ marginTop: stickyClass === "" ? "0px" : "100px" }}
    >
      <div className="collapse navbar-collapse" id="navbar-menu">
        <nav
          className={`navbar navbar-dark ${stickyClass}`}
          style={{ background: Colors.defaultThemeColor }}
        >
          <div className="container-fluid">
            <ul className="navbar-nav">
              {getUserData()
                .routes.filter((ob) => ob.isVisible)
                .map((el, key) => {
                  let iconClass = ["sidebar-icon"];
                  iconClass.push(el.icon);
                  iconClass = iconClass.join(" ");
                  let path = el.path;
                  let navId = "submenu-" + key;
                  let navIdTarget = "#submenu-" + key;
                  if (!el.hasChild) {
                    return (
                      <li key={Math.random()} className="nav-item">
                        <NavLink
                          className="nav-link"
                          to={path}
                          key={Math.random()}
                        >
                          <span className="nav-link">
                            {/* <span className="nav-link-icon d-md-none d-lg-inline-block">
                              <FcHome />
                            </span> */}
                            {el.name}
                          </span>
                        </NavLink>
                      </li>
                    );
                  } else {
                    return (
                      <li key={Math.random()} className="nav-item dropdown">
                        <span
                          className="nav-link dropdown-toggle"
                          // href="#navbar-base"
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          role="button"
                          aria-expanded="false"
                        >
                          {/* <span
                            className="nav-link-icon d-md-none d-lg-inline-block"
                            onMouseEnter={() =>
                              toggleTitle({ visible: true, name: el.name })
                            }
                            onMouseLeave={() =>
                              toggleTitle({ visible: false, name: el.name })
                            }
                          >
                            <FcHome />
                          </span> */}
                          <span
                            className="nav-link-title"
                            style={{ color: Colors.colorAccent }}
                          >
                            {/* {navTitle.name === el.name &&
                            navTitle.visible === true ? ( */}
                            <span
                              className="nav-link-title"
                              style={{ color: Colors.colorAccent }}
                            >
                              {el.name}
                              {/* {navTitle.visible} */}
                            </span>
                            {/* ) : null} */}
                          </span>
                        </span>
                        <div className="dropdown-menu">
                          <div className="dropdown-menu-columns">
                            <div className="dropdown-menu-column">
                              {el.children.map((ch1, key2) => {
                                if (!ch1.hasChild) {
                                  // <>
                                  //   {ch1.isVisible && (
                                  //     <NavLink to={ch1.path}>
                                  //       <span className="dropdown-item">
                                  //         {ch1.name}
                                  //       </span>
                                  //     </NavLink>
                                  //   )}
                                  // </>
                                  if (ch1.isVisible === true) {
                                    return (
                                      <NavLink
                                        to={ch1.path}
                                        key={Math.random()}
                                      >
                                        <span className="dropdown-item">
                                          {ch1.name}
                                        </span>
                                      </NavLink>
                                    );
                                  }
                                } else {
                                  return (
                                    <div
                                      className="dropend"
                                      key={Math.random()}
                                    >
                                      {ch1.isVisible && (
                                        <span
                                          className="dropdown-item dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          data-bs-auto-close="outside"
                                          role="button"
                                          aria-expanded="false"
                                        >
                                          {ch1.name}
                                        </span>
                                      )}
                                      <div className="dropdown-menu">
                                        {ch1.children.map((ch2, key3) => {
                                          if (!ch2.hasChild) {
                                            if (ch2.isVisible === true) {
                                              return (
                                                <NavLink
                                                  to={ch2.path}
                                                  key={Math.random()}
                                                >
                                                  <span className="dropdown-item">
                                                    {ch2.name}
                                                  </span>
                                                </NavLink>
                                              );
                                            }
                                          } else {
                                            return (
                                              <div
                                                className="dropend"
                                                key={Math.random()}
                                              >
                                                {ch2.isVisible && (
                                                  <span
                                                    className="dropdown-item dropdown-toggle"
                                                    data-bs-toggle="dropdown"
                                                    data-bs-auto-close="outside"
                                                    role="button"
                                                    aria-expanded="false"
                                                  >
                                                    {ch2.name}
                                                  </span>
                                                )}
                                                <div className="dropdown-menu">
                                                  {ch2.children.map(
                                                    (ch3, key4) => {
                                                      // console.log(ch3.name+"Here")
                                                      if (!ch3.hasChild) {
                                                        if (
                                                          ch3.isVisible === true
                                                        ) {
                                                          return (
                                                            <NavLink
                                                              to={ch3.path}
                                                              key={Math.random()}
                                                            >
                                                              <span className="dropdown-item">
                                                                {ch3.name}
                                                              </span>
                                                            </NavLink>
                                                          );
                                                        }
                                                      } else {
                                                        return (
                                                          <div
                                                            className="dropend"
                                                            key={Math.random()}
                                                          >
                                                            {ch3.isVisible && (
                                                              <span
                                                                className="dropdown-item dropdown-toggle"
                                                                data-bs-toggle="dropdown"
                                                                data-bs-auto-close="outside"
                                                                role="button"
                                                                aria-expanded="false"
                                                              >
                                                                {ch3.name}
                                                              </span>
                                                            )}
                                                            <div className="dropdown-menu">
                                                              {ch3.children.map(
                                                                (ch4, key5) => {
                                                                  // console.log(ch4.name+"Here")
                                                                  if (
                                                                    !ch4.hasChild
                                                                  ) {
                                                                    if (
                                                                      ch4.isVisible ===
                                                                      true
                                                                    ) {
                                                                      return (
                                                                        <NavLink
                                                                          to={
                                                                            ch4.path
                                                                          }
                                                                          key={Math.random()}
                                                                        >
                                                                          <span className="dropdown-item">
                                                                            {
                                                                              ch4.name
                                                                            }
                                                                          </span>
                                                                        </NavLink>
                                                                      );
                                                                    }
                                                                  } else {
                                                                    //For next level Navigation...also to check if there is any optimised way to do this
                                                                  }
                                                                }
                                                              )}
                                                            </div>
                                                          </div>
                                                        );
                                                        //For next level Navigation...also to check if there is any optimised way to do this
                                                      }
                                                    }
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          }
                                        })}
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                })}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
