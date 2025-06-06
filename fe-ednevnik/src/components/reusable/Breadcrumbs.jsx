import React from "react";
import { Link, useLocation } from "react-router-dom";

// Rute na kojima NE prikazujemo breadcrumbs
const excludedRoutes = [
  "/",
  "/register",
  "/profesor",
  "/ucenik",
  "/roditelj",
  "/dashboard-profesor",
  "/ucenik-home",
  "/dashboard-roditelj",
  "/dashboard-admin",
];

// Tačna mapiranja pune putanje na prikazni naziv (isti kao u Navbar-u)
const pathLabelMap = {
  "/dashboard-profesor": "Dashboard Profesora",
  "/profesor-profile": "Moj Profil",

  "/ucenik-home": "Početna",
  "/dashboard-ucenik": "Dashboard Učenika",
  "/ucenik-profile": "Moj Profil",

  "/dashboard-roditelj": "Dashboard Roditelja",
  "/roditelj-profile": "Moj Profil",

  "/dashboard-admin": "Dashboard Administratora",
  "/predmeti-admin": "Upravljanje Predmetima",
};

// Explicitne veze roditelj → dete:
const parentMap = {
  "/profesor-profile": "/dashboard-profesor",
  "/dashboard-ucenik": "/ucenik-home",
  "/ucenik-profile": "/ucenik-home",
  "/roditelj-profile": "/dashboard-roditelj",
  "/predmeti-admin": "/dashboard-admin",
};

// Ako ruta NIJE u pathLabelMap, formatiramo segment ovako:
const formatSegment = (segment) => {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const Breadcrumbs = () => {
  const { pathname } = useLocation();

  // Ako je ruta u excludedRoutes, ne prikazujemo ništa
  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  // Ako je ruta child u parentMap, prvo prikažemo parent, pa current
  if (parentMap[pathname]) {
    const parentPath = parentMap[pathname];
    const crumbs = [parentPath, pathname];

    return (
      <nav className="breadcrumbs">
        {crumbs.map((fullPath, idx) => {
          const isLast = idx === crumbs.length - 1;
          const label =
            pathLabelMap[fullPath] !== undefined
              ? pathLabelMap[fullPath]
              : formatSegment(fullPath.replace(/^\//, ""));

          return (
            <span key={fullPath} className="breadcrumb-item">
              {idx > 0 && <span className="separator">/</span>}
              {isLast ? (
                <span className="breadcrumb-current">{label}</span>
              ) : (
                <Link to={fullPath} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    );
  }

  // Fallback: razbijamo URL po segmentima
  const segments = pathname.split("/").filter((seg) => seg !== "");

  return (
    <nav className="breadcrumbs">
      {segments.map((segment, idx) => {
        const isLast = idx === segments.length - 1;
        const upToHere = "/" + segments.slice(0, idx + 1).join("/");

        const label =
          pathLabelMap[upToHere] !== undefined
            ? pathLabelMap[upToHere]
            : formatSegment(segment);

        return (
          <span key={upToHere} className="breadcrumb-item">
            {idx > 0 && <span className="separator">/</span>}
            {isLast ? (
              <span className="breadcrumb-current">{label}</span>
            ) : (
              <Link to={upToHere} className="breadcrumb-link">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;