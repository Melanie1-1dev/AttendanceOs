import { useEffect, useMemo, useState } from 'react'
import './App.css'

const studentSeed = [
  { id: 'st-01', name: 'Jean Claude', studentId: 'ST001', rfidUid: '8A:4F:21', cardAssigned: true, lastAttendance: 'Today, 08:42', status: 'Active' },
  { id: 'st-02', name: 'Alice Uwase', studentId: 'ST002', rfidUid: 'B9:2C:77', cardAssigned: true, lastAttendance: 'Today, 09:12', status: 'Active' },
  { id: 'st-03', name: 'Patrick Niyonzima', studentId: 'ST003', rfidUid: '', cardAssigned: false, lastAttendance: 'Yesterday', status: 'No Card' },
  { id: 'st-04', name: 'Emmanuel Habimana', studentId: 'ST004', rfidUid: 'F1:7A:40', cardAssigned: true, lastAttendance: 'Today, 08:47', status: 'Active' },
  { id: 'st-05', name: 'Marie Claire Mukamana', studentId: 'ST005', rfidUid: '41:6D:37', cardAssigned: true, lastAttendance: 'Today, 08:51', status: 'Active' },
  { id: 'st-06', name: 'Eric Tuyisenge', studentId: 'ST006', rfidUid: '', cardAssigned: false, lastAttendance: 'Monday', status: 'No Card' },
  { id: 'st-07', name: 'Aline Mutoni', studentId: 'ST007', rfidUid: '94:E7:18', cardAssigned: true, lastAttendance: 'Today, 08:58', status: 'Active' },
  { id: 'st-08', name: 'Frank Nsengimana', studentId: 'ST008', rfidUid: '70:99:12', cardAssigned: true, lastAttendance: 'Today, 09:08', status: 'Active' },
  { id: 'st-09', name: 'Nadia Isimbi', studentId: 'ST009', rfidUid: '', cardAssigned: false, lastAttendance: 'Yesterday', status: 'No Card' },
  { id: 'st-10', name: 'Yves Ndayambaje', studentId: 'ST010', rfidUid: '12:AD:99', cardAssigned: true, lastAttendance: 'Today, 08:39', status: 'Active' },
  { id: 'st-11', name: 'Cynthia Mutesa', studentId: 'ST011', rfidUid: '88:11:EC', cardAssigned: true, lastAttendance: 'Today, 09:06', status: 'Active' },
  { id: 'st-12', name: 'Gilbert Ingabire', studentId: 'ST012', rfidUid: '52:7B:A1', cardAssigned: true, lastAttendance: 'Today, 08:55', status: 'Active' },
  { id: 'st-13', name: 'Merveille Uwera', studentId: 'ST013', rfidUid: '', cardAssigned: false, lastAttendance: 'Last week', status: 'No Card' },
  { id: 'st-14', name: 'Olivier Kamanzi', studentId: 'ST014', rfidUid: 'A2:4D:55', cardAssigned: true, lastAttendance: 'Today, 08:40', status: 'Active' },
  { id: 'st-15', name: 'Ange Karangwa', studentId: 'ST015', rfidUid: '29:75:CC', cardAssigned: true, lastAttendance: 'Today, 08:49', status: 'Active' },
  { id: 'st-16', name: 'Theophile Dushime', studentId: 'ST016', rfidUid: '', cardAssigned: false, lastAttendance: 'Tuesday', status: 'No Card' },
  { id: 'st-17', name: 'Lina Habiyambere', studentId: 'ST017', rfidUid: 'E8:05:63', cardAssigned: true, lastAttendance: 'Today, 09:00', status: 'Active' },
  { id: 'st-18', name: 'Cedric Asiah', studentId: 'ST018', rfidUid: 'C4:42:10', cardAssigned: true, lastAttendance: 'Today, 09:09', status: 'Active' },
  { id: 'st-19', name: 'Grace Munezero', studentId: 'ST019', rfidUid: '63:9F:FB', cardAssigned: true, lastAttendance: 'Today, 08:33', status: 'Active' },
  { id: 'st-20', name: 'Hassan Nkurunziza', studentId: 'ST020', rfidUid: '', cardAssigned: false, lastAttendance: 'Wednesday', status: 'No Card' },
  { id: 'st-21', name: 'Ruth Nyiransabimana', studentId: 'ST021', rfidUid: '16:38:08', cardAssigned: true, lastAttendance: 'Today, 08:52', status: 'Active' },
  { id: 'st-22', name: 'Samuel Mugisha', studentId: 'ST022', rfidUid: '95:EA:4C', cardAssigned: true, lastAttendance: 'Today, 09:12', status: 'Active' },
  { id: 'st-23', name: 'Ines Mukankusi', studentId: 'ST023', rfidUid: '', cardAssigned: false, lastAttendance: 'Tuesday', status: 'No Card' },
  { id: 'st-24', name: 'Darius Iradukunda', studentId: 'ST024', rfidUid: '4F:81:26', cardAssigned: true, lastAttendance: 'Today, 08:46', status: 'Active' },
  { id: 'st-25', name: 'Martine Uwingabire', studentId: 'ST025', rfidUid: 'A1:3D:5E', cardAssigned: true, lastAttendance: 'Today, 08:57', status: 'Active' },
  { id: 'st-26', name: 'Sylvie Niyonkuru', studentId: 'ST026', rfidUid: '', cardAssigned: false, lastAttendance: 'Last week', status: 'No Card' },
  { id: 'st-27', name: 'Aimable Mupenzi', studentId: 'ST027', rfidUid: '72:46:AB', cardAssigned: true, lastAttendance: 'Today, 08:38', status: 'Active' },
  { id: 'st-28', name: 'Brenda Uwimana', studentId: 'ST028', rfidUid: 'B3:5C:1F', cardAssigned: true, lastAttendance: 'Today, 09:04', status: 'Active' },
  { id: 'st-29', name: 'Donatien Rukundo', studentId: 'ST029', rfidUid: '', cardAssigned: false, lastAttendance: 'Monday', status: 'No Card' },
  { id: 'st-30', name: 'Jules Nshuti', studentId: 'ST030', rfidUid: '87:9D:33', cardAssigned: true, lastAttendance: 'Today, 08:41', status: 'Active' },
  { id: 'st-31', name: 'Noella Nyirahabimana', studentId: 'ST031', rfidUid: '2E:19:7B', cardAssigned: true, lastAttendance: 'Today, 09:01', status: 'Active' },
  { id: 'st-32', name: 'Arnaud Tuyambaze', studentId: 'ST032', rfidUid: '', cardAssigned: false, lastAttendance: 'Yesterday', status: 'No Card' },
  { id: 'st-33', name: 'Madeline Mukeshimana', studentId: 'ST033', rfidUid: '6A:FF:91', cardAssigned: true, lastAttendance: 'Today, 08:59', status: 'Active' },
  { id: 'st-34', name: 'Kevin Batumike', studentId: 'ST034', rfidUid: '17:44:2C', cardAssigned: true, lastAttendance: 'Today, 08:36', status: 'Active' },
  { id: 'st-35', name: 'Mina Kamari', studentId: 'ST035', rfidUid: '', cardAssigned: false, lastAttendance: 'Last week', status: 'No Card' },
]

