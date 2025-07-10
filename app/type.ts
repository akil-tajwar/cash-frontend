
// types.ts
export interface Department {
    id: number;
    departmentName: string;
    departmentCode: string;
    location: string;
    manager: string;
    employeeCount: string;
  }
  
  export const initialDepartments: Department[] = [
    {
      id: 1,
      departmentName: "Human Resources",
      departmentCode: "HR-001",
      location: "Headquarters",
      manager: "Jane Doe",
      employeeCount: "12",
    },
    {
      id: 2,
      departmentName: "Finance",
      departmentCode: "FIN-002",
      location: "East Wing",
      manager: "John Smith",
      employeeCount: "8",
    },
    {
      id: 3,
      departmentName: "Information Technology",
      departmentCode: "IT-003",
      location: "Tech Hub",
      manager: "Alex Johnson",
      employeeCount: "15",
    },
    {
      id: 4,
      departmentName: "Marketing",
      departmentCode: "MKT-004",
      location: "Creative Suite",
      manager: "Sarah Williams",
      employeeCount: "10",
    },
    {
      id: 5,
      departmentName: "Operations",
      departmentCode: "OPS-005",
      location: "Main Building",
      manager: "Michael Brown",
      employeeCount: "20",
    },
    {
      id: 6,
      departmentName: "Research and Development",
      departmentCode: "RND-006",
      location: "Innovation Center",
      manager: "Emily Davis",
      employeeCount: "14",
    },
    {
      id: 7,
      departmentName: "Customer Support",
      departmentCode: "CS-007",
      location: "Service Center",
      manager: "David Wilson",
      employeeCount: "18",
    },
    {
      id: 8,
      departmentName: "Sales",
      departmentCode: "SAL-008",
      location: "West Wing",
      manager: "Jessica Taylor",
      employeeCount: "22",
    },
    {
      id: 9,
      departmentName: "Legal",
      departmentCode: "LEG-009",
      location: "Executive Floor",
      manager: "Robert Anderson",
      employeeCount: "5",
    },
    {
      id: 10,
      departmentName: "Quality Assurance",
      departmentCode: "QA-010",
      location: "Testing Lab",
      manager: "Lisa Martinez",
      employeeCount: "9",
    },
  ];
  // types.ts
export interface Category {
    id: number;
    categoryName: string;
    assetAccountingCode: string;
    depreciationAccountingCode: string;
    depreciationMethod: string;
  }
  
  export const initialCategories: Category[] = [
    {
      id: 1,
      categoryName: "Office Equipment",
      assetAccountingCode: "711293883",
      depreciationAccountingCode: "9120399449",
      depreciationMethod: "Straight Line Method",
    },
    {
      id: 2,
      categoryName: "Computer Hardware",
      assetAccountingCode: "711293884",
      depreciationAccountingCode: "9120399450",
      depreciationMethod: "Double Declining Balance",
    },
    {
      id: 3,
      categoryName: "Furniture",
      assetAccountingCode: "711293885",
      depreciationAccountingCode: "9120399451",
      depreciationMethod: "Straight Line Method",
    },
    {
      id: 4,
      categoryName: "Vehicles",
      assetAccountingCode: "711293886",
      depreciationAccountingCode: "9120399452",
      depreciationMethod: "Units of Production",
    },
    {
      id: 5,
      categoryName: "Machinery",
      assetAccountingCode: "711293887",
      depreciationAccountingCode: "9120399453",
      depreciationMethod: "Double Declining Balance",
    },
    {
      id: 6,
      categoryName: "Software",
      assetAccountingCode: "711293888",
      depreciationAccountingCode: "9120399454",
      depreciationMethod: "Straight Line Method",
    },
    {
      id: 7,
      categoryName: "Leasehold Improvements",
      assetAccountingCode: "711293889",
      depreciationAccountingCode: "9120399455",
      depreciationMethod: "Straight Line Method",
    },
    {
      id: 8,
      categoryName: "Intangible Assets",
      assetAccountingCode: "711293890",
      depreciationAccountingCode: "9120399456",
      depreciationMethod: "Amortization",
    },
    {
      id: 9,
      categoryName: "Laboratory Equipment",
      assetAccountingCode: "711293891",
      depreciationAccountingCode: "9120399457",
      depreciationMethod: "Double Declining Balance",
    },
    {
      id: 10,
      categoryName: "Communication Equipment",
      assetAccountingCode: "711293892",
      depreciationAccountingCode: "9120399458",
      depreciationMethod: "Straight Line Method",
    },
  ];