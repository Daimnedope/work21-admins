import { Refine, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
  useNotificationProvider,
  ErrorComponent,
} from "@refinedev/antd";
import routerBindings, {
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import ruRU from "antd/locale/ru_RU";
import {
  DashboardOutlined,
  UserOutlined,
  ProjectOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  StarOutlined,
} from "@ant-design/icons";

import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";

// Pages
import { Dashboard } from "./pages/dashboard";
import { UserList, UserShow, UserEdit, UserCreate } from "./pages/users";
import { ProjectList, ProjectShow, ProjectEdit, ProjectCreate } from "./pages/projects";
import { ApplicationList } from "./pages/applications";
import { ContractList } from "./pages/contracts";
import { RatingList } from "./pages/ratings";
import { Login } from "./pages/login";

import "@refinedev/antd/dist/reset.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const APP_TITLE = import.meta.env.VITE_APP_TITLE || "WORK21 Admin";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider
          locale={ruRU}
          theme={{
            token: {
              colorPrimary: "#1890ff",
              borderRadius: 6,
            },
          }}
        >
          <AntdApp>
            <Refine
              dataProvider={dataProvider(API_URL)}
              authProvider={authProvider}
              routerProvider={routerBindings}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Дашборд",
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  create: "/users/create",
                  show: "/users/show/:id",
                  edit: "/users/edit/:id",
                  meta: {
                    label: "Пользователи",
                    icon: <UserOutlined />,
                  },
                },
                {
                  name: "projects",
                  list: "/projects",
                  create: "/projects/create",
                  show: "/projects/show/:id",
                  edit: "/projects/edit/:id",
                  meta: {
                    label: "Проекты",
                    icon: <ProjectOutlined />,
                  },
                },
                {
                  name: "applications",
                  list: "/applications",
                  meta: {
                    label: "Заявки",
                    icon: <FileTextOutlined />,
                  },
                },
                {
                  name: "contracts",
                  list: "/contracts",
                  meta: {
                    label: "Договоры",
                    icon: <FileProtectOutlined />,
                  },
                },
                {
                  name: "ratings",
                  list: "/ratings",
                  meta: {
                    label: "Рейтинги",
                    icon: <StarOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "work21-admin",
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<NavigateToResource resource="login" />}
                    >
                      <ThemedLayoutV2
                        Title={({ collapsed }) => (
                          <ThemedTitleV2
                            collapsed={collapsed}
                            text={APP_TITLE}
                            icon={
                              <span style={{ fontSize: collapsed ? 20 : 24 }}>
                                🎓
                              </span>
                            }
                          />
                        )}
                        Sider={() => (
                          <ThemedSiderV2
                            Title={({ collapsed }) => (
                              <ThemedTitleV2
                                collapsed={collapsed}
                                text={APP_TITLE}
                                icon={
                                  <span style={{ fontSize: collapsed ? 20 : 24 }}>
                                    🎓
                                  </span>
                                }
                              />
                            )}
                          />
                        )}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<Dashboard />} />
                  
                  <Route path="/users">
                    <Route index element={<UserList />} />
                    <Route path="create" element={<UserCreate />} />
                    <Route path="show/:id" element={<UserShow />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                  </Route>
                  
                  <Route path="/projects">
                    <Route index element={<ProjectList />} />
                    <Route path="create" element={<ProjectCreate />} />
                    <Route path="show/:id" element={<ProjectShow />} />
                    <Route path="edit/:id" element={<ProjectEdit />} />
                  </Route>
                  
                  <Route path="/applications" element={<ApplicationList />} />
                  <Route path="/contracts" element={<ContractList />} />
                  <Route path="/ratings" element={<RatingList />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="*" element={<ErrorComponent />} />
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

