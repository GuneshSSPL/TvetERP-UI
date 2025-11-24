/**
 * Admin Demo Page
 * 
 * Comprehensive showcase of all common components:
 * - All form types (Multi-step, Simple, Inline, Modal)
 * - All table types (Data, Grade Sheet, Attendance, Financial)
 * - Metric cards, status badges
 * - Theme switching demonstration
 * 
 * All components use common shared components for consistency.
 */

import { useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  SmartTable,
  MetricCard,
  StatusBadge,
  GradeSheetTable,
  AttendanceTable,
  FinancialTable,
  MultiStepForm,
  SimpleForm,
  InlineForm,
  ModalForm,
  type FormStep,
  type FormField,
  type GradeData,
  type AttendanceData,
  type FinancialData,
} from '@/components/shared'
import { useTenantTheme } from '@/context/tenant-theme-provider'
import { demoThemes } from '@/lib/demo-themes'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
} from 'lucide-react'

// Sample data
interface SampleData {
  id: string
  name: string
  email: string
  status: string
  role: string
}

const sampleData: SampleData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'pending',
    role: 'Teacher',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'inactive',
    role: 'Student',
  },
]

const sampleGrades: GradeData[] = [
  {
    id: '1',
    studentName: 'John Doe',
    studentId: 'ST001',
    cat1: 75,
    cat2: 80,
    practical: 85,
    final: 78,
    total: 79.5,
    grade: 'A',
    competency: 'C',
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    studentId: 'ST002',
    cat1: 65,
    cat2: 70,
    practical: 75,
    final: 68,
    total: 69.5,
    grade: 'B',
    competency: 'C',
  },
]

const sampleAttendance: AttendanceData[] = [
  {
    id: '1',
    studentName: 'John Doe',
    studentId: 'ST001',
    '2024-01-15': 'present',
    '2024-01-16': 'present',
    '2024-01-17': 'absent',
  },
]

const sampleFinancial: FinancialData[] = [
  {
    id: '1',
    reference: 'FEE-2024-001',
    description: 'Tuition Fee - Semester 1',
    amount: 50000,
    paid: 50000,
    balance: 0,
    dueDate: '2024-01-31',
    status: 'paid',
    paymentMethod: 'MPESA',
  },
]

const columns: ColumnDef<SampleData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
]

