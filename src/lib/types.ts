export type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  lastLogin: string;
  avatar: string;
};

export type Workstation = {
  id: string;
  name: "Desktop" | "Laptop";
  hostname: string;
  user: string;
  status: "Online" | "Offline" | "Error";
  os: "Windows 11" | "macOS";
  ip: string;
};

export type Software = {
    id: string;
    name: string;
    version: string;
    license: string;
    status: "Licensed" | "Trial" | "Expired";
};

export type Alert = {
    id: string;
    timestamp: string;
    severity: "Critical" | "High" | "Medium" | "Low";
    description: string;
};
