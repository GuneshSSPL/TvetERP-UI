/**
 * Main Dashboard
 * 
 * Central dashboard showcasing all common components.
 * This is the main entry point that demonstrates:
 * - All form types
 * - All table types
 * - Metric cards
 * - Status badges
 * - Theme awareness
 * 
 * All components come from the common components library.
 */

import { useState } from 'react'
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
  BarChart,
  PieChart,
  ScatterChart,
  LineChart,
  DatePickerDemo,
  Timetable,
  KanbanBoard,
  type FormStep,
  type FormField,
  type GradeData,
  type AttendanceData,
  type FinancialData,
  type TimetableEvent,
  type KanbanCard,
  type KanbanColumn,
} from '@/components/shared'
import { useTenantTheme } from '@/context/tenant-theme-provider'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  FileText,
  Calendar,
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
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'pending', role: 'Teacher' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', role: 'Student' },
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
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  { accessorKey: 'role', header: 'Role' },
]

export function MainDashboard() {
  const { config } = useTenantTheme()
  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [grades, setGrades] = useState<GradeData[]>(sampleGrades)

  // Multi-step form example (Student Admission)
  const admissionSteps: FormStep[] = [
    {
      title: 'Personal Info',
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
        </div>
      ),
    },
    {
      title: 'Academic Info',
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
        </div>
      ),
    },
    {
      title: 'Review',
      description: 'Review and submit',
      content: <p className='text-sm text-muted-foreground'>Review all information</p>,
    },
  ]

  // Simple form example (Material Requisition)
  const materialFields: FormField[] = [
    {
      label: 'Item Name',
      name: 'itemName',
      input: <Input name='itemName' placeholder='Enter item name' />,
      required: true,
    },
    {
      label: 'Quantity',
      name: 'quantity',
      input: <Input name='quantity' type='number' />,
      required: true,
    },
    {
      label: 'Purpose',
      name: 'purpose',
      input: <Textarea name='purpose' />,
      width: 'full',
    },
  ]

  // Modal form fields
  const quickAddFields: FormField[] = [
    {
      label: 'Student Name',
      name: 'name',
      input: <Input name='name' />,
      required: true,
    },
    {
      label: 'Student ID',
      name: 'studentId',
      input: <Input name='studentId' />,
      required: true,
    },
  ]

  // Inline form fields
  const inlineFields = [
    { label: 'Name', name: 'name', type: 'text' as const, defaultValue: 'John Doe' },
    { label: 'Email', name: 'email', type: 'email' as const, defaultValue: 'john@example.com' },
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
            <h2 className='text-2xl font-bold tracking-tight'>TVET ERP Dashboard</h2>
            <p className='text-muted-foreground'>
              Comprehensive component showcase. All components adapt to institution theme.
            </p>
          </div>
          <Button onClick={() => setModalFormOpen(true)}>Quick Add</Button>
        </div>

        {/* Institution Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Institution: {config.name || 'TVET ERP'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-4'>
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={config.name}
                  className='h-12 w-12 object-contain'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : (
                <div className='text-3xl'>{config.logo || '🎓'}</div>
              )}
              <div>
                <p className='font-semibold'>{config.name}</p>
                <p className='text-sm text-muted-foreground'>
                  Theme: <span style={{ color: config.colorPalette?.primary || config.primaryColor }}>
                    {config.colorPalette?.primary || config.primaryColor}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
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

        <Tabs defaultValue='reports' className='space-y-4'>
          <TabsList className='w-full sm:w-auto'>
            <TabsTrigger value='reports'>Reports & Charts</TabsTrigger>
            <TabsTrigger value='forms'>Forms (4 Types)</TabsTrigger>
            <TabsTrigger value='tables'>Tables (4 Types)</TabsTrigger>
            <TabsTrigger value='components'>Components</TabsTrigger>
            <TabsTrigger value='advanced'>Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value='reports' className='space-y-4'>
            {/* Charts Grid */}
            <div className='grid gap-4 md:grid-cols-2'>
              <BarChart
                title='Enrollment by Programme'
                description='Student enrollment across different programmes'
                data={[
                  { name: 'Diploma IT', Students: 450, Teachers: 25 },
                  { name: 'Certificate Business', Students: 320, Teachers: 18 },
                  { name: 'Artisan Welding', Students: 180, Teachers: 12 },
                  { name: 'Diploma Engineering', Students: 280, Teachers: 20 },
                ]}
                dataKeys={['Students', 'Teachers']}
                height={300}
              />

              <PieChart
                title='Fee Payment Status'
                description='Distribution of fee payment status'
                data={[
                  { name: 'Paid', value: 850 },
                  { name: 'Partial', value: 320 },
                  { name: 'Pending', value: 180 },
                  { name: 'Overdue', value: 95 },
                ]}
                height={300}
              />

              <LineChart
                title='Enrollment Trends'
                description='Monthly enrollment trends over the year'
                data={[
                  { name: 'Jan', Enrollment: 120, Graduated: 45 },
                  { name: 'Feb', Enrollment: 135, Graduated: 38 },
                  { name: 'Mar', Enrollment: 150, Graduated: 52 },
                  { name: 'Apr', Enrollment: 145, Graduated: 48 },
                  { name: 'May', Enrollment: 160, Graduated: 55 },
                  { name: 'Jun', Enrollment: 175, Graduated: 60 },
                ]}
                dataKeys={['Enrollment', 'Graduated']}
                height={300}
              />

              <ScatterChart
                title='Performance Analysis'
                description='Grade vs Attendance correlation'
                xAxisLabel='Attendance %'
                yAxisLabel='Average Grade'
                data={[
                  {
                    name: 'Students',
                    data: [
                      { x: 75, y: 65, name: 'Student A' },
                      { x: 85, y: 78, name: 'Student B' },
                      { x: 90, y: 82, name: 'Student C' },
                      { x: 70, y: 58, name: 'Student D' },
                      { x: 95, y: 88, name: 'Student E' },
                      { x: 80, y: 72, name: 'Student F' },
                      { x: 88, y: 80, name: 'Student G' },
                      { x: 65, y: 55, name: 'Student H' },
                    ],
                  },
                ]}
                height={300}
              />
            </div>

            {/* Additional Charts */}
            <div className='grid gap-4 md:grid-cols-2'>
              <BarChart
                title='Revenue by Department'
                description='Fee collection by academic department'
                data={[
                  { name: 'IT', Revenue: 1250000, Target: 1200000 },
                  { name: 'Business', Revenue: 980000, Target: 1000000 },
                  { name: 'Engineering', Revenue: 1450000, Target: 1400000 },
                  { name: 'Arts', Revenue: 750000, Target: 800000 },
                ]}
                dataKeys={['Revenue', 'Target']}
                height={300}
              />

              <PieChart
                title='Student Status Distribution'
                description='Current status of all students'
                data={[
                  { name: 'Active', value: 1234 },
                  { name: 'On Leave', value: 45 },
                  { name: 'Suspended', value: 12 },
                  { name: 'Graduated', value: 567 },
                ]}
                height={300}
              />
            </div>
          </TabsContent>

          <TabsContent value='forms' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>1. Multi-Step Form</CardTitle>
                <CardDescription>For complex workflows like student admission</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiStepForm
                  title='Student Admission'
                  steps={admissionSteps}
                  onSubmit={(data) => console.log('Submitted:', data)}
                  submitText='Submit Application'
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Simple Form</CardTitle>
                <CardDescription>For quick inputs like material requisition</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleForm
                  title='Material Requisition'
                  fields={materialFields}
                  onSubmit={(data) => console.log('Submitted:', data)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Inline Form</CardTitle>
                <CardDescription>For quick inline edits</CardDescription>
              </CardHeader>
              <CardContent>
                <InlineForm
                  fields={inlineFields}
                  onSave={(data) => console.log('Saved:', data)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Modal Form</CardTitle>
                <CardDescription>Click "Quick Add" button above to see modal form</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value='tables' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>1. Smart Data Table</CardTitle>
                <CardDescription>General purpose table with search and pagination</CardDescription>
              </CardHeader>
              <CardContent>
                <SmartTable data={sampleData} columns={columns} searchKey='name' />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Grade Sheet Table</CardTitle>
                <CardDescription>For grade entry and viewing</CardDescription>
              </CardHeader>
              <CardContent>
                <GradeSheetTable
                  data={grades}
                  assessmentType='End of Semester'
                  editable={true}
                  onGradeChange={handleGradeChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Attendance Table</CardTitle>
                <CardDescription>For marking and viewing attendance</CardDescription>
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
                <CardTitle>4. Financial Table</CardTitle>
                <CardDescription>For fee statements and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialTable data={sampleFinancial} currency='KES' />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='components' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
                <CardDescription>Status indicators with theme colors and icons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  <StatusBadge status='active' showIcon />
                  <StatusBadge status='pending' showIcon />
                  <StatusBadge status='rejected' showIcon />
                  <StatusBadge status='archived' showIcon />
                  <StatusBadge status='completed' showIcon />
                  <StatusBadge status='inactive' showIcon />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Standard Buttons</CardTitle>
                <CardDescription>4 button variants with border-only hover</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-3'>
                  <Button variant='default'>Primary</Button>
                  <Button variant='secondary'>Secondary</Button>
                  <Button variant='tertiary'>Tertiary</Button>
                  <Button variant='destructive'>Destructive</Button>
                  <Button variant='outline'>Outline</Button>
                  <Button variant='ghost'>Ghost</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Inputs</CardTitle>
                <CardDescription>All inputs with border-only hover styling</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Text Input</Label>
                  <Input placeholder='Type here...' />
                </div>
                <div className='space-y-2'>
                  <Label>Textarea</Label>
                  <Textarea placeholder='Enter description...' />
                </div>
                <div className='space-y-2'>
                  <Label>Select</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select an option' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='option1'>Option 1</SelectItem>
                      <SelectItem value='option2'>Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center gap-6'>
                  <div className='flex items-center gap-2'>
                    <Checkbox id='checkbox-demo' />
                    <Label htmlFor='checkbox-demo'>Checkbox</Label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <RadioGroup defaultValue='option1'>
                      <div className='flex items-center gap-2'>
                        <RadioGroupItem value='option1' id='radio-demo-1' />
                        <Label htmlFor='radio-demo-1'>Radio Option 1</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Switch id='switch-demo' />
                    <Label htmlFor='switch-demo'>Switch</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='advanced' className='space-y-4'>
            <DatePickerDemo />

            <Timetable
              events={[
                {
                  id: '1',
                  subject: 'Mathematics',
                  room: 'Room 101',
                  instructor: 'Dr. Smith',
                  programme: 'Diploma IT',
                  startTime: '09:00',
                  endTime: '10:30',
                  day: 'Monday',
                },
                {
                  id: '2',
                  subject: 'Programming',
                  room: 'Lab 201',
                  instructor: 'Prof. Johnson',
                  programme: 'Diploma IT',
                  startTime: '11:00',
                  endTime: '12:30',
                  day: 'Monday',
                },
                {
                  id: '3',
                  subject: 'Database Systems',
                  room: 'Lab 202',
                  instructor: 'Dr. Williams',
                  programme: 'Diploma IT',
                  startTime: '14:00',
                  endTime: '15:30',
                  day: 'Wednesday',
                },
                {
                  id: '4',
                  subject: 'Web Development',
                  room: 'Lab 201',
                  instructor: 'Prof. Brown',
                  programme: 'Diploma IT',
                  startTime: '10:00',
                  endTime: '11:30',
                  day: 'Friday',
                },
              ]}
            />

            <Card>
              <CardHeader>
                <CardTitle>Kanban Board</CardTitle>
                <CardDescription>Task management board with drag and drop</CardDescription>
              </CardHeader>
              <CardContent>
                <KanbanBoard
                  columns={[
                    { id: 'pending', title: 'To Do', status: 'pending' },
                    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
                    { id: 'review', title: 'Review', status: 'review' },
                    { id: 'completed', title: 'Completed', status: 'completed' },
                  ]}
                  initialCards={[
                    {
                      id: '1',
                      title: 'Review student applications',
                      description: 'Process and review all pending student applications',
                      status: 'pending',
                      assignee: 'Admin',
                      dueDate: '2024-01-20',
                      priority: 'high',
                      tags: ['urgent', 'admissions'],
                    },
                    {
                      id: '2',
                      title: 'Update course curriculum',
                      description: 'Revise IT diploma curriculum for next semester',
                      status: 'in-progress',
                      assignee: 'Academic Head',
                      dueDate: '2024-01-25',
                      priority: 'medium',
                      tags: ['curriculum'],
                    },
                    {
                      id: '3',
                      title: 'Prepare exam papers',
                      description: 'Create exam papers for end of semester',
                      status: 'review',
                      assignee: 'Exams Officer',
                      dueDate: '2024-01-18',
                      priority: 'high',
                      tags: ['exams'],
                    },
                    {
                      id: '4',
                      title: 'Update student records',
                      description: 'Sync all student records with new system',
                      status: 'completed',
                      assignee: 'IT Support',
                      dueDate: '2024-01-15',
                      priority: 'low',
                      tags: ['system'],
                    },
                  ]}
                  onCardMove={(cardId, newStatus) => {
                    console.log(`Card ${cardId} moved to ${newStatus}`)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ModalForm
          open={modalFormOpen}
          onClose={() => setModalFormOpen(false)}
          title='Quick Add Student'
          fields={quickAddFields}
          onSubmit={(data) => console.log('Added:', data)}
        />
      </Main>
    </>
  )
}

