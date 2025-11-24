/**
 * Students Demo Page
 * 
 * Showcases common components from a student's perspective:
 * - View grades (GradeSheetTable)
 * - View attendance (AttendanceTable)
 * - View fee statements (FinancialTable)
 * - Simple forms (leave application, etc.)
 * 
 * All components use common shared components for consistency.
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
  GradeSheetTable,
  AttendanceTable,
  FinancialTable,
  type GradeData,
  type AttendanceData,
  type FinancialData,
} from '@/components/shared'
import { SimpleForm, ModalForm, type FormField } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

// Sample data
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
    '2024-01-18': 'late',
    '2024-01-19': 'present',
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    studentId: 'ST002',
    '2024-01-15': 'present',
    '2024-01-16': 'present',
    '2024-01-17': 'present',
    '2024-01-18': 'present',
    '2024-01-19': 'excused',
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
  {
    id: '2',
    reference: 'FEE-2024-002',
    description: 'Examination Fee',
    amount: 5000,
    paid: 3000,
    balance: 2000,
    dueDate: '2024-02-15',
    status: 'partial',
    paymentMethod: 'Bank Transfer',
  },
]

export function StudentsDemo() {
  const [leaveModalOpen, setLeaveModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const leaveFormFields: FormField[] = [
    {
      label: 'Leave Type',
      name: 'leaveType',
      input: (
        <Select name='leaveType'>
          <SelectTrigger>
            <SelectValue placeholder='Select leave type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='sick'>Sick Leave</SelectItem>
            <SelectItem value='emergency'>Emergency</SelectItem>
            <SelectItem value='personal'>Personal</SelectItem>
          </SelectContent>
        </Select>
      ),
      required: true,
    },
    {
      label: 'Start Date',
      name: 'startDate',
      input: (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start text-left font-normal'
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ),
      required: true,
    },
    {
      label: 'Reason',
      name: 'reason',
      input: <Textarea name='reason' placeholder='Enter reason for leave' />,
      required: true,
      width: 'full',
    },
  ]

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
            <h2 className='text-2xl font-bold tracking-tight'>Student Portal</h2>
            <p className='text-muted-foreground'>
              View your grades, attendance, and fee statements
            </p>
          </div>
          <Button onClick={() => setLeaveModalOpen(true)}>
            Apply for Leave
          </Button>
        </div>

        <Tabs defaultValue='grades' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='grades'>My Grades</TabsTrigger>
            <TabsTrigger value='attendance'>Attendance</TabsTrigger>
            <TabsTrigger value='fees'>Fee Statements</TabsTrigger>
          </TabsList>

          <TabsContent value='grades' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>My Academic Performance</CardTitle>
                <CardDescription>
                  View your grades and competency status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradeSheetTable
                  data={sampleGrades}
                  assessmentType='End of Semester Assessment'
                  editable={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='attendance' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>My Attendance Record</CardTitle>
                <CardDescription>
                  Track your attendance percentage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable
                  data={sampleAttendance}
                  dates={['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']}
                  editable={false}
                  showPercentage={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='fees' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>My Fee Statements</CardTitle>
                <CardDescription>
                  View your fee payments and balances
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
        </Tabs>

        {/* Leave Application Modal */}
        <ModalForm
          open={leaveModalOpen}
          onClose={() => setLeaveModalOpen(false)}
          title='Apply for Leave'
          description='Submit a leave application request'
          fields={leaveFormFields}
          onSubmit={(data) => {
            console.log('Leave application:', data)
            // Handle submission
          }}
          submitText='Submit Application'
        />
      </Main>
    </>
  )
}

