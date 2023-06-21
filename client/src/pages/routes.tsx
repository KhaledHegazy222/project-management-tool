import React from "react";
import { pagesData, pageEntry } from "./pagesData";
import { Routes, Route } from "react-router-dom";

export const routes: React.ReactElement = (
  <Routes>
    {pagesData.map((pagesData: pageEntry) => (
      <Route
        key={pagesData.title}
        path={pagesData.path}
        element={pagesData.component}
      />
    ))}
  </Routes>
);