export function AdminDemo() {
  const { config } = useTenantTheme()
  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [grades, setGrades] = useState<GradeData[]>(sampleGrades)

  // Multi-step form steps (Student Admission example)
  const admissionSteps: FormStep[] = [
    {
      title: 'Personal Information',
      description: 'Enter student personal details',
      content: (
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Full Name</label>
            <Input placeholder='Enter full name' />
          </div>
          <div>
            <label className='text-sm font-medium'>ID Number</label>
            <Input placeholder='Enter ID number' />
          </div>
          <div>
            <label className='text-sm font-medium'>Date of Birth</label>
            <Input type='date' />
          </div>
        </div>
      ),
    },
    {
      title: 'Academic Information',
      description: 'Select programme and intake',
      content: (
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Programme</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select programme' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='diploma'>Diploma in IT</SelectItem>
                <SelectItem value='certificate'>Certificate in Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className='text-sm font-medium'>Intake</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select intake' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='jan2024'>January 2024</SelectItem>
                <SelectItem value='may2024'>May 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      title: 'Review & Submit',
      description: 'Review all information before submitting',
      content: (
        <div className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            Please review all information before submitting the application.
          </p>
        </div>
      ),
    },
  ]

  // Simple form fields (Material Requisition example)
  const materialRequisitionFields: FormField[] = [
    {
      label: 'Item Name',
      name: 'itemName',
      input: <Input name='itemName' placeholder='Enter item name' />,
      required: true,
    },
    {
      label: 'Quantity',
      name: 'quantity',
      input: <Input name='quantity' type='number' placeholder='Enter quantity' />,
      required: true,
    },
    {
      label: 'Unit of Measure',
      name: 'uom',
      input: (
        <Select name='uom'>
          <SelectTrigger>
            <SelectValue placeholder='Select unit' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='kg'>Kilograms (kg)</SelectItem>
            <SelectItem value='pcs'>Pieces (pcs)</SelectItem>
            <SelectItem value='liters'>Liters</SelectItem>
          </SelectContent>
        </Select>
      ),
      required: true,
    },
    {
      label: 'Purpose',
      name: 'purpose',
      input: <Textarea name='purpose' placeholder='Enter purpose' />,
      required: true,
      width: 'full',
    },
  ]

  // Modal form fields (Quick Add Student)
  const quickAddFields: FormField[] = [
    {
      label: 'Student Name',
      name: 'name',
      input: <Input name='name' placeholder='Enter student name' />,
      required: true,
    },
    {
      label: 'Student ID',
      name: 'studentId',
      input: <Input name='studentId' placeholder='Enter student ID' />,
      required: true,
    },
    {
      label: 'Programme',
      name: 'programme',
      input: (
        <Select name='programme'>
          <SelectTrigger>
            <SelectValue placeholder='Select programme' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='diploma'>Diploma in IT</SelectItem>
            <SelectItem value='certificate'>Certificate in Business</SelectItem>
          </SelectContent>
        </Select>
      ),
      required: true,
    },
  ]

  // Inline form fields (Quick Edit)
  const inlineFormFields = [
    { label: 'Name', name: 'name', type: 'text' as const, defaultValue: 'John Doe' },
    { label: 'Email', name: 'email', type: 'email' as const, defaultValue: 'john@example.com' },
    {
      label: 'Status',
      name: 'status',
      type: 'select' as const,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
    },
  ]

  const handleGradeChange = (
    studentId: string,
    assessment: string,
    grade: number
  ) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id === studentId) {
          return { ...g, [assessment]: grade }
        }
        return g
      })
    )
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Admin Portal - Component Showcase
            </h2>
            <p className='text-muted-foreground'>
              All common components for TVET ERP. Switch institutions from sidebar to see theme changes.
            </p>
          </div>
          <Button onClick={() => setModalFormOpen(true)}>
            Quick Add Student
          </Button>
        </div>

        {/* Current Theme Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Institution Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-4'>
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={config.name || 'TVET ERP'}
                  className='h-16 w-16 object-contain'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      const fallback = document.createElement('div')
                      fallback.className = 'text-4xl'
                      fallback.textContent = config.logo || '🎓'
                      parent.insertBefore(fallback, target)
                    }
                  }}
                />
              ) : (
                <div className='text-4xl'>{config.logo || '🎓'}</div>
              )}
              <div>
                <p className='font-semibold text-lg'>{config.name || 'TVET ERP'}</p>
                <p className='text-sm text-muted-foreground'>
                  Primary Color: <span style={{ color: config.primaryColor }}>{config.primaryColor}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric Cards */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            title='Total Students'
            value='1,234'
            icon={GraduationCap}
            trend={{ value: 12.5, isPositive: true }}
          />
          <MetricCard
            title='Active Courses'
            value='45'
            icon={BookOpen}
            trend={{ value: 8.2, isPositive: true }}
          />
          <MetricCard
            title='Revenue'
            value='KES 45,231'
            icon={DollarSign}
            trend={{ value: 5.3, isPositive: false }}
          />
          <MetricCard
            title='Total Users'
            value='567'
            icon={Users}
            trend={{ value: 15.7, isPositive: true }}
          />
        </div>

        <Tabs defaultValue='forms' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='forms'>Forms</TabsTrigger>
            <TabsTrigger value='tables'>Tables</TabsTrigger>
            <TabsTrigger value='components'>Components</TabsTrigger>
          </TabsList>

          {/* Forms Tab */}
          <TabsContent value='forms' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Multi-Step Form</CardTitle>
                <CardDescription>
                  Perfect for student admission, staff onboarding, and complex workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiStepForm
                  title='Student Admission'
                  steps={admissionSteps}
                  onSubmit={(data) => {
                    console.log('Admission submitted:', data)
                  }}
                  submitText='Submit Application'
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simple Form</CardTitle>
                <CardDescription>
                  For quick inputs like material requisition, leave application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleForm
                  title='Material Requisition'
                  description='Request materials for your department'
                  fields={materialRequisitionFields}
                  onSubmit={(data) => {
                    console.log('Requisition submitted:', data)
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inline Form</CardTitle>
                <CardDescription>
                  For quick inline edits in tables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InlineForm
                  fields={inlineFormFields}
                  onSave={(data) => {
                    console.log('Inline save:', data)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tables Tab */}
          <TabsContent value='tables' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Smart Data Table</CardTitle>
                <CardDescription>
                  General purpose table with search, pagination, and column toggling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SmartTable
                  data={sampleData}
                  columns={columns}
                  searchKey='name'
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Sheet Table</CardTitle>
                <CardDescription>
                  For grade entry and viewing student performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradeSheetTable
                  data={grades}
                  assessmentType='End of Semester Assessment'
                  editable={true}
                  onGradeChange={handleGradeChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Table</CardTitle>
                <CardDescription>
                  For marking and viewing attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable
                  data={sampleAttendance}
                  dates={['2024-01-15', '2024-01-16', '2024-01-17']}
                  editable={true}
                  showPercentage={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Table</CardTitle>
                <CardDescription>
                  For fee statements and payment tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialTable
                  data={sampleFinancial}
                  currency='KES'
                  showActions={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value='components' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-4'>
                  <StatusBadge status='active' />
                  <StatusBadge status='pending' />
                  <StatusBadge status='rejected' />
                  <StatusBadge status='archived' />
                  <StatusBadge status='completed' />
                  <StatusBadge status='inactive' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Institutions</CardTitle>
                <CardDescription>
                  Select any institution from the sidebar to apply its theme globally
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 sm:grid-cols-3'>
                  {demoThemes.map((theme, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors'
                    >
                      {theme.logoUrl ? (
                        <img
                          src={theme.logoUrl}
                          alt={theme.name}
                          className='h-12 w-12 object-contain'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              const fallback = document.createElement('div')
                              fallback.className = 'text-3xl'
                              fallback.textContent = theme.logo || '🎓'
                              parent.insertBefore(fallback, target)
                            }
                          }}
                        />
                      ) : (
                        <div className='text-3xl'>{theme.logo}</div>
                      )}
                      <p className='font-semibold text-center'>{theme.name}</p>
                      <div
                        className='h-12 w-full rounded-md border-2'
                        style={{
                          backgroundColor: theme.primaryColor,
                          borderColor: theme.primaryColor,
                        }}
                      />
                      <p className='text-xs text-muted-foreground'>
                        {theme.primaryColor}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Form */}
        <ModalForm
          open={modalFormOpen}
          onClose={() => setModalFormOpen(false)}
          title='Quick Add Student'
          description='Add a new student quickly'
          fields={quickAddFields}
          onSubmit={(data) => {
            console.log('Quick add:', data)
          }}
          submitText='Add Student'
        />
      </Main>
    </>
  )
}