const initialSessions = [
  { id: 'cs-morning', name: 'Computer Science — Morning Session', className: 'Computer Science', teacher: 'M. Kamanzi', date: '2026-10-07', startTime: '08:00', endTime: '10:00', status: 'OPEN', attendance: 28, capacity: 35 },
  { id: 'db-systems', name: 'Database Systems', className: 'Database Systems', teacher: 'Dr. Mugisha', date: '2026-10-07', startTime: '10:00', endTime: '12:00', status: 'COMPLETED', attendance: 30, capacity: 35 },
  { id: 'networking-lab', name: 'Networking Lab', className: 'Networking', teacher: 'Mr. Ndayisaba', date: '2026-10-07', startTime: '13:00', endTime: '15:00', status: 'SCHEDULED', attendance: 0, capacity: 35 },
  { id: 'statistics-lecture', name: 'Statistics Lecture', className: 'Statistics', teacher: 'Mrs. Mukamanzi', date: '2026-10-07', startTime: '15:30', endTime: '17:00', status: 'OPEN', attendance: 18, capacity: 30 },
  { id: 'software-engineering', name: 'Software Engineering', className: 'Software Engineering', teacher: 'Dr. Ngarambe', date: '2026-10-06', startTime: '09:00', endTime: '11:00', status: 'CLOSED', attendance: 27, capacity: 32 },
  { id: 'web-dev', name: 'Web Development Studio', className: 'Web Development', teacher: 'M. Burke', date: '2026-10-05', startTime: '12:00', endTime: '14:00', status: 'COMPLETED', attendance: 25, capacity: 28 },
]

const initialAttendance = [
  { id: 'att-01', sessionId: 'cs-morning', studentId: 'ST001', time: '08:42:17' },
  { id: 'att-02', sessionId: 'cs-morning', studentId: 'ST002', time: '08:44:05' },
  { id: 'att-03', sessionId: 'cs-morning', studentId: 'ST004', time: '08:47:11' },
  { id: 'att-04', sessionId: 'cs-morning', studentId: 'ST005', time: '08:51:29' },
  { id: 'att-05', sessionId: 'cs-morning', studentId: 'ST007', time: '08:58:03' },
  { id: 'att-06', sessionId: 'cs-morning', studentId: 'ST008', time: '09:08:18' },
  { id: 'att-07', sessionId: 'cs-morning', studentId: 'ST010', time: '08:39:08' },
  { id: 'att-08', sessionId: 'cs-morning', studentId: 'ST011', time: '09:06:41' },
  { id: 'att-09', sessionId: 'cs-morning', studentId: 'ST012', time: '08:55:23' },
  { id: 'att-10', sessionId: 'cs-morning', studentId: 'ST014', time: '08:40:12' },
  { id: 'att-11', sessionId: 'cs-morning', studentId: 'ST015', time: '08:49:04' },
  { id: 'att-12', sessionId: 'cs-morning', studentId: 'ST017', time: '09:00:34' },
  { id: 'att-13', sessionId: 'cs-morning', studentId: 'ST018', time: '09:09:51' },
  { id: 'att-14', sessionId: 'cs-morning', studentId: 'ST019', time: '08:33:42' },
  { id: 'att-15', sessionId: 'cs-morning', studentId: 'ST021', time: '08:52:09' },
  { id: 'att-16', sessionId: 'cs-morning', studentId: 'ST022', time: '09:12:26' },
  { id: 'att-17', sessionId: 'cs-morning', studentId: 'ST024', time: '08:46:45' },
  { id: 'att-18', sessionId: 'cs-morning', studentId: 'ST025', time: '08:57:17' },
  { id: 'att-19', sessionId: 'cs-morning', studentId: 'ST027', time: '08:38:13' },
  { id: 'att-20', sessionId: 'cs-morning', studentId: 'ST028', time: '09:04:05' },
  { id: 'att-21', sessionId: 'cs-morning', studentId: 'ST030', time: '08:41:57' },
  { id: 'att-22', sessionId: 'cs-morning', studentId: 'ST031', time: '09:01:39' },
  { id: 'att-23', sessionId: 'cs-morning', studentId: 'ST033', time: '08:59:02' },
  { id: 'att-24', sessionId: 'cs-morning', studentId: 'ST034', time: '08:36:53' },
  { id: 'att-25', sessionId: 'cs-morning', studentId: 'ST003', time: '09:14:42' },
  { id: 'att-26', sessionId: 'cs-morning', studentId: 'ST006', time: '09:16:18' },
  { id: 'att-27', sessionId: 'cs-morning', studentId: 'ST020', time: '09:26:07' },
  { id: 'att-28', sessionId: 'cs-morning', studentId: 'ST035', time: '09:19:22' },
]

