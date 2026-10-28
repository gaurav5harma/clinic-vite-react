import React, { lazy } from "react";
import { getUserData } from "../services/AuthService";
import { Route } from "react-router-dom";
import {
  Settings,
  AccessMaster,
  ActionMaster,
  RoleMaster,
  RouteMaster,
  CompanySettings,
  GeneralPolicies,
  AllUsers as Users,
} from "../components/Settings";

import { Dashboard } from "../components/Dashboard";
import { Registration } from "../components/Registration";
import { Consult } from "../components/Consult";
import { Medicines } from "../components/Pharmacy";

import { EntryReport, Tagging, Updations } from "../components/Reports";
import {
  MR,
  AgentOutstanding,
  MRTransactions,
  Transfer,
  DepositTransactions,
} from "../components/Accounts";

export const componentRegistry = {
  //Accounts
  MR: <MR />,
  AgentOutstanding: <AgentOutstanding />,
  MRTransactions: <MRTransactions />,
  DepositTransactions: <DepositTransactions/>,
  Transfer: <Transfer />,
  //Masters

  //Settings
  Settings: <Settings />,
  RouteMaster: <RouteMaster />,
  RoleMaster: <RoleMaster />,
  AccessMaster: <AccessMaster />,
  Users: <Users />,
  CompanySettings: <CompanySettings />,
  ActionMaster: <ActionMaster />,
  GeneralPolicies: <GeneralPolicies />,
  //Other
  Dashboard: <Dashboard />,
  Registration: <Registration />,
  Consult: <Consult />,
  Medicines: <Medicines />,
  //Reports
  EntryReport: <EntryReport />,
  Tagging: <Tagging />,
  Updations: <Updations />,
};

export const buildDynamicRoutes = () => {
  let routeJSX = [];
  if (getUserData().routes) {
    getUserData().routes.forEach((element, key) => {
      if (!element.hasChild) {
        routeJSX.push(
          <Route
            key={key}
            path={element.path}
            element={componentRegistry[element.component]}
            title={element.title}
          />,
        );
      } else {
        element.children.forEach((el1, k) => {
          if (!el1.hasChild) {
            routeJSX.push(
              <Route
                key={k}
                path={el1.path}
                element={componentRegistry[el1.component]}
                title={element.title}
              />,
            );
          } else {
            el1.children.forEach((el2, k2) => {
              if (!el2.hasChild) {
                routeJSX.push(
                  <Route
                    key={k2}
                    path={el2.path}
                    element={componentRegistry[el2.component]}
                    title={element.title}
                  />,
                );
              } else {
                el2.children.forEach((el3, k3) => {
                  routeJSX.push(
                    <Route
                      key={k3}
                      path={el3.path}
                      element={componentRegistry[el3.component]}
                      title={element.title}
                    />,
                  );
                });
              }
            });
          }
        });
      }
    });
  }
  return routeJSX;
};

const AppRoutes = buildDynamicRoutes();
export default AppRoutes;
