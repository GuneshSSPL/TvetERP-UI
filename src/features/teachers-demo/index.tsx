/**
 * Teachers Demo Page
 * 
 * Showcases common components from a teacher's perspective:
 * - Grade entry (GradeSheetTable - editable)
 * - Attendance marking (AttendanceTable - editable)
 * - Student management forms
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
  type GradeData,
  type AttendanceData,
} from '@/components/shared'
import { SimpleForm, ModalForm, type FormField } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

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
  {
    id: '3',
    studentName: 'Bob Johnson',
    studentId: 'ST003',
    cat1: undefined,
    cat2: undefined,
    practical: undefined,
    final: undefined,
    total: undefined,
    grade: undefined,
    competency: undefined,
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
  {
    id: '3',
    studentName: 'Bob Johnson',
    studentId: 'ST003',
    '2024-01-15': 'not-marked',
    '2024-01-16': 'not-marked',
    '2024-01-17': 'not-marked',
    '2024-01-18': 'not-marked',
    '2024-01-19': 'not-marked',
  },
]

export function TeachersDemo() {
  const [grades, setGrades] = useState<GradeData[]>(sampleGrades)
  const [attendance, setAttendance] = useState<AttendanceData[]>(sampleAttendance)
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false)

  const handleGradeChange = (
    studentId: string,
    assessment: string,
    grade: number
  ) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id === studentId) {
          const updated = { ...g, [assessment]: grade }
          // Calculate total (simple average for demo)
          const assessments = [
            updated.cat1,
            updated.cat2,
            updated.practical,
            updated.final,
          ].filter((v) => v !== undefined) as number[]
          if (assessments.length > 0) {
            updated.total = assessments.reduce((a, b) => a + b, 0) / assessments.length
            // Simple grade calculation
            if (updated.total >= 70) updated.grade = 'A'
            else if (updated.total >= 60) updated.grade = 'B'
            else if (updated.total >= 50) updated.grade = 'C'
            else updated.grade = 'D'
            updated.competency = updated.total >= 50 ? 'C' : 'NYC'
          }
          return updated
        }
        return g
      })
    )
  }

  const handleAttendanceChange = (
    studentId: string,
    date: string,
    status: 'present' | 'absent' | 'late' | 'excused' | 'not-marked'
  ) => {
    setAttendance((prev) =>
      prev.map((a) => {
        if (a.id === studentId) {
          return { ...a, [date]: status }
        }
        return a
      })
    )
  }

  const addStudentFields: FormField[] = [
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
            <SelectItem value='artisan'>Artisan in Welding</SelectItem>
          </SelectContent>
        </Select>
      ),
      required: true,
    },
    {
      label: 'Notes',
      name: 'notes',
      input: <Textarea name='notes' placeholder='Additional notes' />,
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
            <h2 className='text-2xl font-bold tracking-tight'>Teacher Portal</h2>
            <p className='text-muted-foreground'>
              Enter grades, mark attendance, and manage your classes
            </p>
          </div>
          <Button onClick={() => setAddStudentModalOpen(true)}>
            Add Student
          </Button>
        </div>

        <Tabs defaultValue='grades' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='grades'>Grade Entry</TabsTrigger>
            <TabsTrigger value='attendance'>Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value='grades' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Grade Entry Sheet</CardTitle>
                <CardDescription>
                  Enter grades for your students. Changes are saved automatically.
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
          </TabsContent>

          <TabsContent value='attendance' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Attendance Marking</CardTitle>
                <CardDescription>
                  Mark student attendance. Click present/absent buttons to record.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable
                  data={attendance}
                  dates={['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']}
                  editable={true}
                  onAttendanceChange={handleAttendanceChange}
                  showPercentage={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Student Modal */}
        <ModalForm
          open={addStudentModalOpen}
          onClose={() => setAddStudentModalOpen(false)}
          title='Add New Student'
          description='Register a new student to your class'
          fields={addStudentFields}
          onSubmit={(data) => {
            console.log('New student:', data)
            // Handle submission
          }}
          submitText='Add Student'
        />
      </Main>
    </>
  )
}