const sectionLabels = {
  dashboard: 'Dashboard',
  sessions: 'Sessions',
  cards: 'RFID Cards',
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '◫' },
  { id: 'sessions', label: 'Sessions', icon: '◷' },
  { id: 'cards', label: 'RFID Cards', icon: '◉' },
]

const statusTone = {
  OPEN: 'status-pill status-open',
  CLOSED: 'status-pill status-closed',
  COMPLETED: 'status-pill status-completed',
  SCHEDULED: 'status-pill status-scheduled',
}

function IconCable() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7.5a5 5 0 0 1 10 0v1.2c0 2.3-1.1 4.1-3 5.2V17a3 3 0 1 1-6 0v-3.1A6.2 6.2 0 0 1 6 8.7V7.5Zm2.2 1.3a2.8 2.8 0 0 0 5.6 0V8a2.8 2.8 0 1 0-5.6 0v.8Zm3.8 9.2a1.5 1.5 0 0 0 3 0v-1.7h-3v1.7Z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.8 17.4H8.2a2 2 0 0 1-1.7-3l.8-1.1V9.2a4.7 4.7 0 0 1 9.4 0v3.9l.8 1.1a2 2 0 0 1-1.7 3Zm-3.8 3.1a2 2 0 0 0 3.9 0h-3.9Z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.7 4.8a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm8.5 17.4-4.4-4.4 1.4-1.4 4.4 4.4-1.4 1.4Z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 10V8.8A4.8 4.8 0 0 1 12 4a4.8 4.8 0 0 1 4.8 4.8V10h.8a2 2 0 0 1 2 2v6.2a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2h.8Zm1.6 0h6.4V8.8A3.2 3.2 0 0 0 12 5.6a3.2 3.2 0 0 0-3.2 3.2V10Z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7.2 9.4 17.8 4 12.3l1.4-1.4 4 4 9.2-9.2 1.4 1.5Z" />
    </svg>
  )
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('attendance-theme') || 'dark')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [students, setStudents] = useState(studentSeed)
  const [sessions, setSessions] = useState(initialSessions)
  const [attendance, setAttendance] = useState(initialAttendance)
  const [selectedSessionId, setSelectedSessionId] = useState('cs-morning')
  const [showCreateSession, setShowCreateSession] = useState(false)
  const [showAssignWizard, setShowAssignWizard] = useState(false)
  const [assignmentStudentId, setAssignmentStudentId] = useState('ST001')
  const [assignmentStep, setAssignmentStep] = useState(1)
  const [pendingUid] = useState('8A:4F:21')
  const [readerOnline, setReaderOnline] = useState(true)
  const [demoMode, setDemoMode] = useState(true)
  const [scanState, setScanState] = useState({ type: 'idle', student: null, uid: '', time: '' })
  const [toasts, setToasts] = useState([
    { type: 'success', title: 'Attendance recorded', description: 'Jean Claude is now marked present.' },
  ])
  const [cardFilter, setCardFilter] = useState('all')
  const [studentSearch, setStudentSearch] = useState('')
  const [sessionSearch, setSessionSearch] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [sessionForm, setSessionForm] = useState({
    className: 'Computer Science',
    sessionName: 'Algorithms Review',
    teacher: 'M. Kamanzi',
    date: '2026-10-08',
    startTime: '08:00',
    endTime: '10:00',
  })
  const [reassignment, setReassignment] = useState(null)

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('attendance-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!toasts.length) return undefined
    const timer = window.setTimeout(() => {
      setToasts((current) => current.slice(1))
    }, 3200)
    return () => window.clearTimeout(timer)
  }, [toasts])

  const menuValue = useMemo(
    () => sectionLabels[activeSection] ?? 'Dashboard',
    [activeSection],
  )

  const activeSession = useMemo(
    () => sessions.find((session) => session.status === 'OPEN') ?? sessions[0],
    [sessions],
  )

  const presentStudentIds = useMemo(
    () => new Set(attendance.filter((record) => record.sessionId === activeSession?.id).map((record) => record.studentId)),
    [attendance, activeSession?.id],
  )

  const presentCount = presentStudentIds.size
  const totalStudents = students.length
  const attendanceRate = ((presentCount / totalStudents) * 100).toFixed(1)

  const dashboardStats = [
    { label: 'Present Today', value: presentCount, meta: '+4 since last session' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, meta: 'Across all classes' },
    { label: 'Active Session', value: '01', meta: 'Live classroom' },
    { label: 'Total Students', value: totalStudents, meta: 'Enrolled this term' },
  ]

  const filteredSessions = useMemo(() => {
    const query = sessionSearch.trim().toLowerCase()
    return sessions.filter((session) => {
      if (!query) return true
      return (
        session.name.toLowerCase().includes(query) ||
        session.className.toLowerCase().includes(query) ||
        session.teacher.toLowerCase().includes(query)
      )
    })
  }, [sessionSearch, sessions])

  const visibleStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase()
    return students.filter((student) => {
      const matchesQuery = !query || student.name.toLowerCase().includes(query) || student.studentId.toLowerCase().includes(query)
      const matchesFilter =
        cardFilter === 'all' ||
        (cardFilter === 'assigned' && student.cardAssigned) ||
        (cardFilter === 'no-card' && !student.cardAssigned)
      return matchesQuery && matchesFilter
    })
  }, [cardFilter, studentSearch, students])

  const selectedSession = selectedSessionId ? sessions.find((session) => session.id === selectedSessionId) ?? null : null

  const showToast = (type, title, description) => {
    setToasts((current) => [{ type, title, description }, ...current].slice(0, 3))
  }

  const handleCreateSession = () => {
    const nextErrors = {}
    if (!sessionForm.className.trim()) nextErrors.className = 'Class is required.'
    if (!sessionForm.sessionName.trim()) nextErrors.sessionName = 'Session name is required.'
    if (!sessionForm.teacher.trim()) nextErrors.teacher = 'Teacher is required.'
    if (!sessionForm.date) nextErrors.date = 'Select a date.'
    if (!sessionForm.startTime) nextErrors.startTime = 'Start time is required.'
    if (!sessionForm.endTime) nextErrors.endTime = 'End time is required.'

    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const newSession = {
      id: `session-${Date.now()}`,
      name: sessionForm.sessionName.trim(),
      className: sessionForm.className.trim(),
      teacher: sessionForm.teacher.trim(),
      date: sessionForm.date,
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      status: 'SCHEDULED',
      attendance: 0,
      capacity: 35,
    }

    setSessions((current) => [newSession, ...current])
    setSelectedSessionId(newSession.id)
    setShowCreateSession(false)
    setSessionForm({
      className: 'Computer Science',
      sessionName: 'Algorithms Review',
      teacher: 'M. Kamanzi',
      date: '2026-10-08',
      startTime: '08:00',
      endTime: '10:00',
    })
    setFormErrors({})
    showToast('success', 'Session created', `${newSession.name} was added successfully.`)
  }

  const handleCloseSession = (sessionId) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? { ...session, status: 'CLOSED' }
          : session,
      ),
    )
    showToast('info', 'Session closed', 'New attendance records are now disabled.')
  }

  const applyScanResult = (mode, providedUid) => {
    const session = activeSession

    if (!session) {
      setScanState({ type: 'closed', student: null, uid: '', time: '' })
      showToast('warning', 'No active session', 'Open a session to begin recording attendance.')
      return
    }

    if (mode === 'error') {
      setReaderOnline(false)
      setScanState({ type: 'error', student: null, uid: '', time: '' })
      showToast('error', 'Reader disconnected', 'Check the RFID reader connection.')
      return
    }

    if (mode === 'duplicate') {
      const repeatedStudent = students.find((student) => student.studentId === [...presentStudentIds][0]) ?? students[0]
      setScanState({
        type: 'duplicate',
        student: repeatedStudent,
        uid: repeatedStudent.rfidUid || '8A:4F:21',
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      })
      showToast('warning', 'Duplicate attendance', `${repeatedStudent.name} is already present.`)
      return
    }

    if (mode === 'unknown') {
      const uid = providedUid || `8${Math.floor(Math.random() * 10)}:4F:${Math.floor(Math.random() * 90) + 10}`
      setScanState({ type: 'unknown', student: null, uid, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) })
      showToast('info', 'Unknown card', 'This RFID card is not registered.')
      return
    }

    const candidates = students.filter((student) => student.cardAssigned && !presentStudentIds.has(student.studentId))
    const targetStudent = candidates[Math.floor(Math.random() * candidates.length)] ?? students.find((student) => student.cardAssigned)

    if (!targetStudent) {
      setScanState({ type: 'unknown', student: null, uid: providedUid || '8A:4F:21', time: '' })
      showToast('info', 'No student match', 'The card is not assigned to a registered student.')
      return
    }

    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false })
    const newRecord = {
      id: `att-${Date.now()}`,
      sessionId: session.id,
      studentId: targetStudent.studentId,
      time: currentTime,
    }

    setAttendance((current) => [...current, newRecord])
    setScanState({ type: 'success', student: targetStudent, uid: targetStudent.rfidUid, time: currentTime })
    showToast('success', 'Attendance recorded', `${targetStudent.name} is now marked present.`)
  }

  const handleDemoScan = (eventType) => {
    if (!readerOnline && eventType !== 'error') {
      setScanState({ type: 'error', student: null, uid: '', time: '' })
      showToast('error', 'Reader disconnected', 'Reconnect the reader before scanning.')
      return
    }

    if (eventType === 'error') {
      applyScanResult('error')
      return
    }

    if (eventType === 'duplicate') {
      applyScanResult('duplicate')
      return
    }

    if (eventType === 'unknown') {
      applyScanResult('unknown', '7D:90:2E')
      return
    }

    if (eventType === 'existing') {
      const existingStudent = students.find((student) => student.rfidUid && student.cardAssigned)
      setScanState({ type: 'success', student: existingStudent, uid: existingStudent?.rfidUid, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) })
      showToast('success', 'Card assigned', `${existingStudent?.name ?? 'Student'} was assigned successfully.`)
      return
    }

    applyScanResult('success')
  }

  const handleCardAssignment = () => {
    const targetStudent = students.find((student) => student.studentId === assignmentStudentId)
    const owner = students.find((student) => student.rfidUid === pendingUid && student.studentId !== assignmentStudentId)

    if (owner && owner.studentId !== targetStudent.studentId) {
      setReassignment({ currentOwner: owner, targetStudent, uid: pendingUid })
      return
    }

    setStudents((current) =>
      current.map((student) =>
        student.studentId === assignmentStudentId
          ? { ...student, rfidUid: pendingUid, cardAssigned: true, status: 'Active' }
          : student,
      ),
    )
    setShowAssignWizard(false)
    setAssignmentStep(1)
    setReassignment(null)
    showToast('success', 'RFID card assigned', `Card ${pendingUid} was assigned successfully.`)
  }

  const confirmReassignment = () => {
    const targetStudent = students.find((student) => student.studentId === assignmentStudentId)
    setStudents((current) =>
      current.map((student) => {
        if (student.studentId === reassignment.currentOwner.studentId) {
          return { ...student, rfidUid: '', cardAssigned: false, status: 'No Card' }
        }
        if (student.studentId === targetStudent.studentId) {
          return { ...student, rfidUid: pendingUid, cardAssigned: true, status: 'Active' }
        }
        return student
      }),
    )

    setShowAssignWizard(false)
    setAssignmentStep(1)
    setReassignment(null)
    showToast('success', 'RFID card updated', `${targetStudent.name} now owns card ${pendingUid}.`)
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            <IconCable />
          </div>
          <div>
            <div className="brand-name">RFID</div>
            <div className="brand-subtitle">ATTENDANCE</div>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-pill">
            <div className="avatar avatar-small">F</div>
            <div>
              <strong>Foustin</strong>
              <span>Teacher</span>
            </div>
            <span className="status-dot online" aria-label="Online status" />
          </div>
          <button type="button" className="settings-button">Settings</button>
          <button type="button" className="theme-toggle" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      <main className="content-panel">
        <header className="top-header">
          <div>
            <p className="eyebrow">{menuValue}</p>
            <h1>{menuValue}</h1>
          </div>

          <div className="header-actions">
            <div className="reader-status">
              <span className={`status-dot ${readerOnline ? 'online' : 'offline'}`} />
              <span>{readerOnline ? 'RFID Reader Online' : 'RFID Offline'}</span>
            </div>
            <button type="button" className="icon-button" aria-label="Notifications">
              <BellIcon />
            </button>
            <div className="avatar avatar-top">F</div>
          </div>
        </header>

        {demoMode && (
          <div className="demo-banner">
            <span>DEMO MODE</span>
            RFID events are being simulated.
          </div>
        )}

        {activeSection === 'dashboard' && (
          <>
            <section className="hero-card">
              <div>
                <p className="greeting">Good morning, Foustin 👋</p>
                <h2>Here&apos;s what&apos;s happening with your classroom today.</h2>
              </div>

              {activeSession && (
                <div className="current-session-panel">
                  <div className="panel-label">Current session</div>
                  <h3>{activeSession.name}</h3>
                  <p>{activeSession.startTime} — {activeSession.endTime}</p>
                  <div className="live-pill">● LIVE</div>
                  <button type="button" className="primary-button" onClick={() => setActiveSection('sessions')}>
                    Continue Attendance
                  </button>
                </div>
              )}
            </section>

            <section className="kpi-grid">
              {dashboardStats.map((card) => (
                <div key={card.label} className="metric-card">
                  <small>{card.label}</small>
                  <strong>{card.value}</strong>
                  <span>{card.meta}</span>
                </div>
              ))}
            </section>

            <section className="live-workspace">
              <div className="scanner-panel">
                <div className="panel-heading-row">
                  <span>RFID scanner</span>
                  <button type="button" className="secondary-button" onClick={() => setDemoMode((current) => !current)}>
                    {demoMode ? 'Demo On' : 'Demo Off'}
                  </button>
                </div>

                <div className={`scanner-stage ${scanState.type}`}>
                  <div className="scanner-illustration" aria-live="polite">
                    <div className="scanner-ring ring-one" />
                    <div className="scanner-ring ring-two" />
                    <div className="scanner-ring ring-three" />
                    <div className="scanner-core">
                      {scanState.type === 'success' ? <CheckIcon /> : scanState.type === 'duplicate' ? '!' : scanState.type === 'unknown' ? '?' : scanState.type === 'error' ? '×' : scanState.type === 'closed' ? <LockIcon /> : 'RFID'}
                    </div>
                  </div>

                  {scanState.type === 'idle' && (
                    <>
                      <h3>Ready to scan</h3>
                      <p>Place RFID card on reader</p>
                    </>
                  )}

                  {scanState.type === 'closed' && (
                    <>
                      <h3>Session closed</h3>
                      <p>New attendance records cannot be created.</p>
                    </>
                  )}

                  {scanState.type === 'success' && (
                    <>
                      <h3>Attendance recorded</h3>
                      <div className="scan-result-card success-card">
                        <div className="scan-avatar">{scanState.student?.name?.slice(0, 2).toUpperCase() ?? 'ST'}</div>
                        <div>
                          <strong>{scanState.student?.name ?? 'Student'}</strong>
                          <span>{scanState.student?.studentId ?? 'ST000'}</span>
                          <small>{scanState.time}</small>
                          <small>UID: {scanState.uid}</small>
                        </div>
                      </div>
                    </>
                  )}

                  {scanState.type === 'duplicate' && (
                    <>
                      <h3>Already marked present</h3>
                      <p>{scanState.student?.name} has already been recorded for this session.</p>
                    </>
                  )}

                  {scanState.type === 'unknown' && (
                    <>
                      <h3>Unregistered RFID card</h3>
                      <p>UID: {scanState.uid}</p>
                      <button type="button" className="secondary-button">Manage Card</button>
                    </>
                  )}

                  {scanState.type === 'error' && (
                    <>
                      <h3>Reader disconnected</h3>
                      <p>Check the RFID reader connection.</p>
                    </>
                  )}
                </div>

                <div className="demo-controls" aria-label="RFID simulator">
                  <button type="button" onClick={() => handleDemoScan('success')}>✓ Successful Scan</button>
                  <button type="button" onClick={() => handleDemoScan('duplicate')}>! Duplicate Scan</button>
                  <button type="button" onClick={() => handleDemoScan('unknown')}>? Unknown Card</button>
                  <button type="button" onClick={() => handleDemoScan('error')}>× Reader Offline</button>
                </div>
              </div>

              <div className="scan-feedback-panel">
                <div className="panel-heading-row">
                  <span>Scan result</span>
                  <button type="button" className="ghost-button">Live feed</button>
                </div>

                {scanState.type === 'success' && (
                  <div className="scan-detail success">
                    <div className="status-kicker success-kicker">✓</div>
                    <h3>Attendance recorded</h3>
                    <div className="person-block">
                      <strong>{scanState.student?.name}</strong>
                      <span>{scanState.student?.studentId}</span>
                    </div>
                    <div className="metadata-stack">
                      <span>{scanState.time}</span>
                      <span>UID: {scanState.uid}</span>
                    </div>
                  </div>
                )}

                {scanState.type === 'duplicate' && (
                  <div className="scan-detail warning">
                    <div className="status-kicker warning-kicker">!</div>
                    <h3>Already marked present</h3>
                    <p>{scanState.student?.name} has already been recorded for this session.</p>
                  </div>
                )}

                {scanState.type === 'unknown' && (
                  <div className="scan-detail info">
                    <div className="status-kicker info-kicker">?</div>
                    <h3>Unregistered RFID card</h3>
                    <p>UID: {scanState.uid}</p>
                    <button type="button" className="primary-button">Manage Card</button>
                  </div>
                )}

                {scanState.type === 'error' && (
                  <div className="scan-detail danger">
                    <div className="status-kicker danger-kicker">×</div>
                    <h3>Reader disconnected</h3>
                    <p>Check the RFID reader connection.</p>
                  </div>
                )}

                {scanState.type === 'closed' && (
                  <div className="scan-detail neutral">
                    <div className="status-kicker neutral-kicker"><LockIcon /></div>
                    <h3>Session closed</h3>
                    <p>New attendance records cannot be created.</p>
                  </div>
                )}

                {scanState.type === 'idle' && (
                  <div className="scan-detail neutral">
                    <div className="status-kicker neutral-kicker">◎</div>
                    <h3>Waiting for scan</h3>
                    <p>Place a card on the reader to record attendance.</p>
                  </div>
                )}
              </div>

              <div className="attendance-summary-panel">
                <div className="panel-heading-row">
                  <span>Attendance</span>
                  <button type="button" className="ghost-button">Live</button>
                </div>

                <div className="progress-ring" style={{ '--progress': `${Math.min(100, Number(attendanceRate))}%` }}>
                  <div className="progress-inner">
                    <strong>{attendanceRate}%</strong>
                  </div>
                </div>

                <div className="summary-numbers">
                  <div>
                    <strong>{presentCount}</strong>
                    <span>Present</span>
                  </div>
                  <div>
                    <strong>{Math.max(totalStudents - presentCount, 0)}</strong>
                    <span>Absent</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="lower-grid">
              <div className="panel-card table-panel">
                <div className="panel-heading-row">
                  <span>Live attendance table</span>
                  <div className="inline-tools">
                    <button type="button" className="ghost-button">Search</button>
                    <button type="button" className="ghost-button">Filter</button>
                    <button type="button" className="ghost-button">Sort</button>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Student ID</th>
                      <th>RFID</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.filter((record) => record.sessionId === activeSession?.id).slice(0, 8).map((record) => {
                      const student = students.find((entry) => entry.studentId === record.studentId)
                      return (
                        <tr key={record.id}>
                          <td>
                            <div className="student-cell">
                              <div className="mini-avatar">{student?.name?.slice(0, 2).toUpperCase() ?? 'ST'}</div>
                              <div>
                                <strong>{student?.name ?? 'Student'}</strong>
                                <small>{student?.studentId ?? 'ST000'}</small>
                              </div>
                            </div>
                          </td>
                          <td>{student?.studentId ?? 'ST000'}</td>
                          <td>{student?.rfidUid ?? '—'}</td>
                          <td>{record.time}</td>
                          <td><span className="present-badge">● Present</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="panel-card session-panel">
                <div className="panel-heading-row">
                  <span>Today&apos;s sessions</span>
                  <button type="button" className="ghost-button">View all</button>
                </div>

                <div className="timeline-list">
                  {sessions.slice(0, 4).map((session) => (
                    <button key={session.id} type="button" className="timeline-item" onClick={() => setSelectedSessionId(session.id)}>
                      <div className="timeline-time">{session.startTime}</div>
                      <div className="timeline-main">
                        <strong>{session.name}</strong>
                        <span className={statusTone[session.status] || 'status-pill'}>{session.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeSection === 'sessions' && (
          <section className="page-section">
            <div className="page-header-row">
              <div>
                <h2>Sessions</h2>
                <p>Manage attendance sessions.</p>
              </div>
              <button type="button" className="primary-button" onClick={() => setShowCreateSession(true)}>
                + New Session
              </button>
            </div>

            <div className="filter-row">
              <label className="search-field">
                <SearchIcon />
                <input value={sessionSearch} onChange={(event) => setSessionSearch(event.target.value)} placeholder="Search" />
              </label>

              <div className="date-field">
                <span>Date</span>
                <input type="date" defaultValue="2026-10-07" />
              </div>

              <div className="select-field">
                <span>Status</span>
                <select defaultValue="all">
                  <option value="all">All</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Class</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Attendance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session) => (
                    <tr key={session.id}>
                      <td>{session.name}</td>
                      <td>{session.className}</td>
                      <td>{session.date}</td>
                      <td>{session.startTime} — {session.endTime}</td>
                      <td>{session.attendance} / {session.capacity}</td>
                      <td><span className={statusTone[session.status] || 'status-pill'}>{session.status}</span></td>
                      <td>
                        <button type="button" className="mini-action" onClick={() => setSelectedSessionId(session.id)}>
                          {session.status === 'OPEN' ? 'Continue' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === 'cards' && (
          <section className="page-section">
            <div className="page-header-row">
              <div>
                <h2>RFID Cards</h2>
                <p>Manage student card assignments.</p>
              </div>
              <button type="button" className="primary-button" onClick={() => setShowAssignWizard(true)}>
                + Assign New Card
              </button>
            </div>

            <div className="reader-inline-status">
              <span className={`status-dot ${readerOnline ? 'online' : 'offline'}`} />
              <span>{readerOnline ? 'Reader online and ready' : 'Reader offline'}</span>
            </div>

            <div className="filter-row cards-row">
              <label className="search-field compact">
                <SearchIcon />
                <input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Search students" />
              </label>

              <div className="segmented-control" role="tablist" aria-label="Card status filter">
                <button type="button" className={cardFilter === 'all' ? 'active' : ''} onClick={() => setCardFilter('all')}>All</button>
                <button type="button" className={cardFilter === 'assigned' ? 'active' : ''} onClick={() => setCardFilter('assigned')}>Assigned</button>
                <button type="button" className={cardFilter === 'no-card' ? 'active' : ''} onClick={() => setCardFilter('no-card')}>No Card</button>
              </div>
            </div>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>RFID UID</th>
                    <th>Card status</th>
                    <th>Last attendance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-cell">
                          <div className="mini-avatar">{student.name.slice(0, 2).toUpperCase()}</div>
                          <div>
                            <strong>{student.name}</strong>
                            <small>{student.studentId}</small>
                          </div>
                        </div>
                      </td>
                      <td>{student.studentId}</td>
                      <td>{student.rfidUid || '—'}</td>
                      <td><span className={student.cardAssigned ? 'present-badge' : 'neutral-badge'}>{student.cardAssigned ? '● Active' : '○ No Card'}</span></td>
                      <td>{student.lastAttendance}</td>
                      <td>
                        <button type="button" className="mini-action" onClick={() => {
                          setAssignmentStudentId(student.studentId)
                          setShowAssignWizard(true)
                        }}>
                          {student.cardAssigned ? 'Reassign' : 'Assign'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {selectedSession && (
        <aside className={`session-drawer ${selectedSession ? 'open' : ''}`} aria-label="Session details">
          <div className="drawer-header">
            <div>
              <p>Session details</p>
              <h3>{selectedSession.name}</h3>
            </div>
            <button type="button" className="close-button" onClick={() => setSelectedSessionId(null)}>×</button>
          </div>

          <div className="drawer-content">
            <div className="detail-grid">
              <div><span>Class</span><strong>{selectedSession.className}</strong></div>
              <div><span>Teacher</span><strong>{selectedSession.teacher}</strong></div>
              <div><span>Date</span><strong>{selectedSession.date}</strong></div>
              <div><span>Time</span><strong>{selectedSession.startTime} — {selectedSession.endTime}</strong></div>
              <div><span>Status</span><strong>{selectedSession.status}</strong></div>
            </div>

            <div className="drawer-progress">
              <div className="row-between">
                <span>Attendance</span>
                <strong>{presentCount} / {selectedSession.capacity}</strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${Math.min((presentCount / selectedSession.capacity) * 100, 100)}%` }} />
              </div>
            </div>

            <div className="drawer-actions">
              {selectedSession.status === 'OPEN' ? (
                <>
                  <button type="button" className="primary-button" onClick={() => setActiveSection('dashboard')}>Continue Attendance</button>
                  <button type="button" className="secondary-button" onClick={() => handleCloseSession(selectedSession.id)}>Close Session</button>
                </>
              ) : (
                <button type="button" className="primary-button" onClick={() => setActiveSection('sessions')}>View Attendance</button>
              )}
            </div>
          </div>
        </aside>
      )}

      {showCreateSession && (
        <div className="modal-backdrop" onClick={() => setShowCreateSession(false)}>
          <div className="session-modal" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header modal-header">
              <div>
                <p>Create session</p>
                <h3>Create Attendance Session</h3>
              </div>
              <button type="button" className="close-button" onClick={() => setShowCreateSession(false)}>×</button>
            </div>

            <div className="modal-grid">
              <label>
                <span>Class</span>
                <input value={sessionForm.className} onChange={(event) => setSessionForm({ ...sessionForm, className: event.target.value })} />
                {formErrors.className && <small>{formErrors.className}</small>}
              </label>

              <label>
                <span>Session name</span>
                <input value={sessionForm.sessionName} onChange={(event) => setSessionForm({ ...sessionForm, sessionName: event.target.value })} />
                {formErrors.sessionName && <small>{formErrors.sessionName}</small>}
              </label>

              <label>
                <span>Teacher</span>
                <input value={sessionForm.teacher} onChange={(event) => setSessionForm({ ...sessionForm, teacher: event.target.value })} />
                {formErrors.teacher && <small>{formErrors.teacher}</small>}
              </label>

              <label>
                <span>Date</span>
                <input type="date" value={sessionForm.date} onChange={(event) => setSessionForm({ ...sessionForm, date: event.target.value })} />
                {formErrors.date && <small>{formErrors.date}</small>}
              </label>

              <label>
                <span>Start time</span>
                <input type="time" value={sessionForm.startTime} onChange={(event) => setSessionForm({ ...sessionForm, startTime: event.target.value })} />
                {formErrors.startTime && <small>{formErrors.startTime}</small>}
              </label>

              <label>
                <span>End time</span>
                <input type="time" value={sessionForm.endTime} onChange={(event) => setSessionForm({ ...sessionForm, endTime: event.target.value })} />
                {formErrors.endTime && <small>{formErrors.endTime}</small>}
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowCreateSession(false)}>Cancel</button>
              <button type="button" className="primary-button" onClick={handleCreateSession}>Create Session</button>
            </div>
          </div>
        </div>
      )}

      {showAssignWizard && (
        <div className="modal-backdrop" onClick={() => setShowAssignWizard(false)}>
          <div className="wizard-modal" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header modal-header">
              <div>
                <p>Assign new card</p>
                <h3>Assign RFID Card</h3>
              </div>
              <button type="button" className="close-button" onClick={() => setShowAssignWizard(false)}>×</button>
            </div>

            <div className="wizard-steps">
              <span className={assignmentStep === 1 ? 'is-active' : ''}>1</span>
              <span className={assignmentStep === 2 ? 'is-active' : ''}>2</span>
              <span className={assignmentStep === 3 ? 'is-active' : ''}>3</span>
            </div>

            {assignmentStep === 1 && (
              <div className="wizard-body">
                <h4>Select student</h4>
                <select value={assignmentStudentId} onChange={(event) => setAssignmentStudentId(event.target.value)}>
                  {students.map((student) => (
                    <option key={student.studentId} value={student.studentId}>{student.name} — {student.studentId}</option>
                  ))}
                </select>
              </div>
            )}

            {assignmentStep === 2 && (
              <div className="wizard-body wizard-scan">
                <h4>Scan card</h4>
                <div className="scanner-mini">
                  <div className="scanner-core small-core">RFID</div>
                </div>
                <p>Place the RFID card on the reader.</p>
                <button type="button" className="primary-button" onClick={() => {
                  const owner = students.find((student) => student.rfidUid === pendingUid && student.studentId !== assignmentStudentId)
                  if (owner) {
                    setReassignment({ currentOwner: owner, targetStudent: students.find((student) => student.studentId === assignmentStudentId), uid: pendingUid })
                  }
                  setAssignmentStep(3)
                }}>Scan card</button>
              </div>
            )}

            {assignmentStep === 3 && (
              <div className="wizard-body">
                <h4>Confirm</h4>
                <div className="confirm-box">
                  <div>
                    <span>Student</span>
                    <strong>{students.find((student) => student.studentId === assignmentStudentId)?.name}</strong>
                  </div>
                  <div>
                    <span>RFID UID</span>
                    <strong>{pendingUid}</strong>
                  </div>
                </div>
              </div>
            )}

            {reassignment && (
              <div className="warning-panel">
                <h4>Card already assigned</h4>
                <p>This RFID card currently belongs to <strong>{reassignment.currentOwner.name}</strong> ({reassignment.currentOwner.studentId}).</p>
                <p>You are attempting to assign it to <strong>{reassignment.targetStudent.name}</strong> ({reassignment.targetStudent.studentId}).</p>
                <p>This action will move the RFID card from {reassignment.currentOwner.name} to {reassignment.targetStudent.name}.</p>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => { setShowAssignWizard(false); setAssignmentStep(1); setReassignment(null) }}>Cancel</button>
              {assignmentStep < 3 ? (
                <button type="button" className="primary-button" onClick={() => setAssignmentStep((current) => Math.min(current + 1, 3))}>Next</button>
              ) : (
                <button type="button" className="primary-button" onClick={reassignment ? confirmReassignment : handleCardAssignment}>Assign Card</button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast, index) => (
          <div key={`${toast.title}-${index}`} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">{toast.type === 'success' ? '✓' : toast.type === 'warning' ? '!' : toast.type === 'error' ? '×' : '?'}</span>
            <div>
              <strong>{toast.title}</strong>
              <small>{toast.description}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
