import React from "react";
import ReactDOM from "react-dom/client";
import { VirtualTable } from "./core/VirtualTable";

type Person = { name: string; age: number };
const data: Person[] = Array.from({ length: 1000 }, (_, i) => ({
  name: `User ${i + 1}`,
  age: 20 + (i % 50),
  gender: i % 2 === 0 ? "Male" : "Female",
  birthDate: new Date(1990 + (i % 30), i % 12, i % 28).toISOString(),
  nationality: `USA ${i + 1}`,
  occupation: `Software Engineer ${i + 1}`,
  company: `Google ${i + 1}`,
  companyWebsite: `https://www.google.com ${i + 1}`,
  email: `user${i + 1}@example.com`,
  address: `123 Main St, Anytown, USA ${i + 1}`,
  city: `Anytown ${i + 1}`,
  state: `USA ${i + 1}`,
  zip: `12345 ${i + 1}`,
  phone: `123-456-7890 ${i + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const columns = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Age",
    accessorKey: "age",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
  },
  {
    header: "City",
    accessorKey: "city",
  },
  {
    header: "State",
    accessorKey: "state",
  },
  {
    header: "Zip",
    accessorKey: "zip",
  },
  {
    header: "Gender",
    accessorKey: "gender",
  },
  {
    header: "Birth Date",
    accessorKey: "birthDate",
  },
  {
    header: "Nationality",
    accessorKey: "nationality",
  },
  {
    header: "Occupation",
    accessorKey: "occupation",
  },
  {
    header: "Company",
    accessorKey: "company",
  },
  {
    header: "Company Website",
    accessorKey: "companyWebsite",
  },
];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VirtualTable
      data={data}
      columns={columns}
      height={600}
      readonly={false}
      onCellEdit={(rowIndex, columnId, value) =>
        console.log(rowIndex, columnId, value)
      }
    />
  </React.StrictMode>
);
